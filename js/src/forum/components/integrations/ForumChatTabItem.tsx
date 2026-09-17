import ForumNotificationsTabItem from '../ForumNotificationsTabItem';
// @ts-ignore - missing dist-typings in ramon/chat
import ChatState from 'ext:ramon/chat/forum/state/chat';

export default class ForumChatTabItem extends ForumNotificationsTabItem {
  getUnreadCount(): number | null {
    try {
      const { messages, mentions } = ChatState.unreadSummary();

      return mentions > 0 ? mentions : messages;
    } catch {
      return null;
    }
  }
}
