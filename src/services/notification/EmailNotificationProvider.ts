import { INotificationProvider, NotificationData } from './NotificationProvider.interface';

export class EmailNotificationProvider implements INotificationProvider {
  async send(notification: NotificationData): Promise<boolean> {
    console.log(`[EmailNotificationProvider] Sending email to User ${notification.userId}: ${notification.message}`);
    // Mock implementation for future SendGrid integration
    return true;
  }
}
