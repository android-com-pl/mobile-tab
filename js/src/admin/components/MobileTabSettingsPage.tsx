import ExtensionPage, { ExtensionPageAttrs } from 'flarum/admin/components/ExtensionPage';
import { VnodeDOM } from 'mithril';
import MobileTabPreview from './MobileTabPreview';
import AvailableItems from './AvailableItems';

export default class MobileTabSettingsPage extends ExtensionPage {
  content(vnode: VnodeDOM<ExtensionPageAttrs, this>) {
    return (
      <div className="ExtensionPage-settings">
        <div className="container">
          <div className="Form">
            <AvailableItems itemsSetting={this.setting('acpl-mobile-tab.items')} />
            <MobileTabPreview itemsSetting={this.setting('acpl-mobile-tab.items')} />
            <div class="Form-body">{this.submitButton()}</div>
          </div>
        </div>
      </div>
    );
  }
}
