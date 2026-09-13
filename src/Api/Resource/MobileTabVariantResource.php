<?php

namespace Acpl\MobileTab\Api\Resource;

use Acpl\MobileTab\MobileTabVariant;
use Flarum\Api\Endpoint;
use Flarum\Api\Resource\AbstractDatabaseResource;
use Flarum\Api\Schema;
use Illuminate\Contracts\Validation\Factory;
use Illuminate\Database\Eloquent\Builder;
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
            Endpoint\Index::make()->admin(),
            Endpoint\Show::make()->admin(),
            Endpoint\Create::make()->admin(),
            Endpoint\Update::make()->admin(),
            Endpoint\Delete::make()->admin(),
            Endpoint\Endpoint::make('order')->admin()->route('POST', '/order')
                ->action(function (Context $context) {
                    $data = (array) $context->request->getParsedBody();
                    resolve(Factory::class)->make($data, [
                        'order' => ['present', 'array', 'list'],
                        'order.*' => ['required', 'integer', 'distinct', 'exists:mobile_tab_variants,id'],
                    ])->validate();

                    $db = (new MobileTabVariant)->getConnection();
                    $db->transaction(function () use ($data) {
                        $ids = MobileTabVariant::query()->lockForUpdate()->pluck('id')->all();
                        // Reject stale lists rather than silently losing a concurrently added variant.
                        resolve(Factory::class)->make($data, [
                            'order' => ['size:'.count($ids)],
                        ])->validate();
                        foreach ($data['order'] as $position => $id) {
                            MobileTabVariant::where('id', $id)->update(['position' => $position]);
                        }
                    });
                })->response(fn () => new EmptyResponse()),
        ];
    }

    public function fields(): array
    {
        return [
            Schema\Str::make('name')->requiredOnCreate()->minLength(1)->maxLength(255)->writable(),
            Schema\Arr::make('items')->default([])->writable(),
            Schema\Boolean::make('isEnabled')->default(false)->writable(),
            Schema\Integer::make('position'),
        ];
    }

    public function scope(Builder $query, Context $context): void
    {
        $query->orderBy('position')->orderBy('id');
    }

    public function creating(object $model, Context $context): ?object
    {
        $model->position = (MobileTabVariant::max('position') ?? -1) + 1;

        return $model;
    }

    public function mutateDataBeforeValidation(Context $context, array $data): array
    {
        resolve(Factory::class)->make($data['attributes'] ?? [], [
            'items' => ['sometimes', 'array', 'list'],
            'items.*' => ['required', 'string', 'distinct', 'max:255'],
        ])->validate();

        return $data;
    }
}
