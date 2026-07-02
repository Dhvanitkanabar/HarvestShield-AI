// ==================================================
// Express Application
// ==================================================
// Assembles all middleware, routes, and error handlers
// into the Express app instance. Does NOT start the
// server — that's handled by server.ts.
// ==================================================

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { requestLogger, globalErrorHandler } from './middleware/index.js';
import routes from './routes/index.js';
import { sendError } from './utils/apiResponse.js';
import { HTTP_STATUS, MESSAGES } from './constants/index.js';

const app = express();

// ==================================================
// Security Middleware
// ==================================================
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// ==================================================
// Body Parsing & Cookies
// ==================================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(env.COOKIE_SECRET));

// ==================================================
// Request Logging
// ==================================================
app.use(requestLogger);

// ==================================================
// API Routes
// ==================================================
app.use('/api/v1', routes);

// ==================================================
// 404 Handler
// ==================================================
app.use((_req, res) => {
  sendError(res, HTTP_STATUS.NOT_FOUND, MESSAGES.SERVER.NOT_FOUND);
});

// ==================================================
// Global Error Handler (must be last)
// ==================================================
app.use(globalErrorHandler);

export default app;
