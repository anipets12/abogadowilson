import { supabase } from '../config/supabaseClient';
import api from './apiService';

export const ebookService = {
  async getDownloadUrl(ebookId) {
    const { data, error } = await supabase
      .storage
      .from('ebooks')
      .createSignedUrl(`ebooks/${ebookId}.pdf`, 60); // URL valid for 60 seconds

    if (error) throw error;
    return data.signedUrl;
  },

  async trackDownload(ebookId) {
    const { error } = await supabase
      .from('ebook_downloads')
      .insert({
        ebook_id: ebookId,
        user_id: supabase.auth.user()?.id,
        downloaded_at: new Date()
      });

    if (error) throw error;
  },

  async getPurchaseStatus(ebookId, userId) {
    const { data, error } = await supabase
      .from('ebook_purchases')
      .select('*')
      .eq('ebook_id', ebookId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;
    return !!data;
  },

  async trackEbookAnalytics(ebookId, userId, action) {
    const { error } = await supabase
      .from('ebook_analytics')
      .insert({
        ebook_id: ebookId,
        user_id: userId,
        action: action,
        metadata: { userAgent: navigator.userAgent }
      });
    if (error) throw error;
  },

  async getPopularEbooks() {
    const { data, error } = await supabase
      .rpc('get_popular_ebooks');
    if (error) throw error;
    return data;
  },

  async purchaseEbook(ebookId, userId) {
    try {
      // First check if user has enough tokens
      const { success, tokens } = await api.post('/tokens/use', { userId });
      if (!success) {
        throw new Error('Insufficient tokens');
      }

      // Record purchase in Supabase
      const { error: purchaseError } = await supabase
        .from('ebook_purchases')
        .insert({
          ebook_id: ebookId,
          user_id: userId,
          purchased_at: new Date(),
          payment_status: 'completed'
        });

      if (purchaseError) throw purchaseError;

      // Track analytics
      await this.trackEbookAnalytics(ebookId, userId, 'purchase');

      return { success: true };
    } catch (error) {
      console.error('Purchase error:', error);
      throw error;
    }
  },

  async validatePurchase(ebookId, userId) {
    try {
      const [purchaseStatus, tokenStatus] = await Promise.all([
        this.getPurchaseStatus(ebookId, userId),
        api.get(`/tokens/${userId}`)
      ]);

      return {
        canDownload: purchaseStatus,
        hasTokens: tokenStatus.tokens > 0
      };
    } catch (error) {
      console.error('Validation error:', error);
      throw error;
    }
  },

  async getEbookMetadata(ebookId) {
    try {
      const { data, error } = await supabase
        .from('ebooks')
        .select('title, description, price, metadata')
        .eq('id', ebookId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Metadata fetch error:', error);
      throw error;
    }
  }
};
