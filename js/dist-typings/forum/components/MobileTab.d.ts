import type { ComponentAttrs } from 'flarum/common/Component';
import Component from 'flarum/common/Component';
import ItemList from 'flarum/common/utils/ItemList';
import type { Children, Vnode } from 'mithril';
import { MobileTabItemDefinition } from '../../common/types';
export default class MobileTab extends Component {
    private lastScrollTop;
    private scrollThreshold;
    private isHidden;
    oncreate(vnode: Vnode<ComponentAttrs, this>): void;
    onremove(vnode: Vnode<ComponentAttrs, this>): void;
    view(vnode: Vnode<ComponentAttrs, this>): Children;
    items(): ItemList<MobileTabItemDefinition>;
    show: () => void;
    hide: () => void;
    handleScroll: (event: Event) => void;
    /**
     * Reset the reference point when scrolling stops.
     * This prevents small, accumulated deltas from triggering visibility changes immediately after the user pauses and resumes scrolling.
     */
    private resetScrollReference;
}
