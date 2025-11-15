<?php

use Flarum\Database\Migration;
use Illuminate\Database\Schema\Blueprint;

return Migration::createTable(
    'custom_mobile_tab_items',
    function (Blueprint $table) {
        $table->increments('id');
        $table->string('label');
        $table->string('url');
        $table->string('icon');
        $table->boolean('is_internal')->default(true);
        $table->boolean('is_new_tab')->default(false);
        $table->dateTime('created_at')->nullable()->useCurrent();
        $table->dateTime('updated_at')->nullable()->useCurrent()->useCurrentOnUpdate();
    }
);
