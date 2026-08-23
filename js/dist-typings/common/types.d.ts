import Component from 'flarum/common/Component';
import { Children } from 'mithril';
export interface MobileTabItemDefinition {
    label: string | Children;
    /**
     * The FontAwesome icon class.
     * @example icon: 'fas fa-home'
     */
    icon: string;
    /**
     * A boolean or a function to determine if the item should be displayed.
     * This is checked on the forum frontend before rendering.
     * Defaults to `true` if not provided.
     */
    canView?: boolean | (() => boolean);
    /**
     * A custom component to render for this item on the forum fronted.
     *
     * If provided, this component will be rendered instead of the default `MobileTabItem`.
     * The component will receive all other properties of the `MobileTabItemDefinition` interface (key, label, icon, href, etc.) as its `attrs.definition`.
     */
    forumComponent?: typeof Component<any> | Children;
    /**
     * The URL (or a function returning a URL).
     * This is only used if a custom `forumComponent` is not provided, as it's an attribute for the default `MobileTabItem` component.
     */
    href?: string | (() => string);
    isInternal?: boolean;
    isNewTab?: boolean;
    /**
     * The source of the item, used to distinguish core items from extension-added or user-created items (from admin settings).
     */
    source?: 'core' | 'extension' | 'user';
}
