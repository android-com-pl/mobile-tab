import app from 'flarum/common/app';
import Button from 'flarum/common/components/Button';
import { Children } from 'mithril';
import MobileTabComponent from '../../common/components/MobileTabComponent';
import MobileTabSessionDropdown from './MobileTabSessionDropdown';

export default class ForumMobileTabSessionItem extends MobileTabComponent {
  view(): Children {
    console.log(this.attrs.definition);

    if (app.session.user) {
      return <MobileTabSessionDropdown />;
    }

    return (
      <Button
        icon={this.attrs.definition}
        className="Button Button--link"
        onclick={() => app.modal.show(() => import('flarum/forum/components/LogInModal'))}
      >
        {app.translator.trans('acpl-mobile-tab.lib.item.log_in')}
      </Button>
    );
  }
}
