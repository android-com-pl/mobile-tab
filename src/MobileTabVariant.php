<?php

namespace Acpl\MobileTab;

use Flarum\Database\AbstractModel;
use Flarum\Database\ScopeVisibilityTrait;
use Flarum\Group\Permission;
use Illuminate\Database\Eloquent\Attributes\Table;

/**
 * @property int $id
 * @property list<string> $items
 * @property int $position
 * @property bool $is_enabled
 */
#[Table('mobile_tab_variants')]
class MobileTabVariant extends AbstractModel
{
    use ScopeVisibilityTrait;

    public static function booted(): void
    {
        static::deleted(function (self $variant) {
            Permission::where('permission', $variant->viewPermissionKey())->delete();
        });
    }

    protected function casts(): array
    {
        return [
            'items' => 'array',
            'position' => 'integer',
            'is_enabled' => 'boolean',
        ];
    }

    public function viewPermissionKey(): string
    {
        return "acpl-mobile-tab.variant{$this->id}.view";
    }
}
