-- Create affiliate profiles table
CREATE TABLE IF NOT EXISTS public.affiliate_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  referral_code TEXT UNIQUE NOT NULL,
  commission_rate DECIMAL(5,2) DEFAULT 20.00,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code TEXT REFERENCES affiliate_profiles(referral_code),
  referred_user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending',
  commission_earned DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS public.ebook_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ebook_id UUID REFERENCES public.ebooks(id),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  code TEXT;
BEGIN
  code := UPPER(SUBSTRING(MD5(user_id::TEXT) FOR 8));
  INSERT INTO affiliate_profiles (id, referral_code)
  VALUES (user_id, code);
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Create function to get referral stats
CREATE OR REPLACE FUNCTION get_referral_stats(user_id UUID)
RETURNS TABLE (
  total_referrals BIGINT,
  successful_referrals BIGINT,
  total_earnings DECIMAL(10,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'completed'),
    COALESCE(SUM(commission_earned), 0.00)
  FROM referrals r
  JOIN affiliate_profiles ap ON r.referral_code = ap.referral_code
  WHERE ap.id = user_id;
END;
$$ LANGUAGE plpgsql;

-- Add RLS policies
ALTER TABLE public.affiliate_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebook_analytics ENABLE ROW LEVEL SECURITY;

-- RLS policies for affiliate profiles
CREATE POLICY "Users can view own affiliate profile"
  ON public.affiliate_profiles FOR SELECT
  USING (auth.uid() = id);

-- RLS policies for referrals
CREATE POLICY "Users can view own referrals"
  ON public.referrals FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM affiliate_profiles WHERE referral_code = referrals.referral_code
    )
  );
