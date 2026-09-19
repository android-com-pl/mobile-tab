<?php

namespace Acpl\MobileTab;

use Acpl\MobileTab\Access\ScopeVariantVisibility;
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
        ->scope(ScopeVariantVisibility::class),

    (new Extend\ApiResource(Resource\ForumResource::class))
        ->fields(fn () => [
            Schema\Arr::make('acplMobileTabItems')
                ->get(fn (object $forum, Context $context): array => resolve(MobileTabResolver::class)
                    ->forActor($context->getActor())
                    ->items ?? []),
            Schema\Relationship\ToMany::make('custom-tab-items')
                ->includable()
                ->get(function (object $forum, Context $context): array {
                    $variant = resolve(MobileTabResolver::class)
                        ->forActor($context->getActor());

                    if ($variant === null) {
                        return [];
                    }

                    $customActiveItemIds = collect($variant->items)
                        ->filter(fn ($item) => is_string($item) && str_starts_with($item, 'custom-'))
                        ->map(fn (string $item) => substr($item, 7));

                    if ($customActiveItemIds->isEmpty()) {
                        return [];
                    }

                    return CustomTabItem::query()
                        ->whereIn('id', $customActiveItemIds)
                        ->get()
                        ->all();
                })
        ])
    ->endpoint(Endpoint\Show::class, function (Endpoint\Show $endpoint) {
        return $endpoint->addDefaultInclude(['custom-tab-items']);
    }),

    (new Extend\Conditional())
        ->whenExtensionEnabled('ramon-chat', fn () => [
            (new Extend\Frontend('forum'))->css(__DIR__.'/less/integrations/ramon-chat.less')
        ])
];
