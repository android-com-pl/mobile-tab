<?php

namespace Acpl\MobileTab;

use Flarum\User\User;

final class MobileTabResolver
{
    public function forActor(User $actor): ?MobileTabVariant
    {
        return MobileTabVariant::whereVisibleTo($actor)
            ->orderBy('position')
            ->first();
    }
}
