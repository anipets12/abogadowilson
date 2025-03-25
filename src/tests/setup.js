import { beforeAll, afterAll, vi } from 'vitest';
import { supabase } from '../config/supabaseClient';

beforeAll(() => {
  // Mock Supabase client
  vi.mock('../config/supabaseClient', () => ({
    supabase: {
      auth: {
        user: () => ({ id: 'test-user-id' }),
        signIn: vi.fn(),
        signOut: vi.fn()
      },
      storage: {
        from: () => ({
          createSignedUrl: vi.fn()
        })
      },
      from: () => ({
        select: vi.fn(),
        insert: vi.fn(),
        update: vi.fn()
      }),
      rpc: vi.fn()
    }
  }));

  // Mock window.navigator
  Object.defineProperty(window, 'navigator', {
    value: {
      userAgent: 'test-agent'
    }
  });
});

afterAll(() => {
  vi.clearAllMocks();
});
