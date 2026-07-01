export interface NotificationItem {
  id: string;
  isPriority: boolean;
  description: string;
  timeAgo: string;
  userImage?: { src: string; alt: string };
  contentImage?: { src: string; alt: string };
  createdAt: string;
  isRead: boolean;
}

export interface NotificationsResponse {
  notifications: NotificationItem[];
  unreadCount: number;
}
