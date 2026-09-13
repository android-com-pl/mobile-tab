<?php

namespace Acpl\MobileTab\Tests\integration;

use Acpl\MobileTab\MobileTabSettings;
use Flarum\Testing\integration\TestCase;
use PHPUnit\Framework\Attributes\Test;

class CustomTabItemsTest extends TestCase
{
    #[Test]
    public function guest_receives_only_enabled_custom_items_with_their_attributes(): void
    {
        $this->extension('acpl-mobile-tab');
        $this->setting(MobileTabSettings::ITEMS, json_encode(['home', 'custom-1']));
        $this->prepareDatabase([
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
                    'label' => 'Disabled item',
                    'url' => '/disabled',
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
