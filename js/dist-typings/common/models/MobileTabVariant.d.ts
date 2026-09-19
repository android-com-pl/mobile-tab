import Model from 'flarum/common/Model';
export default class MobileTabVariant extends Model {
    items: () => string[];
    is_enabled: () => boolean;
    position: () => number;
    viewPermission(): string;
}
