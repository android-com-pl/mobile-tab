<?php

use Acpl\MobileTab\MobileTabSettings;
use Flarum\Group\Group;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        $schema->create('mobile_tab_variants', function (Blueprint $table) {
            $table->increments('id');
            $table->json('items');
            $table->unsignedTinyInteger('position')->default(0);
            $table->boolean('is_enabled')->default(false);
            $table->index(['is_enabled', 'position']);
        });

        $db = $schema->getConnection();

        $items = $db->table('settings')
            ->where('key', 'acpl-mobile-tab.items')
            ->value('value');

        if ($items === null) {
            $items = json_encode(MobileTabSettings::DEFAULT_ITEMS);
        }

        $id = $db->table('mobile_tab_variants')->insertGetId([
            'items' => $items,
            'position' => 0,
            'is_enabled' => true,
        ]);

        $db->table('group_permission')->insert([
            'group_id' => Group::GUEST_ID,
            'permission' => "acpl-mobile-tab.variant{$id}.view",
        ]);

        $db->table('settings')
            ->where('key', 'acpl-mobile-tab.items')
            ->delete();
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('mobile_tab_variants');
    },
];
