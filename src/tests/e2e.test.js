import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { authService, documentService, aiService } from '../services/index';

const prisma = new PrismaClient();
let supabase;

describe('End-to-End Tests', () => {
  beforeAll(async () => {
    supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
    await prisma.$connect();
  });

  describe('Complete User Journey', () => {
    it('should handle full user workflow', async () => {
      // 1. User registration
      const user = await authService.register({
        email: 'test@example.com',
        password: 'test123',
        name: 'Test User'
      });
      expect(user.id).toBeDefined();

      // 2. Document creation
      const doc = await documentService.createDocument({
        userId: user.id,
        type: 'demanda',
        content: 'Test content'
      });
      expect(doc.id).toBeDefined();

      // 3. AI consultation
      const aiResponse = await aiService.generateLegalAdvice({
        documentId: doc.id,
        query: 'Test query'
      });
      expect(aiResponse.success).toBe(true);

      // 4. Verify data persistence
      const savedDoc = await prisma.document.findUnique({
        where: { id: doc.id }
      });
      expect(savedDoc).toBeDefined();
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
});
