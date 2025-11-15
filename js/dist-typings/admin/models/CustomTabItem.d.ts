import Model from 'flarum/common/Model';
export default class CustomTabItem extends Model {
    label: () => string;
    url: () => string;
    icon: () => string;
    createdAt: () => Date | null | undefined;
    updatedAt: () => Date | null | undefined;
}
