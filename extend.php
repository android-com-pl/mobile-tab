<?php

namespace ACPL\MobileTab;

use ACPL\MobileTab\Api\Resource\CustomTabItemResource;
use Flarum\Extend;
use Flarum\Frontend\Document;
use Flarum\Api\Resource;
use Flarum\Api\Endpoint;
use Flarum\Api\Schema;
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
                if(!Str::isJson($value)){
                    $logger = resolve(LoggerInterface::class);
                    $logger->error('Invalid JSON in acpl-mobile-tab.items setting');
                    return [];
                }
                return json_decode($value);
            }

            return $value;
        }),

    (new Extend\Frontend('forum'))
        ->content(function (Document $document) {
            $document->meta['viewport'] = "{$document->meta['viewport']}, viewport-fit=cover";
        }),

    new Extend\ApiResource(CustomTabItemResource::class),
    (new Extend\ApiResource(Resource\ForumResource::class))
        ->fields(fn()=>[
            Schema\Relationship\ToMany::make('custom-tab-items')
                ->includable()
                ->get(function (){
                    $settings = resolve(SettingsRepositoryInterface::class);
                    $allItems = $settings->get('acpl-mobile-tab.items');
                    if(is_string($allItems) ){
                        if(!Str::isJson($allItems)){
                            $logger = resolve(LoggerInterface::class);
                            $logger->error('Invalid JSON in acpl-mobile-tab.items setting');
                            return [];
                        }
                        $allItems = json_decode($allItems);
                    }

                    $customItemIds = collect($allItems)
                        ->filter(fn($item)=>str_starts_with($item, 'custom-'))
                        ->map(fn($item)=>str_replace('custom-', '', $item))
                        ->toArray();

                    if(empty($customItemIds)){
                        return [];
                    }

                    return CustomTabItem::query()->whereIn('id', $customItemIds)->get()->all();
                })
        ])
    ->endpoint(Endpoint\Show::class, function (Endpoint\Show $endpoint){
        return $endpoint->addDefaultInclude(['custom-tab-items']);
    }),
];
