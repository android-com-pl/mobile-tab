<?php

namespace Acpl\MobileTab;

final class MobileTabSettings
{
    public const string HIDE_ON_SCROLL = 'acpl-mobile-tab.hide_on_scroll';
    public const string SCROLL_THRESHOLD = 'acpl-mobile-tab.scroll_threshold';

    public const array DEFAULT_ITEMS = [
        'home',
        'tags',
        'notifications',
        'session',
    ];
}
