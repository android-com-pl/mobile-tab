import { Vnode } from 'mithril';
import Component from 'flarum/common/Component';
import LinkButton from 'flarum/common/components/LinkButton';
import { IButtonAttrs } from 'flarum/common/components/Button';

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
