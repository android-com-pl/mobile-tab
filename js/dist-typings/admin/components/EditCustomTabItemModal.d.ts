import FormModal, { IFormModalAttrs } from 'flarum/common/components/FormModal';
import ItemList from 'flarum/common/utils/ItemList';
import Stream from 'flarum/common/utils/Stream';
import { Children, Vnode } from 'mithril';
import CustomTabItem from '../../common/models/CustomTabItem';
interface EditCustomTabItemModalAttrs extends IFormModalAttrs {
    model?: CustomTabItem;
}
export default class EditCustomTabItemModal extends FormModal<EditCustomTabItemModalAttrs> {
    protected customTabItem: CustomTabItem;
    protected label: Stream<string>;
    protected icon: Stream<string>;
    protected url: Stream<string>;
    protected isInternal: Stream<boolean>;
    protected isNewTab: Stream<boolean>;
    oninit(vnode: Vnode<EditCustomTabItemModalAttrs, this>): void;
    className(): string;
    title(): any;
    content(): JSX.Element;
    fields(): ItemList<Children>;
    submitData(): {
        label: any;
        url: any;
        icon: any;
        isInternal: any;
        isNewTab: any;
    };
    onsubmit(e: SubmitEvent): void;
    delete(): void;
}
export {};
