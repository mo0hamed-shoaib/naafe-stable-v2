// Request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request details
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - User: ${req.user?._id || 'anonymous'}`);
  
  // Log request body for POST/PUT/PATCH requests (excluding sensitive data)
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body) {
    const sanitizedBody = { ...req.body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '[REDACTED]';
    }
    console.log(`[Request Body] ${JSON.stringify(sanitizedBody, null, 2)}`);
  }
  
  // Log query parameters
  if (Object.keys(req.query).length > 0) {
    console.log(`[Query Params] ${JSON.stringify(req.query, null, 2)}`);
  }
  
  // Override res.json to log response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    
    // Log response data (truncated for large responses)
    if (data && typeof data === 'object') {
      const responseStr = JSON.stringify(data);
      if (responseStr.length > 500) {
        console.log(`[Response] ${responseStr.substring(0, 500)}... (truncated)`);
      } else {
        console.log(`[Response] ${responseStr}`);
      }
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

// Error logging middleware
export const errorLogger = (error, req, res, next) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.error(`[ERROR] Message: ${error.message}`);
  console.error(`[ERROR] Stack: ${error.stack}`);
  console.error(`[ERROR] User: ${req.user?._id || 'anonymous'}`);
  
  next(error);
};

// Database operation logging
export const dbLogger = {
  logQuery: (operation, model, query = {}) => {
    console.log(`[DB] ${operation} on ${model} - ${JSON.stringify(query)}`);
  },
  
  logError: (operation, model, error) => {
    console.error(`[DB ERROR] ${operation} on ${model} - ${error.message}`);
  },
  
  logSuccess: (operation, model, result) => {
    if (Array.isArray(result)) {
      console.log(`[DB] ${operation} on ${model} - ${result.length} records`);
    } else {
      console.log(`[DB] ${operation} on ${model} - Success`);
    }
  }
};

// Performance monitoring middleware
export const performanceLogger = (req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000;
    
    if (duration > 1000) {
      console.warn(`[PERFORMANCE] Slow request: ${req.method} ${req.path} took ${duration.toFixed(2)}ms`);
    }
  });
  
  next();
};

// Security logging middleware
export const securityLogger = (req, res, next) => {
  // Log potential security issues
  const userAgent = req.get('User-Agent');
  const ip = req.ip || req.connection.remoteAddress;
  
  // Log suspicious requests
  if (req.path.includes('admin') && !req.user?.roles?.includes('admin')) {
    console.warn(`[SECURITY] Unauthorized admin access attempt from ${ip} - ${req.path}`);
  }
  
  // Log requests with missing authentication
  if (req.path.startsWith('/api/') && !req.user && req.method !== 'GET') {
    console.warn(`[SECURITY] Unauthenticated request from ${ip} - ${req.method} ${req.path}`);
  }
  
  next();
};

// Logger utility with proper methods
export const logger = {
  info: (message) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  },
  
  error: (message) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
  },
  
  warn: (message) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
  },
  
  debug: (message) => {
    console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`);
  }
};

export default {
  requestLogger,
  errorLogger,
  dbLogger,
  performanceLogger,
  securityLogger,
  logger
}; 