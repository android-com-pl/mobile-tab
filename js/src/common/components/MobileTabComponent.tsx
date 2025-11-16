import Component, { ComponentAttrs } from 'flarum/common/Component';
import { MobileTabItemDefinition } from '../types';

export interface MobileTabComponentAttrs extends ComponentAttrs {
  definition: MobileTabItemDefinition;
}

/**
 * When extending this component, you get access to the item definition via `this.attrs.definition`.
 */
export default abstract class MobileTabComponent extends Component<MobileTabComponentAttrs> {}
