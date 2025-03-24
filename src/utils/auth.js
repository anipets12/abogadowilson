import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = '24h';

export const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};

export const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  } catch (error) {
    throw new Error('Token inválido');
  }
};

export const updateLoginTimestamp = async (userId) => {
  await prisma.user.update({
    where: { id: userId },
    data: { lastLogin: new Date() }
  });
};
