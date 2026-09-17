<?php

namespace Acpl\MobileTab\Access;

use Flarum\User\User;
use Illuminate\Database\Eloquent\Builder;

class ScopeVariantVisibility
{
    public function __invoke(User $actor, Builder $query): void
    {
        $query->where('is_enabled', true);

        if ($actor->isAdmin()) {
            return;
        }

        $ids = [];

        foreach ($actor->getPermissions() as $permission) {
            if (preg_match('/^acpl-mobile-tab\.variant(\d+)\.view$/', $permission, $matches)) {
                $ids[] = (int)$matches[1];
            }
        }

        $query->whereIn('id', $ids);
    }
}
