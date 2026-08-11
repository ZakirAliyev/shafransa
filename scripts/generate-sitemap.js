import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://shafransa.az';
const LANGUAGES = ['az', 'en', 'ru', 'tr'];

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

  const urls = [];

  // 1. Add static routes
  STATIC_ROUTES.forEach(route => {
    urls.push({
      loc: `${BASE_URL}${route.url}`,
      lastmod: currentDate,
      changefreq: route.changefreq,
      priority: route.priority,
    });
  });

  // 2. Add products
  PRODUCTS.forEach(id => {
    urls.push({
      loc: `${BASE_URL}/product/${id}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8',
    });
  });

  // 3. Add herbs
  HERBS.forEach(id => {
    urls.push({
      loc: `${BASE_URL}/herb/${id}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8',
    });
  });

  // 4. Add therapists
  THERAPISTS.forEach(id => {
    urls.push({
      loc: `${BASE_URL}/therapist/${id}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7',
    });
  });

  // 5. Add blogs
  BLOGS.forEach(id => {
    urls.push({
      loc: `${BASE_URL}/blog/${id}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7',
    });
  });

  // 6. Add sellers
  SELLERS.forEach(id => {
    urls.push({
      loc: `${BASE_URL}/seller/${id}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.7',
    });
  });

  // Build XML content with xhtml alternate language links
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  urls.forEach(item => {
    xml += `  <url>\n`;
    xml += `    <loc>${item.loc}</loc>\n`;
    xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
    xml += `    <priority>${item.priority}</priority>\n`;

    // Multi-language hreflang entries
    LANGUAGES.forEach(lang => {
      xml += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${item.loc}?lng=${lang}" />\n`;
    });
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${item.loc}" />\n`;

    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;

  const outputPath = path.join(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(`✅ Sitemap successfully generated at: ${outputPath} (${urls.length} URLs indexed with 4 language variants each)`);
}

generateSitemap();
