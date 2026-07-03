import { PrismaClient, AlertType, AlertPriority, AlertStatus, NotificationType } from '@prisma/client';
import { EmailNotificationProvider } from './notification/EmailNotificationProvider';
import { PushNotificationProvider } from './notification/PushNotificationProvider';

const prisma = new PrismaClient();
const emailProvider = new EmailNotificationProvider();
const pushProvider = new PushNotificationProvider();

export class AlertService {
  
  async createAlert(data: { title: string, description: string, type: AlertType, priority: AlertPriority, batchId?: string, warehouseId?: string, notifyUserId?: string }) {
    const alert = await prisma.alert.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        priority: data.priority,
        batchId: data.batchId,
        warehouseId: data.warehouseId
      }
    });

    if (data.notifyUserId) {
      await this.notifyUser(data.notifyUserId, alert, data.priority);
    }

    return alert;
  }

  private async notifyUser(userId: string, alert: any, priority: AlertPriority) {
    // Notify via push for HIGH/CRITICAL, otherwise email
    const type = (priority === AlertPriority.CRITICAL || priority === AlertPriority.HIGH) ? NotificationType.PUSH : NotificationType.EMAIL;
    
    const notification = await prisma.notification.create({
      data: {
        alertId: alert.id,
        userId,
        type,
        message: `[${priority}] ${alert.title}: ${alert.description}`,
      }
    });

    try {
      if (type === NotificationType.PUSH) {
        await pushProvider.send({ userId, message: notification.message, type, alertId: alert.id });
      } else {
        await emailProvider.send({ userId, message: notification.message, type, alertId: alert.id });
      }
      await prisma.notification.update({ where: { id: notification.id }, data: { status: 'SENT', sentAt: new Date() } });
    } catch (e) {
      await prisma.notification.update({ where: { id: notification.id }, data: { status: 'FAILED' } });
    }
  }

  async getAlerts(filters?: { status?: AlertStatus, priority?: AlertPriority, type?: AlertType }) {
    return prisma.alert.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' }
    });
  }

  async acknowledgeAlert(alertId: string) {
    return prisma.alert.update({
      where: { id: alertId },
      data: { status: AlertStatus.ACKNOWLEDGED }
    });
  }

  async resolveAlert(alertId: string) {
    return prisma.alert.update({
      where: { id: alertId },
      data: { status: AlertStatus.RESOLVED, resolvedAt: new Date() }
    });
  }
}
