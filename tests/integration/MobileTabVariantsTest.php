<?php

namespace Acpl\MobileTab\Tests;

use Acpl\MobileTab\CustomTabItem;
use Acpl\MobileTab\MobileTabSettings;
use Acpl\MobileTab\MobileTabVariant;
use Flarum\Group\Group;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;

class MobileTabVariantsTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $this->extension('acpl-mobile-tab');
        $this->prepareDatabase([
            'users' => [
                ['id' => 2, 'username' => 'member', 'email' => 'member@example.com', 'password' => '', 'is_email_confirmed' => true],
                ['id' => 3, 'username' => 'moderator', 'email' => 'moderator@example.com', 'password' => '', 'is_email_confirmed' => true],
                ['id' => 4, 'username' => 'unconfirmed', 'email' => 'unconfirmed@example.com', 'password' => '', 'is_email_confirmed' => false],
            ],
            'group_user' => [['user_id' => 3, 'group_id' => Group::MODERATOR_ID]],
        ]);
    }

    private function variant(array $items, int $position, ?int $group = null, bool $enabled = true): MobileTabVariant
    {
        $this->app();
        $variant = new MobileTabVariant;
        $variant->forceFill(['name' => 'Test menu', 'items' => $items, 'position' => $position, 'is_enabled' => $enabled])->save();
        if ($group !== null) {
            $this->database()->table('group_permission')->insert(['permission' => $variant->viewPermission(), 'group_id' => $group]);
        }

        return $variant;
    }

    private function resetMenus(): void
    {
        $this->app();
        MobileTabVariant::all()->each->delete();
    }

    private function items(?int $user = null): array
    {
        return $this->app()->getContainer()->make(MobileTabSettings::class)->items($user ? User::findOrFail($user) : new User);
    }

    public function test_first_visible_menu_wins_for_guest_member_moderator_and_admin(): void
    {
        $this->resetMenus();
        $this->variant(['admin'], 0);
        $this->variant(['moderation'], 1, Group::MODERATOR_ID);
        $this->variant(['member'], 2, Group::MEMBER_ID);
        $this->variant(['public'], 3, Group::GUEST_ID);

        $this->assertSame(['public'], $this->items());
        $this->assertSame(['member'], $this->items(2));
        $this->assertSame(['moderation'], $this->items(3));
        $this->assertSame(['admin'], $this->items(1));
        $this->assertSame(['public'], $this->items(4));
    }

    public function test_disabled_menus_are_skipped_even_for_administrators_and_empty_menu_wins(): void
    {
        $this->resetMenus();
        $this->variant(['disabled'], 0, Group::GUEST_ID, false);
        $this->variant([], 1, Group::GUEST_ID);
        $this->variant(['fallback'], 2, Group::GUEST_ID);
        $this->assertSame([], $this->items());
        $this->assertSame([], $this->items(1));
        MobileTabVariant::query()->update(['is_enabled' => false]);
        $this->assertSame([], $this->items(1));
    }

    public function test_equal_positions_have_a_stable_id_tiebreaker(): void
    {
        $this->resetMenus();
        $this->variant(['first'], 0, Group::GUEST_ID);
        $this->variant(['second'], 0, Group::GUEST_ID);
        $this->assertSame(['first'], $this->items());
    }

    public function test_forum_payload_contains_only_selected_custom_items(): void
    {
        $this->resetMenus();
        foreach ([1, 2] as $id) {
            (new CustomTabItem)->forceFill(['id' => $id, 'label' => "Link $id", 'url' => "/link$id", 'icon' => 'fas fa-link'])->save();
        }
        $this->variant(['custom-2'], 0, Group::MODERATOR_ID);
        $this->variant(['home', 'custom-1'], 1, Group::GUEST_ID);

        $response = $this->send($this->request('GET', '/api'));
        $this->assertSame(200, $response->getStatusCode(), (string) $response->getBody());
        $payload = json_decode((string) $response->getBody(), true);
        $this->assertSame(['home', 'custom-1'], $payload['data']['attributes']['acplMobileTabItems']);
        $custom = array_values(array_filter($payload['included'] ?? [], fn ($item) => $item['type'] === 'custom-tab-items'));
        $this->assertSame(['1'], array_column($custom, 'id'));
    }

    public function test_admin_can_create_update_reorder_and_delete_variants(): void
    {
        $response = $this->send($this->request('POST', '/api/mobile-tab-variants', [
            'authenticatedAs' => 1,
            'json' => ['data' => ['type' => 'mobile-tab-variants', 'attributes' => ['name' => 'Moderation']]],
        ]));
        $this->assertSame(201, $response->getStatusCode(), (string) $response->getBody());
        $data = json_decode((string) $response->getBody(), true)['data'];
        $id = $data['id'];
        $this->assertFalse($data['attributes']['isEnabled']);
        $this->assertSame([], $data['attributes']['items']);

        $response = $this->send($this->request('PATCH', "/api/mobile-tab-variants/$id", [
            'authenticatedAs' => 1,
            'json' => ['data' => ['type' => 'mobile-tab-variants', 'id' => $id, 'attributes' => ['items' => ['home'], 'isEnabled' => true]]],
        ]));
        $this->assertSame(200, $response->getStatusCode(), (string) $response->getBody());
        $ids = MobileTabVariant::orderByDesc('id')->pluck('id')->all();
        $response = $this->send($this->request('POST', '/api/mobile-tab-variants/order', ['authenticatedAs' => 1, 'json' => ['order' => $ids]]));
        $this->assertSame(204, $response->getStatusCode(), (string) $response->getBody());
        $this->assertSame($ids, MobileTabVariant::orderBy('position')->pluck('id')->all());

        $this->database()->table('group_permission')->insert(['permission' => "acpl-mobile-tab.variant$id.view", 'group_id' => Group::MODERATOR_ID]);
        $response = $this->send($this->request('DELETE', "/api/mobile-tab-variants/$id", ['authenticatedAs' => 1]));
        $this->assertSame(204, $response->getStatusCode(), (string) $response->getBody());
        $this->assertFalse($this->database()->table('group_permission')->where('permission', "acpl-mobile-tab.variant$id.view")->exists());
    }

    public function test_non_admins_cannot_manage_variants(): void
    {
        $this->app();
        $id = MobileTabVariant::first()->id;
        foreach ([['GET', '/api/mobile-tab-variants'], ['POST', '/api/mobile-tab-variants'], ['PATCH', "/api/mobile-tab-variants/$id"], ['DELETE', "/api/mobile-tab-variants/$id"], ['POST', '/api/mobile-tab-variants/order']] as [$method, $path]) {
            $response = $this->send($this->request($method, $path, ['authenticatedAs' => 2, 'json' => []]));
            $this->assertSame(403, $response->getStatusCode(), "$method $path: ".$response->getBody());
        }
    }

    public function test_duplicate_items_and_invalid_order_are_rejected(): void
    {
        $response = $this->send($this->request('POST', '/api/mobile-tab-variants', [
            'authenticatedAs' => 1,
            'json' => ['data' => ['type' => 'mobile-tab-variants', 'attributes' => ['name' => 'Invalid', 'items' => ['home', 'home']]]],
        ]));
        $this->assertSame(422, $response->getStatusCode(), (string) $response->getBody());
        $id = MobileTabVariant::first()->id;
        foreach ([[], [$id, $id], [999999]] as $order) {
            $response = $this->send($this->request('POST', '/api/mobile-tab-variants/order', ['authenticatedAs' => 1, 'json' => ['order' => $order]]));
            $this->assertSame(422, $response->getStatusCode(), (string) $response->getBody());
        }
    }

    public function test_migration_preserves_existing_items_and_can_restore_the_public_menu(): void
    {
        $this->app();
        $schema = $this->database()->getSchemaBuilder();
        $migration = require dirname(__DIR__, 2).'/migrations/2026_09_06_000000_create_mobile_tab_variants_table.php';
        $migration['down']($schema);
        $items = ['custom-42', 'home', 'unavailable-extension'];
        $this->database()->table('settings')->updateOrInsert(['key' => MobileTabSettings::ITEMS], ['value' => json_encode($items)]);
        $migration['up']($schema);
        $this->assertSame($items, $this->items());
        $this->assertFalse($this->database()->table('settings')->where('key', MobileTabSettings::ITEMS)->exists());
        $migration['down']($schema);
        $this->assertSame($items, json_decode($this->database()->table('settings')->where('key', MobileTabSettings::ITEMS)->value('value'), true));
    }
}
