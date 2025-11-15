import app from 'flarum/admin/app';
import Button from 'flarum/common/components/Button';
import Form from 'flarum/common/components/Form';
import FormModal, { IFormModalAttrs } from 'flarum/common/components/FormModal';
import Icon from 'flarum/common/components/Icon';
import extractText from 'flarum/common/utils/extractText';
import ItemList from 'flarum/common/utils/ItemList';
import Stream from 'flarum/common/utils/Stream';
import { Children, Vnode } from 'mithril';
import CustomTabItem from '../models/CustomTabItem';

interface EditCustomTabItemModalAttrs extends IFormModalAttrs {
  model?: CustomTabItem;
}

export default class EditCustomTabItemModal extends FormModal<EditCustomTabItemModalAttrs> {
  protected customTabItem!: CustomTabItem;
  protected label!: Stream<string>;
  protected icon!: Stream<string>;
  protected url!: Stream<string>;

  oninit(vnode: Vnode<EditCustomTabItemModalAttrs, this>) {
    super.oninit(vnode);

    this.customTabItem = this.attrs.model || app.store.createRecord('custom-tab-items');

    this.label = Stream(this.customTabItem?.label() || '');
    this.icon = Stream(this.customTabItem?.icon() || '');
    this.url = Stream(this.customTabItem?.url() || '');
  }

  className() {
    return 'EditCustomTabItemModal Modal--small';
  }

  title() {
    const label = this.label();
    if (!label.length) return app.translator.trans('acpl-mobile-tab.admin.edit_item.modal_title');

    const iconClass = this.icon();
    if (iconClass.length)
      return (
        <>
          <Icon name={iconClass} /> {label}
        </>
      );

    return label;
  }

  content() {
    return (
      <div className="Modal-body">
        <Form>{this.fields().toArray()}</Form>
      </div>
    );
  }

  fields() {
    const items = new ItemList<Children>();

    items.add(
      'label',
      <div className="Form-group">
        <label>{app.translator.trans('acpl-mobile-tab.admin.edit_item.label')}</label>
        <input
          className="FormControl"
          type="text"
          placeholder={app.translator.trans('acpl-mobile-tab.admin.edit_item.label_placeholder')}
          bidi={this.label}
        />
      </div>
    );

    items.add(
      'url',
      <div className="Form-group">
        <label>{app.translator.trans('acpl-mobile-tab.admin.edit_item.url')}</label>
        <input className="FormControl" type="url" placeholder="https://" bidi={this.url} />
      </div>
    );

    items.add(
      'icon',
      <div className="Form-group">
        <label>{app.translator.trans('acpl-mobile-tab.admin.edit_item.icon')}</label>
        <input className="FormControl" type="text" placeholder="fas fa-home" bidi={this.icon} />
      </div>
    );

    items.add(
      'actions',
      <div className="Form-group Form-controls">
        <Button type="submit" className="Button Button--primary">
          {app.translator.trans('acpl-mobile-tab.admin.edit_item.submit_button')}
        </Button>
        {this.customTabItem.exists && (
          <Button className="Button Button--danger EditCustomTabItemModal-delete" onclick={this.delete.bind(this)}>
            {app.translator.trans('acpl-mobile-tab.admin.edit_item.delete_button')}
          </Button>
        )}
      </div>
    );

    return items;
  }

  submitData() {
    return { label: this.label(), url: this.url(), icon: this.icon() };
  }

  onsubmit(e: SubmitEvent) {
    e.preventDefault();
    this.loading = true;

    this.customTabItem.save(this.submitData()).then(
      () => this.hide(),
      () => (this.loading = false)
    );
  }

  delete() {
    if (!confirm(extractText(app.translator.trans('acpl-mobile-tab.admin.edit_item.delete_item_confirmation')))) {
      return;
    }

    this.loading = true;
    this.customTabItem.delete().then(
      () => this.hide(),
      () => (this.loading = false)
    );
  }
}
