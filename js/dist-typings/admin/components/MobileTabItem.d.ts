import Component, { type ComponentAttrs } from 'flarum/common/Component';
import type { MobileTabItemDefinition } from '../../common/types';
import type { Children } from 'mithril';
interface MobileTabItemAttrs extends ComponentAttrs {
    item: MobileTabItemDefinition & {
        itemName: string;
    };
}
export default class MobileTabItem extends Component<MobileTabItemAttrs> {
    view(): Children;
}
export {};
