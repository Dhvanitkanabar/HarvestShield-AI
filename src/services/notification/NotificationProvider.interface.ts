import { NotificationType } from '@prisma/client';

export interface NotificationData {
  userId: string;
  message: string;
  type: NotificationType;
  alertId?: string;
}

export interface INotificationProvider {
  send(notification: NotificationData): Promise<boolean>;
}
