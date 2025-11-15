<?php

namespace ACPL\MobileTab\Api\Resource;

use Flarum\Api\Endpoint;
use Flarum\Api\Resource;
use Flarum\Api\Schema;
use Flarum\Api\Sort\SortColumn;
use ACPL\MobileTab\CustomTabItem;

/**
 * @extends Resource\AbstractDatabaseResource<CustomTabItem>
 */
class CustomTabItemResource extends Resource\AbstractDatabaseResource
{
    public function type(): string
    {
        return 'custom-tab-items';
    }

    public function model(): string
    {
        return CustomTabItem::class;
    }

    public function endpoints(): array
    {
        return [
            Endpoint\Create::make()
                ->admin(),
            Endpoint\Update::make()
                ->admin(),
            Endpoint\Delete::make()
                ->admin(),
            Endpoint\Show::make()
                ->admin(),
            Endpoint\Index::make()
                ->admin()
                ->paginate(),
        ];
    }

    public function fields(): array
    {
        return [
            Schema\Str::make('label')
                ->requiredOnCreate()
                ->minLength(1)
                ->maxLength(255)
                ->writable(),
            Schema\Str::make('url')
                ->requiredOnCreate()
                ->writable(),
            Schema\Str::make('icon')
                ->requiredOnCreate()
                ->writable(),
            Schema\Boolean::make('isNewTab'),
            Schema\DateTime::make('createdAt'),
            Schema\DateTime::make('updatedAt'),
        ];
    }

    public function sorts(): array
    {
        return [
            SortColumn::make('createdAt'),
            SortColumn::make('updatedAt'),
        ];
    }
}
