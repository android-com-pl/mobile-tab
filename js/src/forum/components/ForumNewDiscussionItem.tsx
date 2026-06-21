import Button from 'flarum/common/components/Button';
import app from 'flarum/forum/app';
import { Children } from 'mithril';
import MobileTabComponent from '../../common/components/MobileTabComponent';

export default class ForumMobileTabSessionItem extends MobileTabComponent {
  view(): Children {
    return (
      <Button
        className="Button Button--link"
        icon={this.attrs.definition.icon}
        onclick={() =>
          app.composer.load(() => import('flarum/forum/components/DiscussionComposer'), { user: app.session.user }).then(() => app.composer.show())
        }
      >
        {this.attrs.definition.label}
      </Button>
    );
  }
}
