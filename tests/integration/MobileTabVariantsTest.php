<?php

namespace Acpl\MobileTab\Tests\integration;

use Flarum\Group\Group;
use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use Flarum\User\User;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\Test;

class MobileTabVariantsTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    protected function setUp(): void
    {
        parent::setUp();

        $this->extension('acpl-mobile-tab');
        $this->prepareDatabase([
            User::class => [
                $this->normalUser(),
                ['id' => 3, 'username' => 'moderator', 'email' => 'moderator@machine.local', 'is_email_confirmed' => 1],
            ],
            'group_user' => [
                ['user_id' => 3, 'group_id' => Group::MODERATOR_ID],
            ],
        ]);

        // Replace the default variant and permission created by the migration.
        $this->database()->table('mobile_tab_variants')->delete();
        $this->database()->table('group_permission')->where('permission', 'like', 'acpl-mobile-tab.variant%')->delete();
    }

    /**
     * @param list<array{int, int}> $grants
     * @param list<int> $disabledVariantIds
     * @param list<string> $expectedItems
     */
    #[Test]
    #[DataProvider('visibilityCases')]
    public function forum_returns_the_first_enabled_variant_visible_to_the_actor(
        ?int $actorId,
        array $grants,
        array $disabledVariantIds,
        array $expectedItems
    ): void {
        $this->database()->table('mobile_tab_variants')->insert([
            ['id' => 1, 'position' => 20, 'is_enabled' => ! in_array(1, $disabledVariantIds, true), 'items' => json_encode(['home'])],
            ['id' => 2, 'position' => 10, 'is_enabled' => ! in_array(2, $disabledVariantIds, true), 'items' => json_encode(['tags', 'notifications'])],
        ]);

        foreach ($grants as [$groupId, $variantId]) {
            $this->database()->table('group_permission')->insert([
                'group_id' => $groupId,
                'permission' => "acpl-mobile-tab.variant{$variantId}.view",
            ]);
        }

        $this->database()->enableQueryLog();
        $this->database()->flushQueryLog();

        $response = $this->send($this->request('GET', '/api', ['authenticatedAs' => $actorId]));

        $this->assertSame(200, $response->getStatusCode());
        $body = json_decode((string) $response->getBody(), true, 512, JSON_THROW_ON_ERROR);
        $this->assertSame($expectedItems, $body['data']['attributes']['acplMobileTabItems']);
        $this->assertSame([], $body['data']['relationships']['custom-tab-items']['data']);
        $this->assertCount(1, array_filter(
            $this->database()->getQueryLog(),
            fn (array $query) => str_contains($query['query'], 'mobile_tab_variants')
                && str_starts_with($query['query'], 'select')
        ));
    }

    public static function visibilityCases(): array
    {
        return [
            'guest skips members-only variant' => [null, [[Group::GUEST_ID, 1], [Group::MEMBER_ID, 2]], [], ['home']],
            'member chooses first permitted position' => [2, [[Group::GUEST_ID, 1], [Group::MEMBER_ID, 2]], [], ['tags', 'notifications']],
            'member inherits public permission' => [2, [[Group::GUEST_ID, 1]], [], ['home']],
            'moderator group grants access' => [3, [[Group::MODERATOR_ID, 2]], [], ['tags', 'notifications']],
            'member cannot access moderator variant' => [2, [[Group::MODERATOR_ID, 2]], [], []],
            'disabled variant is skipped' => [null, [[Group::GUEST_ID, 1], [Group::GUEST_ID, 2]], [2], ['home']],
            'no permission means no tabs' => [2, [], [], []],
            'all permitted variants disabled' => [null, [[Group::GUEST_ID, 1], [Group::GUEST_ID, 2]], [1, 2], []],
            'administrator needs no grants' => [1, [], [], ['tags', 'notifications']],
            'administrator also skips disabled variants' => [1, [], [2], ['home']],
        ];
    }
}
