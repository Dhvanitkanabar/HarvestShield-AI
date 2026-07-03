import { INotificationProvider, NotificationData } from './NotificationProvider.interface';

export class PushNotificationProvider implements INotificationProvider {
  async send(notification: NotificationData): Promise<boolean> {
    console.log(`[PushNotificationProvider] Sending Push Notification to User ${notification.userId}: ${notification.message}`);
    // Mock implementation for future Firebase Cloud Messaging integration
    return true;
  }
}
