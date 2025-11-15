import app from 'flarum/admin/app';
import Button from 'flarum/common/components/Button';
import Form from 'flarum/common/components/Form';
import FormGroup from 'flarum/common/components/FormGroup';
import FormModal, { IFormModalAttrs } from 'flarum/common/components/FormModal';
import Icon from 'flarum/common/components/Icon';
import extractText from 'flarum/common/utils/extractText';
import ItemList from 'flarum/common/utils/ItemList';
import Stream from 'flarum/common/utils/Stream';
import { Children, Vnode } from 'mithril';
import CustomTabItem from '../../common/models/CustomTabItem';

interface EditCustomTabItemModalAttrs extends IFormModalAttrs {
  model?: CustomTabItem;
}

export default class EditCustomTabItemModal extends FormModal<EditCustomTabItemModalAttrs> {
  protected customTabItem!: CustomTabItem;
  protected label!: Stream<string>;
  protected icon!: Stream<string>;
  protected url!: Stream<string>;
  protected isInternal!: Stream<boolean>;
  protected isNewTab!: Stream<boolean>;

  oninit(vnode: Vnode<EditCustomTabItemModalAttrs, this>) {
    super.oninit(vnode);

    this.customTabItem = this.attrs.model || app.store.createRecord('custom-tab-items');

    this.label = Stream(this.customTabItem?.label() || '');
    this.icon = Stream(this.customTabItem?.icon() || '');
    this.url = Stream(this.customTabItem?.url() || '');
    this.isInternal = Stream(this.customTabItem?.isInternal() || true);
    this.isNewTab = Stream(this.customTabItem?.isNewTab() || false);
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
      <FormGroup
        type="text"
        label={app.translator.trans('acpl-mobile-tab.admin.edit_item.label')}
        placeholder={app.translator.trans('acpl-mobile-tab.admin.edit_item.label_placeholder')}
        bidi={this.label}
        required
      />
    );

    items.add(
      'icon',
      <FormGroup
        type="text"
        label={app.translator.trans('acpl-mobile-tab.admin.edit_item.icon')}
        help={app.translator.trans('acpl-mobile-tab.admin.edit_item.icon_help', { a: <a href={app.refs.fontawesome} target="_blank" /> })}
        placeholder="fas fa-home"
        bidi={this.icon}
        required
      />
    );

    items.add(
      'url',
      <FormGroup
        type={this.isInternal() ? 'text' : 'url'}
        label={app.translator.trans(`acpl-mobile-tab.admin.edit_item.${this.isInternal() ? 'path' : 'url'}`)}
        placeholder={this.isInternal() ? '/example-path' : 'https://example.com'}
        bidi={this.url}
        required
      />
    );

    items.add('checkboxes', [
      <FormGroup
        type="boolean"
        label={app.translator.trans('acpl-mobile-tab.admin.edit_item.is_internal_checkbox')}
        // bidi is not working for a Checkbox component
        state={this.isInternal()}
        onchange={(value: boolean) => this.isInternal(value)}
      />,
      <FormGroup
        type="boolean"
        label={app.translator.trans('acpl-mobile-tab.admin.edit_item.open_new_tab_checkbox')}
        // bidi is not working for a Checkbox component
        state={this.isNewTab()}
        onchange={(value: boolean) => this.isNewTab(value)}
      />,
    ]);

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
    return { label: this.label(), url: this.url(), icon: this.icon(), isInternal: this.isInternal(), isNewTab: this.isNewTab() };
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
