<?php

namespace Acpl\MobileTab;

use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Support\Str;
use Psr\Log\LoggerInterface;

class MobileTabSettings
{
    public const string ITEMS = 'acpl-mobile-tab.items';
    public const string HIDE_ON_SCROLL = 'acpl-mobile-tab.hide_on_scroll';
    public const string SCROLL_THRESHOLD = 'acpl-mobile-tab.scroll_threshold';

    public function __construct(
        private readonly SettingsRepositoryInterface $settings,
        private readonly LoggerInterface $logger
    ) {
    }

    public function items(): array
    {
        return $this->decodeItems($this->settings->get(self::ITEMS));
    }

    public function decodeItems(mixed $value): array
    {
        if (is_string($value)) {
            if (! Str::isJson($value)) {
                $this->logger->error('Invalid JSON in acpl-mobile-tab.items setting');

                return [];
            }

            $decoded = json_decode($value, true);

            return is_array($decoded) ? $decoded : [];
        }

        return is_array($value) ? $value : [];
    }
}
