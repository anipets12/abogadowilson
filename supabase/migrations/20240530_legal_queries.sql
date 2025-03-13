-- Create table for storing legal queries made through the AI consultation
CREATE TABLE IF NOT EXISTS public.legal_queries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  area VARCHAR(50) NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.legal_queries ENABLE ROW LEVEL SECURITY;

-- Policy for users to read only their own legal queries
CREATE POLICY "Users can view their own legal queries"
  ON public.legal_queries
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to insert their own legal queries
CREATE POLICY "Users can insert their own legal queries"
  ON public.legal_queries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS legal_queries_user_id_idx ON public.legal_queries (user_id);
CREATE INDEX IF NOT EXISTS legal_queries_created_at_idx ON public.legal_queries (created_at DESC);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_legal_queries_updated_at
BEFORE UPDATE ON public.legal_queries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create table for document generation history
CREATE TABLE IF NOT EXISTS public.generated_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  document_data JSONB NOT NULL,
  document_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for document generation
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;

-- Policy for users to read only their own generated documents
CREATE POLICY "Users can view their own generated documents"
  ON public.generated_documents
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for users to insert their own generated documents
CREATE POLICY "Users can insert their own generated documents"
  ON public.generated_documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS generated_documents_user_id_idx ON public.generated_documents (user_id);
CREATE INDEX IF NOT EXISTS generated_documents_created_at_idx ON public.generated_documents (created_at DESC);

-- Create table for user queries
CREATE TABLE IF NOT EXISTS user_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  query_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user queries
CREATE INDEX idx_user_queries_user_id ON user_queries(user_id);

-- Create function to check query limit
CREATE OR REPLACE FUNCTION check_query_limit(user_id UUID) 
RETURNS BOOLEAN AS $$
DECLARE
  query_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO query_count 
  FROM user_queries 
  WHERE user_queries.user_id = check_query_limit.user_id
    AND created_at > NOW() - INTERVAL '1 month';

  RETURN query_count < 5;
END;
$$ LANGUAGE plpgsql;
