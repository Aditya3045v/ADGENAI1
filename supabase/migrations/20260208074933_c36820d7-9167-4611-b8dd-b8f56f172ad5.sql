
-- Create storage bucket for ad assets (logos, product images)
INSERT INTO storage.buckets (id, name, public) VALUES ('ad-assets', 'ad-assets', true);

-- Allow anyone to upload to ad-assets bucket
CREATE POLICY "Anyone can upload ad assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'ad-assets');

-- Allow anyone to read ad assets
CREATE POLICY "Anyone can read ad assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'ad-assets');

-- Allow anyone to update their uploads
CREATE POLICY "Anyone can update ad assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'ad-assets');

-- Allow anyone to delete ad assets
CREATE POLICY "Anyone can delete ad assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'ad-assets');
