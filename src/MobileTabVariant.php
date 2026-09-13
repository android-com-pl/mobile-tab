<?php

namespace Acpl\MobileTab;

use Flarum\Database\AbstractModel;
use Flarum\Database\ScopeVisibilityTrait;
use Flarum\Group\Permission;

/**
 * @property int $id
 * @property string $name
 * @property array $items
 * @property int $position
 * @property bool $is_enabled
 */
class MobileTabVariant extends AbstractModel
{
    use ScopeVisibilityTrait;

    protected $table = 'mobile_tab_variants';

    protected $casts = ['items' => 'array', 'is_enabled' => 'boolean', 'position' => 'integer'];

    public static function boot(): void
    {
        parent::boot();

        static::deleted(function (self $variant) {
            Permission::where('permission', $variant->viewPermission())->delete();
        });
    }

    public function viewPermission(): string
    {
        return "acpl-mobile-tab.variant{$this->id}.view";
    }
}
