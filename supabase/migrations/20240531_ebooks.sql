-- Create ebooks table
CREATE TABLE IF NOT EXISTS public.ebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  cover_image TEXT NOT NULL,
  pages INTEGER NOT NULL,
  category TEXT NOT NULL,
  is_free BOOLEAN DEFAULT false,
  pdf_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ebook purchases table
CREATE TABLE IF NOT EXISTS public.ebook_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ebook_id UUID REFERENCES public.ebooks(id) ON DELETE CASCADE,
  purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, ebook_id)
);

-- Create ebook downloads tracking table
CREATE TABLE IF NOT EXISTS public.ebook_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ebook_id UUID REFERENCES public.ebooks(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.ebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebook_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ebook_downloads ENABLE ROW LEVEL SECURITY;

-- Policies for ebooks
CREATE POLICY "Allow public read access to ebooks" 
  ON public.ebooks FOR SELECT TO public;

-- Policies for purchases
CREATE POLICY "Users can view their own purchases" 
  ON public.ebook_purchases FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own purchases" 
  ON public.ebook_purchases FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policies for downloads
CREATE POLICY "Users can track their own downloads" 
  ON public.ebook_downloads FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own downloads" 
  ON public.ebook_downloads FOR SELECT 
  USING (auth.uid() = user_id);
