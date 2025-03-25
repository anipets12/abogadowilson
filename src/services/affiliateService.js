import { supabase } from '../config/supabaseClient';

export const affiliateService = {
  async generateReferralCode(userId) {
    const { data, error } = await supabase
      .rpc('generate_referral_code', { user_id: userId });
    if (error) throw error;
    return data;
  },

  async trackReferral(code, referredUserId) {
    const { data, error } = await supabase
      .from('referrals')
      .insert({
        referral_code: code,
        referred_user_id: referredUserId,
        status: 'pending'
      });
    if (error) throw error;
    return data;
  },

  async getReferralStats(userId) {
    const { data, error } = await supabase
      .rpc('get_referral_stats', { user_id: userId });
    if (error) throw error;
    return data;
  }
};
