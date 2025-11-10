<?php

namespace ACPL\MobileTab;

use Flarum\Extend;
use Flarum\Frontend\Document;

return [
    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js')
        ->css(__DIR__.'/less/admin.less'),

    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),

    new Extend\Locales(__DIR__.'/locale'),

    (new Extend\Settings)
        ->default('acpl-mobile-tab.items', ['home', 'tags', 'notifications', 'session'])
        ->serializeToForum('acplMobileTabItems', 'acpl-mobile-tab.items', function ($value) {
            if (is_string($value)) {
                return json_decode($value, true);
            }

            return $value;
        }),

    (new Extend\Frontend('forum'))
        ->content(function (Document $document) {
            $document->meta['viewport'] = "{$document->meta['viewport']}, viewport-fit=cover";
        }),
];
