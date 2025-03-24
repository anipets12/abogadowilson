const { verifyToken } = require('../utils/auth');
const prisma = require('../utils/prisma');

// Cabeceras CORS comunes
const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true',
};

// Middleware to validate token and protect routes
async function authMiddleware(request) {
  // Get token from headers
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      success: false,
      message: 'Access denied. No token provided'
    };
  }

  try {
    // Verify token
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return {
        success: false,
        message: 'Invalid token'
      };
    }

    // Check if token exists in database and is not expired
    const tokenRecord = await prisma.token.findFirst({
      where: {
        token,
        expiresAt: {
          gt: new Date()
        }
      }
    });

    if (!tokenRecord) {
      return {
        success: false,
        message: 'Invalid or expired token'
      };
    }

    // Check if user exists in database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    // Add user to request for controllers to use
    // Clone the request to avoid modifying the original
    const newRequest = new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: request.body
    });
    
    // Añadir el objeto user a la solicitud
    Object.defineProperty(newRequest, 'user', {
      value: {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      writable: true,
      enumerable: true
    });

    return {
      success: true,
      request: newRequest
    };
  } catch (error) {
    console.error('Auth middleware error:', error);
    return {
      success: false,
      message: 'Authentication failed: ' + error.message
    };
  }
}

module.exports = {
  authMiddleware,
  corsHeaders
};
