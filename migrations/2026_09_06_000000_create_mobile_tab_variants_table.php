<?php

use Flarum\Group\Group;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->create('mobile_tab_variants', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name');
            $table->text('items');
            $table->unsignedInteger('position')->default(0);
            $table->boolean('is_enabled')->default(false);
            $table->index(['is_enabled', 'position']);
        });

        $db = $schema->getConnection();
        $db->transaction(function () use ($db) {
            $value = $db->table('settings')->where('key', 'acpl-mobile-tab.items')->value('value');
            $items = $value === null ? ['home', 'tags', 'notifications', 'session'] : json_decode($value, true);
            $items = is_array($items) ? array_values(array_unique(array_filter($items, 'is_string'))) : [];

            $id = $db->table('mobile_tab_variants')->insertGetId([
                'name' => 'Default',
                'items' => json_encode($items),
                'position' => 0,
                'is_enabled' => true,
            ]);
            $db->table('group_permission')->insert([
                'group_id' => Group::GUEST_ID,
                'permission' => "acpl-mobile-tab.variant{$id}.view",
            ]);
            $db->table('settings')->where('key', 'acpl-mobile-tab.items')->delete();
        });
    },
    'down' => function (Builder $schema) {
        $db = $schema->getConnection();
        $db->transaction(function () use ($db) {
            // Restore the first public menu for installations reverting to one menu.
            $permissions = $db->table('group_permission')->where('group_id', Group::GUEST_ID)->pluck('permission')->all();
            $items = $db->table('mobile_tab_variants')
                ->where('is_enabled', true)->orderBy('position')->orderBy('id')
                ->get(['id', 'items'])
                ->first(fn ($row) => in_array("acpl-mobile-tab.variant{$row->id}.view", $permissions, true))?->items;
            $db->table('settings')->updateOrInsert(['key' => 'acpl-mobile-tab.items'], ['value' => $items ?? '[]']);
            $db->table('group_permission')->where('permission', 'like', 'acpl-mobile-tab.variant%.view')->delete();
        });
        $schema->drop('mobile_tab_variants');
    },
];
