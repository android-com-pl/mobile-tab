import Component, { ComponentAttrs } from 'flarum/common/Component';
import { MobileTabItemDefinition } from '../types';
export interface MobileTabComponentAttrs extends ComponentAttrs {
    definition: MobileTabItemDefinition;
}
export default abstract class MobileTabComponent extends Component<MobileTabComponentAttrs> {
}
