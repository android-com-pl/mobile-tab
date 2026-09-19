import app from 'flarum/admin/app';
import Component, { type ComponentAttrs } from 'flarum/common/Component';
import type { MobileTabItemDefinition } from '../../common/types';
import type { Children } from 'mithril';
import Button from 'flarum/common/components/Button';
import classList from 'flarum/common/utils/classList';
import EditCustomTabItemModal from './EditCustomTabItemModal';

interface MobileTabItemAttrs extends ComponentAttrs {
  item: MobileTabItemDefinition & { itemName: string };
}

export default class MobileTabItem extends Component<MobileTabItemAttrs> {
  view(): Children {
    const { item } = this.attrs;
    const source = item.source ?? 'extension';

    return (
      <Button
        className={classList('Button', { 'Button--dashed': source !== 'user' }, 'MobileTab-item', { 'MobileTab-item--editable': source === 'user' })}
        icon={item.icon}
        onclick={() => {
          if (item.source !== 'user') return;

          const id = item.itemName.match(/(\d+)$/);
          if (!id) return;

          app.modal.show(EditCustomTabItemModal, {
            model: app.store.getById('custom-tab-items', id[0]),
          });
        }}
      >
        {item.label}
      </Button>
    );
  }
}
