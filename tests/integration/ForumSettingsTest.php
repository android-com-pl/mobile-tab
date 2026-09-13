<?php

namespace Acpl\MobileTab\Tests\integration;

use Flarum\Testing\integration\TestCase;
use PHPUnit\Framework\Attributes\Test;

class ForumSettingsTest extends TestCase
{
    #[Test]
    public function guest_can_read_default_mobile_tab_settings(): void
    {
        $this->extension('acpl-mobile-tab');

        $response = $this->send($this->request('GET', '/api'));

        $this->assertSame(200, $response->getStatusCode());

        $attributes = json_decode((string) $response->getBody(), true, 512, JSON_THROW_ON_ERROR)['data']['attributes'];

        $this->assertSame(['home', 'tags', 'notifications', 'session'], $attributes['acplMobileTabItems']);
        $this->assertTrue($attributes['acplMobileTabHideOnScroll']);
        $this->assertSame(80, $attributes['acplMobileTabScrollThreshold']);
    }
}
