import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { OpenAIService } from '../services/aiService';
import { DocumentService } from '../services/documentService';
import { DbService } from '../services/dbService';
import { verifyConnections } from '../utils/connections';

describe('Integration Tests', () => {
  beforeAll(async () => {
    await verifyConnections();
  });

  describe('AI Services', () => {
    it('should generate legal responses', async () => {
      const aiService = new OpenAIService();
      const response = await aiService.generateLegalResponse('consulta legal test');
      expect(response).toBeDefined();
      expect(response.content).toBeTruthy();
      expect(response.success).toBe(true);
    });

    it('should handle document generation with AI', async () => {
      const aiService = new OpenAIService();
      const result = await aiService.generateDocument({
        type: 'demanda',
        data: { /* test data */ }
      });
      expect(result.document).toBeDefined();
      expect(result.success).toBe(true);
    });
  });

  describe('Document Generation', () => {
    it('should generate legal documents', async () => {
      const docService = new DocumentService();
      const doc = await docService.generateCertificate({
        type: 'demanda',
        clientData: { name: 'Test Client' }
      });
      expect(doc.id).toBeDefined();
      expect(doc.url).toBeTruthy();
    });
  });

  describe('Database Services', () => {
    it('should handle all database operations', async () => {
      // Test Prisma
      const prismaResult = await DbService.prismaTest();
      expect(prismaResult.success).toBe(true);

      // Test Turso
      const tursoResult = await DbService.tursoTest();
      expect(tursoResult.success).toBe(true);

      // Test Supabase
      const supabaseResult = await DbService.supabaseTest();
      expect(supabaseResult.success).toBe(true);
    });
  });

  describe('API Integration', () => {
    it('should handle complete workflow', async () => {
      const workflow = await DbService.testWorkflow({
        auth: true,
        documents: true,
        ai: true
      });
      expect(workflow.success).toBe(true);
    });
  });
});
