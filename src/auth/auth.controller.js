const prisma = require('../utils/prisma');
const { hashPassword, comparePassword, generateToken, verifyToken } = require('../utils/auth');

// Cabeceras CORS comunes
const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true',
};

// Genera un código de referido único
function generateReferralCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Register a new user
async function register(request) {
  try {
    const data = await request.json();
    const { email, password, name, referralCode } = data;

    // Validate input
    if (!email || !password) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Email and password are required'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return new Response(JSON.stringify({
        success: false,
        message: 'User already exists'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Process referral code if provided
    let referredBy = null;
    if (referralCode) {
      const referralLink = await prisma.referralLink.findUnique({
        where: { code: referralCode },
        include: { user: true }
      });

      if (referralLink) {
        referredBy = referralLink.userId;
        // Increment the used count for the referral link
        await prisma.referralLink.update({
          where: { id: referralLink.id },
          data: { usedCount: { increment: 1 } }
        });
      }
    }

    // Create user
    const hashedPassword = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        referredBy
      }
    });

    // Create a referral link for the new user
    const referralLink = await prisma.referralLink.create({
      data: {
        code: generateReferralCode(),
        userId: user.id
      }
    });

    // Generate token
    const token = generateToken(user);

    // Store token in database
    await prisma.token.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token,
        referralCode: referralLink.code
      }
    }), {
      status: 201,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to register user',
      error: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// Login user
async function login(request) {
  try {
    const { email, password } = await request.json();
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Usuario no encontrado'
      }), { status: 404, headers: corsHeaders });
    }

    const validPassword = comparePassword(password, user.password);
    if (!validPassword) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Contraseña incorrecta'
      }), { status: 401, headers: corsHeaders });
    }

    const token = generateToken(user);
    await prisma.token.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return new Response(JSON.stringify({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        token
      }
    }), { status: 200, headers: corsHeaders });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Error en el inicio de sesión',
      error: error.message
    }), { status: 500, headers: corsHeaders });
  }
}

// Logout user
async function logout(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        success: false,
        message: 'No token provided'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const token = authHeader.split(' ')[1];

    // Delete token from database
    await prisma.token.deleteMany({
      where: { token }
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Logout successful'
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Logout error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to logout',
      error: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// Get authenticated user
async function getUser(request) {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Authentication required'
      }), {
        status: 401,
        headers: corsHeaders
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid or expired token'
      }), {
        status: 401,
        headers: corsHeaders
      });
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
      return new Response(JSON.stringify({
        success: false,
        message: 'Invalid or expired token'
      }), {
        status: 401,
        headers: corsHeaders
      });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        message: 'User not found'
      }), {
        status: 404,
        headers: corsHeaders
      });
    }

    // Get user's referral link
    const referralLink = await prisma.referralLink.findFirst({
      where: { userId: user.id }
    });

    return new Response(JSON.stringify({
      success: true,
      data: {
        user,
        referralCode: referralLink ? referralLink.code : null
      }
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Get user error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to get user',
      error: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// Create a new referral link
async function createReferralLink(request) {
  try {
    // User is already authenticated by middleware
    const { userId } = request.user;

    // Check if user already has a referral link
    const existingLink = await prisma.referralLink.findFirst({
      where: { userId }
    });

    if (existingLink) {
      return new Response(JSON.stringify({
        success: true,
        message: 'Referral link already exists',
        data: {
          referralCode: existingLink.code
        }
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    // Create a new referral link
    const referralLink = await prisma.referralLink.create({
      data: {
        code: generateReferralCode(),
        userId
      }
    });

    return new Response(JSON.stringify({
      success: true,
      message: 'Referral link created successfully',
      data: {
        referralCode: referralLink.code
      }
    }), {
      status: 201,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Create referral link error:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Failed to create referral link',
      error: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

module.exports = {
  register,
  login,
  logout,
  getUser,
  createReferralLink
};
