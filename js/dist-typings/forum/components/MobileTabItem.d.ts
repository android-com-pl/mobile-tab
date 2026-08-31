import type { Children, Vnode } from 'mithril';
import type { ComponentAttrs } from 'flarum/common/Component';
import Component from 'flarum/common/Component';
interface MobileTabItemAttrs extends ComponentAttrs {
    route: string;
    icon: string;
    label: string;
}
export default class MobileTabItem extends Component<MobileTabItemAttrs> {
    view(vnode: Vnode<MobileTabItemAttrs, this>): Children;
}
export {};
