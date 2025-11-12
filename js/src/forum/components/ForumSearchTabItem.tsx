import Button from 'flarum/common/components/Button';
import app from 'flarum/forum/app';
import GlobalSearch from 'flarum/forum/components/GlobalSearch';
import { Children } from 'mithril';
import MobileTabComponent from '../../common/components/MobileTabComponent';

export default class ForumSearchTabItem extends MobileTabComponent {
  view(): Children {
    const { icon, label } = this.attrs.definition;

    return (
      <Button
        className="Button Button--link"
        icon={icon}
        onclick={() =>
          app.modal.show(() => import('flarum/common/components/SearchModal'), {
            searchState: app.search.state,
            sources: GlobalSearch.prototype.sourceItems().toArray(),
          })
        }
      >
        {label}
      </Button>
    );
  }
}
