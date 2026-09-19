<?php

namespace Acpl\MobileTab\Tests\integration;

use Flarum\Group\Group;
use Flarum\Testing\integration\TestCase;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\Attributes\TestWith;

class CustomTabItemsTest extends TestCase
{
    #[Test]
    #[TestWith([false])]
    #[TestWith([true])]
    public function guest_receives_only_custom_items_from_the_selected_variant_with_their_attributes(bool $hasNullItem): void
    {
        $this->extension('acpl-mobile-tab');
        $this->prepareDatabase([
            'mobile_tab_variants' => [
                ['id' => 1, 'position' => 0, 'is_enabled' => true, 'items' => json_encode($hasNullItem ? ['home', null, 'custom-1'] : ['home', 'custom-1'])],
                ['id' => 2, 'position' => 1, 'is_enabled' => true, 'items' => json_encode(['custom-2'])],
            ],
            'group_permission' => [
                ['group_id' => Group::GUEST_ID, 'permission' => 'acpl-mobile-tab.variant1.view'],
                ['group_id' => Group::GUEST_ID, 'permission' => 'acpl-mobile-tab.variant2.view'],
            ],
            'custom_mobile_tab_items' => [
                [
                    'id' => 1,
                    'label' => 'Documentation',
                    'url' => 'https://example.com/docs',
                    'icon' => 'fas fa-book',
                    'is_internal' => false,
                    'is_new_tab' => true,
                ],
                [
                    'id' => 2,
                    'label' => 'Other variant item',
                    'url' => '/other-variant',
                    'icon' => 'fas fa-eye-slash',
                    'is_internal' => true,
                    'is_new_tab' => false,
                ],
            ],
        ]);

        $response = $this->send($this->request('GET', '/api'));

        $this->assertSame(200, $response->getStatusCode());

        $body = json_decode((string) $response->getBody(), true, 512, JSON_THROW_ON_ERROR);

        $this->assertSame([
            ['type' => 'custom-tab-items', 'id' => '1'],
        ], $body['data']['relationships']['custom-tab-items']['data']);

        $items = array_values(array_filter($body['included'], fn (array $item) => $item['type'] === 'custom-tab-items'));

        $this->assertCount(1, $items);
        $this->assertSame('1', $items[0]['id']);
        $this->assertSame('Documentation', $items[0]['attributes']['label']);
        $this->assertSame('https://example.com/docs', $items[0]['attributes']['url']);
        $this->assertSame('fas fa-book', $items[0]['attributes']['icon']);
        $this->assertFalse($items[0]['attributes']['isInternal']);
        $this->assertTrue($items[0]['attributes']['isNewTab']);
    }
}
