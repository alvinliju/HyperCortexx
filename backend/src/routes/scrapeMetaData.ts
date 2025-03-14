
import express, { Request, Response } from 'express';
import { isValidUrl, getBasicFallback } from '../utils/validUrl';
import {verifyToken} from '../middleware/authMiddleware'
const router = express.Router();

interface OGSResult {
  ogTitle?: string;
  twitterTitle?: string;
  dcTitle?: string;
  ogDescription?: string;
  twitterDescription?: string;
  ogImage?: Array<{ url: string }>;
  ogSiteName?: string;
  ogUrl?: string;
}

router.get('/metadata', verifyToken,  async (req: Request, res: Response) => {
  const urlParam = req.query.url;
  const url = typeof urlParam === 'string' ? urlParam : '';
  
  // Validate URL format
  if (!url || !isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  try {
    const { default: ogs } = await import('open-graph-scraper');
    const response = await ogs({
      url,
      fetchOptions: {
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'accept-language': 'en-US,en;q=0.9'
        }
      },
      timeout: 5000,
      onlyGetOpenGraphInfo: true
    });
    
    const result = response.result as OGSResult;

    const cleanData = {
      title: result.ogTitle || result.twitterTitle || result.dcTitle,
      description: result.ogDescription || result.twitterDescription,
      image: result.ogImage?.[0]?.url,
      siteName: result.ogSiteName || new URL(url).hostname,
      url: result.ogUrl || url
    };

    res.set('Cache-Control', 'public, max-age=3600');
    res.json(cleanData);
    
  } catch (error) {
    console.error('Scraping failed:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve metadata',
      fallback: getBasicFallback(url)
    });
  }
});

export default router;
