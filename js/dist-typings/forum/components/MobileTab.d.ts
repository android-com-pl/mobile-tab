import type { ComponentAttrs } from 'flarum/common/Component';
import Component from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import type { Children, Vnode } from 'mithril';
import { MobileTabItemDefinition } from '../../common/types';
export default class MobileTab extends Component {
    view(vnode: Vnode<ComponentAttrs, this>): Children;
    items(): ItemList<MobileTabItemDefinition>;
}
