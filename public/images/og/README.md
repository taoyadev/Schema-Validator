# OpenGraph Images Guide

## Image Specifications

**Required Dimensions:**
- Width: 1200px
- Height: 630px
- Format: PNG or JPG
- Max file size: 8MB (recommended < 300KB)

## Image Naming Convention

Images should be named according to the schema type:
- `schema-validator-og.png` - Homepage
- `article-og.png` - Article validator
- `newsarticle-og.png` - NewsArticle validator
- `blogposting-og.png` - BlogPosting validator
- `product-og.png` - Product validator
- `offer-og.png` - Offer validator
- `aggregaterating-og.png` - Review validator
- `organization-og.png` - Organization validator
- `localbusiness-og.png` - LocalBusiness validator
- `breadcrumb-og.png` - Breadcrumb validator

## Design Guidelines

### Brand Elements
- Primary color: #0F172A (slate-900)
- Accent colors: #3B82F6 (blue), #8B5CF6 (purple)
- Typography: Inter font family
- Logo: "Schema Validator" with icon

### Content Structure
1. **Background**: Gradient from slate-900 to slate-800
2. **Main Text**: Schema type name (e.g., "Product Schema Validator")
3. **Tagline**: Short description (e.g., "Validate e-commerce structured data")
4. **Visual Element**: Relevant icon or illustration
5. **Branding**: "Schema Validator" logo/text

### Example Design Template
```
┌────────────────────────────────────────┐
│  [Icon]                                │
│                                        │
│  Product Schema Validator              │
│  Validate e-commerce structured data  │
│                                        │
│                    Schema Validator ✓  │
└────────────────────────────────────────┘
```

## Tools for Creating OG Images

### Online Tools (Recommended for Quick Creation)
1. **Canva** (canva.com)
   - Use custom dimensions: 1200x630px
   - Free templates available
   - Easy export

2. **Figma** (figma.com)
   - Professional design tool
   - Precise control
   - Team collaboration

3. **Photopea** (photopea.com)
   - Free Photoshop alternative
   - Works in browser
   - Supports PSD files

### Automated Generation (Recommended for Consistency)
1. **Vercel OG Image Generation**
   - Dynamic generation at edge
   - Consistent branding
   - See: https://vercel.com/docs/concepts/functions/edge-functions/og-image-generation

2. **Cloudinary**
   - Image transformations
   - Text overlays
   - Dynamic URLs

## Quick Start: Creating Your First OG Image

### Using Canva (Easiest)
1. Go to canva.com
2. Create custom size: 1200x630px
3. Use gradient background (#0F172A → #1E293B)
4. Add text:
   - Title: Inter Bold, 72px, White
   - Subtitle: Inter Regular, 36px, #CBD5E1
5. Add icon (emoji or SVG)
6. Export as PNG
7. Save to `public/images/og/`

### Using Figma (Professional)
1. Create new file, frame 1200x630px
2. Apply gradient background
3. Add text layers with Inter font
4. Add decorative elements
5. Export as PNG (2x for retina)
6. Optimize with TinyPNG
7. Save to `public/images/og/`

## Automated OG Image Generation (Optional)

For dynamic OG images, you can use Vercel's OG Image Generation:

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || 'Schema Validator';
  
  return new ImageResponse(
    (
      <div style={{
        background: 'linear-gradient(to bottom right, #0F172A, #1E293B)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Inter',
      }}>
        <h1 style={{ fontSize: 72, fontWeight: 'bold' }}>{title}</h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

## Testing Your OG Images

### Before Publishing
1. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/

### After Publishing
- Share a test link on Twitter/Facebook/LinkedIn
- Check if image displays correctly
- Verify image loads quickly
- Ensure text is readable

## Current Status

**Configured but images not created yet.**

All pages are configured to use OG images, but the actual PNG files need to be created and placed in this directory.

**Priority order:**
1. Homepage (`schema-validator-og.png`) - Most important
2. Product (`product-og.png`) - E-commerce focus
3. Article (`article-og.png`) - Content publishers
4. Remaining validators - As needed

## File Checklist

- [ ] `schema-validator-og.png` (Homepage)
- [ ] `article-og.png`
- [ ] `newsarticle-og.png`
- [ ] `blogposting-og.png`
- [ ] `product-og.png`
- [ ] `offer-og.png`
- [ ] `aggregaterating-og.png`
- [ ] `organization-og.png`
- [ ] `localbusiness-og.png`
- [ ] `breadcrumb-og.png`

---

**Note:** Until images are created, social media platforms will use fallback behaviors (usually just the page title and description).
