import Component, { ComponentAttrs } from 'flarum/common/Component';
import Mithril from 'mithril';
import MobileTabVariant from '../../common/models/MobileTabVariant';
import type Sortable from 'sortablejs';
interface MobileTabVariantSettingsAttrs extends ComponentAttrs {
    variant: MobileTabVariant;
    index: number;
    onSortEnd: () => void;
}
export default class MobileTabVariantSettings extends Component<MobileTabVariantSettingsAttrs> {
    protected sortable?: Sortable;
    view(vnode: Mithril.Vnode<MobileTabVariantSettingsAttrs, this>): Mithril.Children;
    enabledItems(): {
        label: string | Mithril.Children;
        icon: string;
        canView?: boolean | (() => boolean);
        counter?: () => number | null | undefined;
        forumComponent?: typeof Component<any> | Mithril.Children;
        href?: string | (() => string);
        isInternal?: boolean;
        isNewTab?: boolean;
        source?: 'core' | 'extension' | 'user';
        itemName: string;
    }[];
    createSortable(element: HTMLElement): Promise<void>;
    deleteVariant(): Promise<void>;
}
export {};
