import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://shafransa.com';
const LANGUAGES = ['az', 'en', 'ru', 'tr'];

// Helper to escape special XML characters
function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Mock items definitions for sitemap generation
const STATIC_ROUTES = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/marketplace', priority: '0.9', changefreq: 'daily' },
  { url: '/herbs', priority: '0.9', changefreq: 'daily' },
  { url: '/therapists', priority: '0.8', changefreq: 'weekly' },
  { url: '/blogs', priority: '0.8', changefreq: 'weekly' },
  { url: '/about', priority: '0.6', changefreq: 'monthly' },
  { url: '/contact', priority: '0.6', changefreq: 'monthly' },
  { url: '/how-it-works', priority: '0.6', changefreq: 'monthly' },
  { url: '/ai-consultant', priority: '0.7', changefreq: 'weekly' },
];

const PRODUCTS = [
  'seed-product-saffron-tea',
  'seed-product-lavender-oil',
  'seed-product-turmeric-capsules',
  'seed-product-ginger-extract',
];

const HERBS = [
  'seed-herb-saffron',
  'seed-herb-lavender',
  'seed-herb-turmeric',
  'seed-herb-ginger',
];

const THERAPISTS = [
  'therapist-1',
  'therapist-2',
  'therapist-3',
];

const BLOGS = [
  'mock-blog-1',
  'mock-blog-2',
  'mock-blog-3',
  'mock-blog-4',
  'mock-blog-5',
];

const SELLERS = [
  'seed-seller-shafransa',
];

function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];

  const routes = [];

  // 1. Add static routes
  STATIC_ROUTES.forEach(route => {
    routes.push({
      loc: `${BASE_URL}${route.url}`,
      lastmod: currentDate,
      changefreq: route.changefreq,
      priority: route.priority,
    });
  });

  // 2. Add products
  PRODUCTS.forEach(id => {
    routes.push({
      loc: `${BASE_URL}/product/${id}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8',
    });
  });

  // 3. Add herbs
  HERBS.forEach(id => {
    routes.push({
      loc: `${BASE_URL}/herb/${id}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8',
    });
  });

  // 4. Add therapists
  THERAPISTS.forEach(id => {
    routes.push({
      loc: `${BASE_URL}/therapist/${id}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7',
    });
  });

  // 5. Add blogs
  BLOGS.forEach(id => {
    routes.push({
      loc: `${BASE_URL}/blog/${id}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7',
    });
  });

  // 6. Add sellers
  SELLERS.forEach(id => {
    routes.push({
      loc: `${BASE_URL}/seller/${id}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7',
    });
  });

  // Build XML content with XSL stylesheet header for browser rendering
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  routes.forEach(item => {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(item.loc)}</loc>\n`;
    xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(`✅ Sitemap successfully generated at: ${outputPath} (${routes.length} canonical routes indexed)`);
}

generateSitemap();

