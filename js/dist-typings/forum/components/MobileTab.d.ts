import type { Children, Vnode } from 'mithril';
import type { ComponentAttrs } from 'flarum/common/Component';
import Component from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
export default class MobileTab extends Component {
    view(vnode: Vnode<ComponentAttrs, this>): Children;
    items(): ItemList<Children>;
}
