<?php

namespace Acpl\MobileTab;

use Flarum\User\User;
use Illuminate\Container\Attributes\Scoped;

#[Scoped]
final class MobileTabResolver
{
    private MobileTabVariant|null|false $variant = false;

    public function forActor(User $actor): ?MobileTabVariant
    {
        if ($this->variant === false) {
            $this->variant = MobileTabVariant::whereVisibleTo($actor)
                ->orderBy('position')
                ->first();
        }

        return $this->variant;
    }
}
