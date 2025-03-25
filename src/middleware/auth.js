const { verifyToken } = require('../utils/auth');
const prisma = require('../utils/prisma');

// Use memory-safe rate limiting for Workers
const rateLimiter = new (class {
  constructor() {
    this.requests = new Map();
    // Clean up every minute
    setInterval(() => this.cleanup(), 60000);
  }

  cleanup() {
    const now = Date.now();
    for (const [key, data] of this.requests.entries()) {
      if (now - data.timestamp > 60000) {
        this.requests.delete(key);
      }
    }
  }

  async checkLimit(ip) {
    // ...existing rate limiting code...
  }
})();

const authMiddleware = async (request) => {
  try {
    // Validate request
    if (!request || !request.headers) {
      throw new Error('Invalid request object');
    }

    // Check rate limit
    const clientIp = request.headers.get('cf-connecting-ip') || 
                    request.headers.get('x-forwarded-for') || 
                    'unknown';
    
    const rateLimitResult = await rateLimiter.checkLimit(clientIp);
    if (!rateLimitResult.allowed) {
      return {
        success: false,
        status: 429,
        message: 'Too many requests'
      };
    }

    // Validate auth header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return {
        success: false,
        status: 401,
        message: 'Invalid authorization header'
      };
    }

    // Token validation
    const token = authHeader.split(' ')[1];
    const decoded = await verifyToken(token);
    
    // User validation with proper error handling
    const user = await prisma.user.findUnique({
      where: { 
        id: decoded.userId,
        active: true
      },
      select: {
        id: true,
        email: true,
        role: true,
        active: true
      }
    });

    if (!user) {
      return {
        success: false,
        status: 401,
        message: 'User not found or inactive'
      };
    }

    return {
      success: true,
      user,
      status: 200
    };

  } catch (error) {
    console.error('Auth middleware error:', error);
    return {
      success: false,
      status: error.status || 500,
      message: error.message || 'Internal server error'
    };
  }
};

module.exports = { 
  authMiddleware,
  rateLimiter // Export for testing
};
