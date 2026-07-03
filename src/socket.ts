import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { logger } from './config/logger.js';
import { env } from './config/env.js';

let io: Server;

export const initWebSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGIN || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`Client connected: ${socket.id}`);

    // Join rooms based on entity IDs (e.g. warehouse_123, vehicle_456)
    socket.on('join', (room: string) => {
      socket.join(room);
      logger.info(`Socket ${socket.id} joined room: ${room}`);
    });

    socket.on('leave', (room: string) => {
      socket.leave(room);
      logger.info(`Socket ${socket.id} left room: ${room}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};
