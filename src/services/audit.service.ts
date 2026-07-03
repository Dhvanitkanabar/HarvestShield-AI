import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AuditService {
  async logAction(data: { userId?: string, module: string, action: string, before?: any, after?: any, ipAddress?: string }) {
    return prisma.auditLog.create({
      data: {
        userId: data.userId,
        module: data.module,
        action: data.action,
        before: data.before,
        after: data.after,
        ipAddress: data.ipAddress
      }
    });
  }

  async getLogs(filters?: { userId?: string, module?: string }) {
    return prisma.auditLog.findMany({
      where: filters,
      orderBy: { timestamp: 'desc' }
    });
  }
}
