import MobileTabItemsRegistry from '../../common/MobileTabItemsRegistry';
import ForumMobileTabSessionItem from '../components/ForumMobileTabSessionItem';
import ForumNewDiscussionItem from '../components/ForumNewDiscussionItem';
import ForumSearchTabItem from '../components/ForumSearchTabItem';
import ForumChatTabItem from '../components/integrations/ForumChatTabItem';

/**
 * Extends the base `MobileTabItemsRegistry` to safely add forum-specific logic.
 *
 * Its primary purpose is to assign `forumComponent` handlers or add new items
 * that depend on components imported from the `flarum/forum` application (e.g. `SessionDropdown`).
 *
 * These forum-specific imports cannot be placed in `common/MobileTabItemsRegistry`
 * because that file is also loaded by the admin panel,
 * which would cause a crash as the imports are not available in the admin context.
 */
export default class MobileTabItemsRegistryForum extends MobileTabItemsRegistry {
  items() {
    const items = super.items();

    items.setContent('new_discussion', {
      ...items.get('new_discussion'),
      forumComponent: ForumNewDiscussionItem,
    });

    items.setContent('session', {
      ...items.get('session'),
      forumComponent: ForumMobileTabSessionItem,
    });

    items.setContent('search', {
      ...items.get('search'),
      forumComponent: ForumSearchTabItem,
    });

    if (items.has('ramon-chat')) {
      items.setContent('ramon-chat', {
        ...items.get('ramon-chat'),
        forumComponent: ForumChatTabItem,
      });
    }

    return items;
  }
}
