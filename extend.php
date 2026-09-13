<?php

namespace Acpl\MobileTab;

use Acpl\MobileTab\Api\Resource\CustomTabItemResource;
use Acpl\MobileTab\Api\Resource\MobileTabVariantResource;
use Flarum\Api\Context;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
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
        ->default(MobileTabSettings::HIDE_ON_SCROLL, true)
        ->serializeToForum('acplMobileTabHideOnScroll', MobileTabSettings::HIDE_ON_SCROLL, 'boolval')
        ->default(MobileTabSettings::SCROLL_THRESHOLD, 80)
        ->serializeToForum('acplMobileTabScrollThreshold', MobileTabSettings::SCROLL_THRESHOLD, 'intval'),

    (new Extend\Frontend('forum'))
        ->content(function (Document $document) {
            $document->meta['viewport'] = "{$document->meta['viewport']}, viewport-fit=cover";
        }),

    new Extend\ApiResource(CustomTabItemResource::class),
    new Extend\ApiResource(MobileTabVariantResource::class),
    (new Extend\ModelVisibility(MobileTabVariant::class))
        ->scope(Access\ScopeVariantVisibility::class),
    (new Extend\ApiResource(Resource\ForumResource::class))
        ->fields(fn () => [
            Schema\Arr::make('acplMobileTabItems')
                ->get(fn (object $forum, Context $context) => resolve(MobileTabSettings::class)->items($context->getActor())),
            Schema\Relationship\ToMany::make('custom-tab-items')
                ->includable()
                ->get(function (object $forum, Context $context) {
                    // This extender callback does not support container injection.
                    $activeItems = resolve(MobileTabSettings::class)->items($context->getActor());

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
