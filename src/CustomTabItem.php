<?php

namespace Acpl\MobileTab;

use Flarum\Database\AbstractModel;

/**
 * @property int $id
 * @property string $url
 * @property string $label
 * @property string $icon
 * @property bool $is_internal
 * @property bool $is_new_tab
 */
class CustomTabItem extends AbstractModel
{
    protected $table = 'custom_mobile_tab_items';

    protected $casts = [
        'is_new_tab' => 'bool',
        'is_internal' => 'bool',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
