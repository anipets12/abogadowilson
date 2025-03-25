import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { authService } from '../services/apiService';
import { tokenService } from '../services/tokenService';
import { clearTestData } from '../utils/testHelpers';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      insert: vi.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
      update: vi.fn().mockResolvedValue({ data: {}, error: null })
    }))
  }))
}));

// Mock Cloudflare Worker environment
const mockEnv = {
  JWT_SECRET: 'test-secret',
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_KEY: 'test-key'
};

describe('Authentication & Authorization Tests', () => {
  beforeEach(async () => {
    await clearTestData();
    // Mock Cloudflare Worker globals
    global.Request = class extends Request {
      cloudflare = { env: mockEnv }
    };
  });

  describe('Registration Flow', () => {
    it('should handle complete registration process', async () => {
      const testUser = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };
      
      const result = await authService.register(testUser);
      expect(result.success).toBe(true);
      expect(result.user.id).toBeDefined();
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });
  });

  describe('Token Management', () => {
    it('should handle token lifecycle', async () => {
      const tokens = await tokenService.createTokens('testUserId');
      expect(tokens.accessToken).toBeDefined();
      
      const validated = await tokenService.validateToken(tokens.accessToken);
      expect(validated.success).toBe(true);
      
      const refreshed = await tokenService.refreshToken(tokens.refreshToken);
      expect(refreshed.accessToken).toBeDefined();
      expect(refreshed.refreshToken).toBeDefined();

      // Verify token rotation
      const oldRefreshValid = await tokenService.validateRefreshToken(tokens.refreshToken);
      expect(oldRefreshValid.success).toBe(false);
    });
  });

  describe('Security Tests', () => {
    it('should reject invalid tokens', async () => {
      const invalidToken = 'invalid.token.here';
      const validated = await tokenService.validateToken(invalidToken);
      expect(validated.success).toBe(false);
    });

    it('should prevent brute force attempts', async () => {
      const attempts = [];
      for (let i = 0; i < 5; i++) {
        attempts.push(authService.login({ 
          email: 'test@example.com', 
          password: 'wrong' + i 
        }));
      }
      const results = await Promise.all(attempts);
      const lastAttempt = results[results.length - 1];
      expect(lastAttempt.success).toBe(false);
      expect(lastAttempt.message).toContain('rate limit');
    });

    it('should properly expire tokens', async () => {
      const tokens = await tokenService.createTokens('testUserId', { expiresIn: '1ms' });
      await new Promise(resolve => setTimeout(resolve, 5));
      const validated = await tokenService.validateToken(tokens.accessToken);
      expect(validated.success).toBe(false);
    });
  });

  describe('Worker-Specific Tests', () => {
    it('should handle worker request/response cycle', async () => {
      const request = new Request('https://example.com/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });

      const response = await authService.handleRequest(request);
      expect(response instanceof Response).toBe(true);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.status).toBe(200);
    });

    it('should handle worker errors gracefully', async () => {
      const request = new Request('https://example.com/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: 'invalid json'
      });

      const response = await authService.handleRequest(request);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBeDefined();
    });

    it('should validate CORS headers', async () => {
      const request = new Request('https://example.com/api/auth', {
        method: 'OPTIONS'
      });

      const response = await authService.handleRequest(request);
      expect(response.headers.get('Access-Control-Allow-Methods'))
        .toContain('POST');
      expect(response.headers.get('Access-Control-Allow-Headers'))
        .toContain('Authorization');
    });
  });

  describe('Database Connection', () => {
    it('should connect to Supabase successfully', async () => {
      const supabase = createClient(mockEnv.SUPABASE_URL, mockEnv.SUPABASE_KEY);
      expect(supabase).toBeDefined();
      expect(supabase.auth).toBeDefined();
    });

    it('should handle database errors gracefully', async () => {
      const supabase = createClient(mockEnv.SUPABASE_URL, mockEnv.SUPABASE_KEY);
      vi.spyOn(supabase.from('users'), 'select').mockRejectedValueOnce(new Error('DB Error'));
      
      const result = await authService.getUserProfile('test-id');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Rate Limiting', () => {
    it('should implement rate limiting for login attempts', async () => {
      const attempts = Array(10).fill().map(() => 
        authService.login({ email: 'test@example.com', password: 'wrong' })
      );
      
      const results = await Promise.all(attempts);
      const blockedAttempts = results.filter(r => r.message?.includes('rate limit'));
      expect(blockedAttempts.length).toBeGreaterThan(0);
    });
  });

  describe('Security Headers', () => {
    it('should set correct security headers', async () => {
      const request = new Request('https://example.com/api/auth');
      const response = await authService.handleRequest(request);
      
      expect(response.headers.get('Strict-Transport-Security')).toBeDefined();
      expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
      expect(response.headers.get('X-Frame-Options')).toBe('DENY');
      expect(response.headers.get('Content-Security-Policy')).toBeDefined();
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
