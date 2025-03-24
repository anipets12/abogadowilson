const prisma = require('../utils/prisma');
const { verifyToken } = require('../utils/auth');
const { corsHeaders } = require('../middleware/auth');

// Número máximo de tokens por usuario
const MAX_TOKENS = 3;

// Inicializar tokens de usuario
async function initializeTokens(request) {
  try {
    const data = await request.json();
    const { userId } = data;

    // Validar input
    if (!userId) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Se requiere el ID de usuario'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Usuario no encontrado'
      }), {
        status: 404,
        headers: corsHeaders
      });
    }

    // Verificar si ya tiene tokens
    let userTokens = await prisma.userToken.findUnique({
      where: { userId }
    });

    // Si no tiene tokens, inicializarlos
    if (!userTokens) {
      userTokens = await prisma.userToken.create({
        data: {
          userId,
          tokensRemaining: MAX_TOKENS,
          lastRefill: new Date()
        }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        tokens: userTokens.tokensRemaining
      }
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error al inicializar tokens:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error al inicializar tokens',
      error: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// Obtener tokens de usuario
async function getTokens(request, userId) {
  try {
    if (!userId) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Se requiere el ID de usuario'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Usuario no encontrado'
      }), {
        status: 404,
        headers: corsHeaders
      });
    }

    // Obtener tokens
    const userTokens = await prisma.userToken.findUnique({
      where: { userId }
    });

    if (!userTokens) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Tokens no encontrados para el usuario'
      }), {
        status: 404,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({
      success: true,
      data: {
        tokens: userTokens.tokensRemaining
      }
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error al obtener tokens:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error al obtener tokens',
      error: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// Usar un token
async function useToken(request) {
  try {
    const data = await request.json();
    const { userId } = data;

    if (!userId) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Se requiere el ID de usuario'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Verificar tokens del usuario
    const userTokens = await prisma.userToken.findUnique({
      where: { userId }
    });

    if (!userTokens) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Tokens no encontrados para el usuario'
      }), {
        status: 404,
        headers: corsHeaders
      });
    }

    // Verificar si tiene tokens disponibles
    if (userTokens.tokensRemaining <= 0) {
      return new Response(JSON.stringify({
        success: false,
        message: 'No hay tokens disponibles'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Actualizar tokens
    const updatedTokens = await prisma.userToken.update({
      where: { userId },
      data: {
        tokensRemaining: userTokens.tokensRemaining - 1
      }
    });

    return new Response(JSON.stringify({
      success: true,
      data: {
        tokens: updatedTokens.tokensRemaining
      }
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error al usar token:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error al usar token',
      error: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// Recargar tokens (una vez al día)
async function refillTokens(request) {
  try {
    const data = await request.json();
    const { userId } = data;

    if (!userId) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Se requiere el ID de usuario'
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Verificar tokens del usuario
    const userTokens = await prisma.userToken.findUnique({
      where: { userId }
    });

    if (!userTokens) {
      // Si no tiene tokens, inicializarlos
      const newTokens = await prisma.userToken.create({
        data: {
          userId,
          tokensRemaining: MAX_TOKENS,
          lastRefill: new Date()
        }
      });

      return new Response(JSON.stringify({
        success: true,
        data: {
          tokens: newTokens.tokensRemaining
        }
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    // Verificar si ya se recargaron hoy
    const lastRefill = new Date(userTokens.lastRefill);
    const today = new Date();
    
    if (
      lastRefill.getDate() === today.getDate() &&
      lastRefill.getMonth() === today.getMonth() &&
      lastRefill.getFullYear() === today.getFullYear()
    ) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Ya recargaste tus tokens hoy',
        data: {
          tokens: userTokens.tokensRemaining
        }
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Recargar tokens
    const updatedTokens = await prisma.userToken.update({
      where: { userId },
      data: {
        tokensRemaining: MAX_TOKENS,
        lastRefill: today
      }
    });

    return new Response(JSON.stringify({
      success: true,
      data: {
        tokens: updatedTokens.tokensRemaining
      }
    }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    console.error('Error al recargar tokens:', error);
    return new Response(JSON.stringify({
      success: false,
      message: 'Error al recargar tokens',
      error: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

module.exports = {
  initializeTokens,
  getTokens,
  useToken,
  refillTokens
};
