import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { auth } from '../utils/auth';
import { corsHeaders } from '../middleware/auth';

const prisma = new PrismaClient();

export async function register(request) {
  try {
    const { email, password, name, referralCode } = await request.json();

    // Validar datos
    if (!email || !password || !name) {
      return new Response(
        JSON.stringify({ error: 'Todos los campos son requeridos' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'El email ya está registrado' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        referredBy: referralCode || null,
        userTokens: {
          create: {
            tokensRemaining: 3
          }
        }
      }
    });

    // Generar token JWT
    const token = await auth.generateToken(user);

    return new Response(
      JSON.stringify({ 
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error en registro:', error);
    return new Response(
      JSON.stringify({ error: 'Error al registrar usuario' }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function login(request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { userTokens: true }
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Credenciales inválidas' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return new Response(
        JSON.stringify({ error: 'Credenciales inválidas' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const token = await auth.generateToken(user);

    return new Response(
      JSON.stringify({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          tokensRemaining: user.userTokens?.tokensRemaining || 0
        }
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error en login:', error);
    return new Response(
      JSON.stringify({ error: 'Error al iniciar sesión' }),
      { status: 500, headers: corsHeaders }
    );
  }
}
