import { describe, it, expect } from 'vitest';
import { apiHandler } from '../workers/api';

describe('API Endpoint Tests', () => {
  const endpoints = [
    '/api/auth',
    '/api/documents',
    '/api/ai/consult',
    '/api/profile'
  ];

  it('should verify all API endpoints', async () => {
    for (const endpoint of endpoints) {
      const request = new Request(`https://example.com${endpoint}`);
      const response = await apiHandler.handle(request);
      expect(response.status).not.toBe(404);
    }
  });

  it('should handle CORS properly', async () => {
    const request = new Request('https://example.com/api/auth', {
      method: 'OPTIONS'
    });
    const response = await apiHandler.handle(request);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
  });

  it('should validate content types', async () => {
    const request = new Request('https://example.com/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const response = await apiHandler.handle(request);
    expect(response.status).not.toBe(415);
  });
});
