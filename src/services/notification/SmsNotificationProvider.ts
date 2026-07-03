import { INotificationProvider, NotificationData } from './NotificationProvider.interface';

export class SmsNotificationProvider implements INotificationProvider {
  async send(notification: NotificationData): Promise<boolean> {
    console.log(`[SmsNotificationProvider] Sending SMS to User ${notification.userId}: ${notification.message}`);
    // Mock implementation for future Twilio integration
    return true;
  }
}
