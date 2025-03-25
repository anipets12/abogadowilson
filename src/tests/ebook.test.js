import { describe, it, expect, beforeEach } from 'vitest';
import { ebookService } from '../services/ebookService';
import { supabase } from '../config/supabaseClient';

describe('Ebook Service', () => {
  const mockEbookId = 'test-ebook-id';
  const mockUserId = 'test-user-id';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate purchase correctly', async () => {
    const result = await ebookService.validatePurchase(mockEbookId, mockUserId);
    expect(result).toHaveProperty('canDownload');
    expect(result).toHaveProperty('hasTokens');
  });

  it('should get ebook metadata', async () => {
    const metadata = await ebookService.getEbookMetadata(mockEbookId);
    expect(metadata).toHaveProperty('title');
    expect(metadata).toHaveProperty('description');
  });

  it('should handle download tracking', async () => {
    const result = await ebookService.trackDownload(mockEbookId);
    expect(result).not.toThrow();
  });
});
