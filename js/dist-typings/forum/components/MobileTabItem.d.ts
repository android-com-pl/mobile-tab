import Component from 'flarum/common/Component';
import { IButtonAttrs } from 'flarum/common/components/Button';
import { Vnode } from 'mithril';
export interface MobileTabItemAttrs extends IButtonAttrs {
    href: string;
    target?: string;
    external?: boolean;
    counter?: () => number;
}
export default class MobileTabItem extends Component<MobileTabItemAttrs> {
    view(vnode: Vnode<MobileTabItemAttrs, this>): JSX.Element;
}
