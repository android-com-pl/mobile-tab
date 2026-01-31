<?php

namespace ACPL\MobileTab;

use ACPL\MobileTab\Api\Resource\CustomTabItemResource;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Flarum\Extend;
use Flarum\Frontend\Document;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Str;
use Psr\Log\LoggerInterface;

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
                if (! Str::isJson($value)) {
                    $logger = resolve(LoggerInterface::class);
                    $logger->error('Invalid JSON in acpl-mobile-tab.items setting');

                    return [];
                }

                return json_decode($value);
            }

            return $value;
        })
        ->default('acpl-mobile-tab.hide_on_scroll', true)
        ->serializeToForum('acplMobileTabHideOnScroll', 'acpl-mobile-tab.hide_on_scroll', 'boolval')
        ->default('acpl-mobile-tab.scroll_threshold', 80)
        ->serializeToForum('acplMobileTabScrollThreshold', 'acpl-mobile-tab.scroll_threshold', 'intval'),

    (new Extend\Frontend('forum'))
        ->content(function (Document $document) {
            $document->meta['viewport'] = "{$document->meta['viewport']}, viewport-fit=cover";
        }),

    new Extend\ApiResource(CustomTabItemResource::class),
    (new Extend\ApiResource(Resource\ForumResource::class))
        ->fields(fn () => [
            Schema\Relationship\ToMany::make('custom-tab-items')
                ->includable()
                ->get(function () {
                    $settings = resolve(SettingsRepositoryInterface::class);
                    $activeItems = $settings->get('acpl-mobile-tab.items');
                    if (is_string($activeItems)) {
                        if (! Str::isJson($activeItems)) {
                            $logger = resolve(LoggerInterface::class);
                            $logger->error('Invalid JSON in acpl-mobile-tab.items setting');

                            return [];
                        }
                        $activeItems = json_decode($activeItems);
                    }

                    $customActiveItemIds = collect($activeItems)
                        ->filter(fn ($item) => str_starts_with($item, 'custom-'))
                        ->map(fn ($item) => str_replace('custom-', '', $item));

                    if ($customActiveItemIds->isEmpty()) {
                        return [];
                    }

                    return CustomTabItem::query()->whereIn('id', $customActiveItemIds)->get()->all();
                })
        ])
    ->endpoint(Endpoint\Show::class, function (Endpoint\Show $endpoint) {
        return $endpoint->addDefaultInclude(['custom-tab-items']);
    }),
];
