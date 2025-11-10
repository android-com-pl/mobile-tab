import Component from 'flarum/common/Component';
import { IButtonAttrs } from 'flarum/common/components/Button';
import LinkButton from 'flarum/common/components/LinkButton';
import { Vnode } from 'mithril';

export interface MobileTabItemAttrs extends IButtonAttrs {
  href: string;
}

export default class MobileTabItem extends Component<MobileTabItemAttrs> {
  view(vnode: Vnode<MobileTabItemAttrs, this>) {
    return (
      <LinkButton className="MobileTab-item" href={this.attrs.href} icon={this.attrs.icon}>
        {vnode.children}
      </LinkButton>
    );
  }
}
