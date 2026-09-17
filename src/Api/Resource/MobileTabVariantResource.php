<?php


namespace Acpl\MobileTab\Api\Resource;

use Acpl\MobileTab\MobileTabVariant;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource\AbstractDatabaseResource;
use Flarum\Api\Schema;
use Flarum\Api\Sort\SortColumn;
use Illuminate\Support\Arr;
use Laminas\Diactoros\Response\EmptyResponse;
use Tobyz\JsonApiServer\Context;

/** @extends AbstractDatabaseResource<MobileTabVariant> */
class MobileTabVariantResource extends AbstractDatabaseResource
{
    public function type(): string
    {
        return 'mobile-tab-variants';
    }

    public function model(): string
    {
        return MobileTabVariant::class;
    }

    public function endpoints(): array
    {
        return [
            Endpoint\Index::make()
                ->admin()
                ->defaultSort('position'),
            Endpoint\Show::make()
                ->admin(),
            Endpoint\Create::make()
                ->admin(),
            Endpoint\Update::make()
                ->admin(),
            Endpoint\Delete::make()
                ->admin(),
            Endpoint\Endpoint::make('order')
                ->admin()
                ->route('POST', '/order')
                ->action(function (Context $context): void {
                    $order = Arr::get($context->body(), 'order', []);

                    foreach ($order as $position => $id) {
                        MobileTabVariant::query()
                            ->whereKey($id)
                            ->update(['position' => $position]);
                    }
                })
                ->response(fn () => new EmptyResponse()),
        ];
    }

    public function fields(): array
    {
        return [
            Schema\Arr::make('items')
                ->default([])
                ->writable(),
            Schema\Boolean::make('is_enabled')
                ->default(false)
                ->writable(),
            Schema\Integer::make('position'),
        ];
    }

    public function sorts(): array
    {
        return [
            SortColumn::make('position'),
        ];
    }

    public function creating(object $model, Context $context): ?object
    {
        $model->position = (MobileTabVariant::max('position') ?? -1) + 1;
        return $model;
    }
}
