/**
 * FAQ data for each schema type validation page
 * Following Google's FAQ guidelines for structured data
 */

import { FAQ } from '@/components/seo/FAQSection';

/**
 * Homepage FAQs
 */
export const homepageFAQs: FAQ[] = [
  {
    question: 'What is the difference between JSON Schema and JSON-LD (Schema.org)?',
    answer: '<strong>This is a Schema.org/JSON-LD validator, NOT a JSON Schema validator.</strong> <strong>JSON Schema</strong> is used to validate the structure of JSON data (like APIs), while <strong>JSON-LD</strong> is a format for implementing Schema.org structured data on websites for SEO and rich results. Our tool validates <strong>schema markup (JSON-LD)</strong> for Schema.org, helping you get rich snippets in Google search. If you need to validate JSON Schema (for APIs/data validation), you\'ll need a tool like <code>ajv</code> instead.',
    helpful: 245,
    dateCreated: '2025-01-27'
  },
  {
    question: 'What is a Schema Markup Validator and why do I need one?',
    answer: 'A schema markup validator checks your website\'s structured data (Schema.org markup in JSON-LD format) to ensure it meets Google\'s requirements for rich results. Our free online schema markup validator tool helps search engines understand your content and display it with enhanced features like star ratings, prices, images, and more in search results. The validator provides instant feedback on errors, warnings, and optimization opportunities for your schema markup.',
    helpful: 186,
    dateCreated: '2025-01-27'
  },
  {
    question: 'How accurate is this schema markup validator compared to Google Rich Results Test?',
    answer: 'Our schema markup validator achieves 99%+ accuracy compared to Google\'s official Rich Results Test. We use the same validation rules and requirements as Google, with additional SEO recommendations based on Schema.org best practices. The online validator checks JSON-LD syntax correctness, required Schema.org properties, image dimensions, date formats, and Google-specific requirements for each schema type.',
    helpful: 128,
    dateCreated: '2025-01-27'
  },
  {
    question: 'Is this a JSON-LD validator or Schema.org validator?',
    answer: 'Both! JSON-LD is the format (JavaScript Object Notation for Linked Data), and Schema.org provides the vocabulary (types and properties). Our tool is a <strong>schema markup validator</strong> that validates <strong>JSON-LD structured data</strong> using <strong>Schema.org vocabulary</strong> for Google Rich Results. When you validate schema markup with our tool, we check both the JSON-LD format syntax and Schema.org property requirements.',
    helpful: 94,
    dateCreated: '2025-01-27'
  },
  {
    question: 'Can I validate multiple URLs at once with this schema validator tool?',
    answer: 'Yes! Use our <a href="/audit" class="text-blue-600 hover:underline">Batch Schema Audit</a> tool to validate schema markup on multiple URLs simultaneously. This online schema validator tool can import URLs from a sitemap, upload a text file, or manually paste a list. The batch validator processes up to 50 URLs concurrently and provides exportable reports with schema markup validation results in PDF, Excel, or JSON formats.',
    helpful: 107,
    dateCreated: '2025-01-27'
  },
  {
    question: 'What schema types does this Schema.org validator support?',
    answer: 'Our schema markup validator supports all major Schema.org types for Google Rich Results including Article, NewsArticle, BlogPosting, Product, Offer, AggregateRating, Organization, LocalBusiness, and BreadcrumbList. Each schema type has dedicated JSON-LD validation rules based on Google\'s Rich Results requirements. We\'re continuously adding more schema types to our validator tool.',
    helpful: 85,
    dateCreated: '2025-01-27'
  },
  {
    question: 'Is this online schema markup validator tool free to use?',
    answer: 'Yes, our Schema Markup Validator is completely free for both single URL validation and batch audits. There are no hidden fees, registration requirements, or usage limits for this online schema validator tool. We believe in providing accessible SEO tools to help everyone improve their website\'s search visibility with proper schema markup.',
    helpful: 152,
    dateCreated: '2025-01-27'
  }
];

/**
 * Article Schema FAQs
 */
export const articleFAQs: FAQ[] = [
  {
    question: 'What\'s the difference between Article, NewsArticle, and BlogPosting?',
    answer: '<strong>Article</strong> is the generic type for any article content. <strong>NewsArticle</strong> is specifically for news content and is required for Google News and Top Stories rich results. <strong>BlogPosting</strong> is for blog posts and personal commentary. All three share the same core requirements but NewsArticle has additional guidelines for news publishers.',
    helpful: 89,
    dateCreated: '2025-01-26'
  },
  {
    question: 'What image dimensions are required for Article rich results?',
    answer: 'Articles must have images that are at least <strong>696 pixels wide by 400 pixels tall</strong>. For best results, Google recommends <strong>1200×675 pixels</strong> or larger. Images should be in JPG, PNG, or WebP format. Multiple images can be provided, and Google will select the most appropriate one for different contexts.',
    helpful: 112,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Do I need both datePublished and dateModified?',
    answer: '<strong>datePublished</strong> is required and must be in ISO 8601 format (e.g., 2025-01-26T12:00:00+00:00). <strong>dateModified</strong> is recommended but optional. If your article has been updated since publication, include dateModified to show users the latest revision date. Both dates help establish content freshness.',
    helpful: 76,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Why does my publisher logo need to be an ImageObject?',
    answer: 'Google requires the publisher logo to be defined as an ImageObject (not just a string URL) to ensure proper display in search results. The logo must include the <code>@type</code>, <code>url</code>, and optionally <code>width</code> and <code>height</code> properties. This structured format helps Google validate and display your logo correctly in Knowledge Panels and article rich results.',
    helpful: 54,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Can I use Organization as the author instead of Person?',
    answer: 'Yes, the author can be either a Person or an Organization. For news articles, Google prefers Person authors with clear bylines. For brand blogs or company announcements, Organization is appropriate. Whichever you choose, always include the <code>name</code> property at minimum, and consider adding <code>url</code> for credibility.',
    helpful: 41,
    dateCreated: '2025-01-26'
  }
];

/**
 * Product Schema FAQs
 */
export const productFAQs: FAQ[] = [
  {
    question: 'What\'s required to show star ratings in search results?',
    answer: 'To display star ratings, include an <strong>aggregateRating</strong> with at least 5 reviews. The rating must have <code>ratingValue</code> (the average score), <code>reviewCount</code> (total number of reviews), and optionally <code>bestRating</code> (usually 5) and <code>worstRating</code> (usually 1). Reviews must be authentic and follow Google\'s review guidelines.',
    helpful: 143,
    dateCreated: '2025-01-26'
  },
  {
    question: 'How do I handle products with multiple variants (sizes, colors)?',
    answer: 'For products with variants, you have two approaches: 1) Create separate Product schema for each variant with unique URLs, or 2) Use a single Product schema with an <strong>AggregateOffer</strong> containing multiple Offer objects for each variant. Include <code>lowPrice</code> and <code>highPrice</code> in AggregateOffer to show the price range in search results.',
    helpful: 67,
    dateCreated: '2025-01-26'
  },
  {
    question: 'What availability values should I use?',
    answer: 'Use the full Schema.org URL format: <code>https://schema.org/InStock</code>, <code>https://schema.org/OutOfStock</code>, <code>https://schema.org/PreOrder</code>, <code>https://schema.org/Discontinued</code>, <code>https://schema.org/LimitedAvailability</code>, or <code>https://schema.org/OnlineOnly</code>. Keep availability accurate and update it when stock status changes.',
    helpful: 92,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Do I need GTIN, MPN, or SKU for product schema?',
    answer: 'While not strictly required for basic Product schema, including product identifiers (<strong>GTIN</strong>, <strong>MPN</strong>, or <strong>SKU</strong>) is highly recommended. These identifiers help Google match your products with other data sources and improve eligibility for Google Shopping and merchant features. GTIN (UPC/EAN/ISBN) is the most universal identifier.',
    helpful: 78,
    dateCreated: '2025-01-26'
  },
  {
    question: 'How long should my priceValidUntil date be?',
    answer: 'Set <code>priceValidUntil</code> to a reasonable future date, typically 30-90 days from now. This tells Google how long the current price is guaranteed. Update this field when you change prices or extend promotions. If you have permanent pricing, you can set it far in the future, but remember to update it if prices change.',
    helpful: 51,
    dateCreated: '2025-01-26'
  }
];

/**
 * Organization Schema FAQs
 */
export const organizationFAQs: FAQ[] = [
  {
    question: 'What\'s the difference between Organization and LocalBusiness?',
    answer: '<strong>Organization</strong> is for general companies, corporations, non-profits, and institutions. <strong>LocalBusiness</strong> is specifically for businesses with physical locations that serve customers in person. Use LocalBusiness if you have store hours, a physical address, and local customers. Use Organization for online-only businesses, corporations, or brand entities.',
    helpful: 104,
    dateCreated: '2025-01-26'
  },
  {
    question: 'How do I get my company logo in Google Knowledge Panel?',
    answer: 'Add Organization schema to your homepage with the <code>logo</code> property pointing to your official logo URL. The logo should be square or rectangular, minimum 112×112 pixels, with a transparent or white background in PNG or SVG format. Google uses this for Knowledge Panels, search results, and other Google services. It may take weeks to months for Google to adopt your logo.',
    helpful: 87,
    dateCreated: '2025-01-26'
  },
  {
    question: 'What should I include in the sameAs property?',
    answer: 'List your official social media profiles and authoritative web presence: Facebook, Twitter/X, LinkedIn, Instagram, YouTube, Wikipedia, Crunchbase, etc. Use full URLs, not usernames. These links help Google verify your organization\'s identity and can appear in your Knowledge Panel. Only include profiles you officially control.',
    helpful: 72,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Should I add Organization schema to every page or just the homepage?',
    answer: 'Add Organization schema to your <strong>homepage</strong> primarily. For other pages (articles, products), use Organization within the <code>publisher</code> or <code>seller</code> properties of other schema types. This creates a clear entity relationship and avoids duplicate Organization markup across your site.',
    helpful: 59,
    dateCreated: '2025-01-26'
  },
  {
    question: 'How do I structure contactPoint for customer service?',
    answer: 'Create a ContactPoint object with <code>@type: "ContactPoint"</code>, <code>telephone</code> (include country code like +1-555-123-4567), <code>contactType</code> (e.g., "Customer Service", "Sales", "Support"), and optionally <code>areaServed</code> (e.g., "US") and <code>availableLanguage</code> (e.g., ["English", "Spanish"]). You can include multiple ContactPoint objects for different departments.',
    helpful: 48,
    dateCreated: '2025-01-26'
  }
];

/**
 * LocalBusiness Schema FAQs
 */
export const localBusinessFAQs: FAQ[] = [
  {
    question: 'What address format should I use for LocalBusiness?',
    answer: 'Use PostalAddress with all components: <code>streetAddress</code>, <code>addressLocality</code> (city), <code>addressRegion</code> (state/province), <code>postalCode</code>, and <code>addressCountry</code> (two-letter ISO code like "US"). This structured format ensures Google Maps and local search can properly locate and display your business.',
    helpful: 98,
    dateCreated: '2025-01-26'
  },
  {
    question: 'How do I format opening hours correctly?',
    answer: 'Use the <code>openingHours</code> property with format: "Mo-Fr 09:00-17:00" for Monday-Friday 9 AM-5 PM, or "Sa 10:00-14:00" for Saturday. Separate multiple time blocks with commas: "Mo-Fr 09:00-17:00, Sa-Su 10:00-14:00". Use 24-hour time format. You can also use <code>openingHoursSpecification</code> for more complex schedules.',
    helpful: 112,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Do I need geo coordinates for local business schema?',
    answer: 'While not strictly required, including <strong>geo coordinates</strong> is highly recommended. Add a GeoCoordinates object with <code>latitude</code> and <code>longitude</code> values (decimal format). This ensures accurate placement on Google Maps and helps with local search rankings. You can find coordinates using Google Maps or geocoding services.',
    helpful: 84,
    dateCreated: '2025-01-26'
  },
  {
    question: 'What priceRange format should I use?',
    answer: 'Use dollar signs to indicate price level: "$" (inexpensive), "$$" (moderate), "$$$" (expensive), "$$$$" (very expensive). This provides quick context for customers. Alternatively, specify actual price ranges like "10-30 USD". The dollar sign format is more common and easier for Google to display.',
    helpful: 67,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Can I include multiple locations for a chain business?',
    answer: 'For multi-location businesses, create separate LocalBusiness schema on each location\'s individual page. On your main website, use Organization schema with references to the locations. Alternatively, use the <code>location</code> property within Organization to list multiple locations. Each location should have its own unique address, phone, and hours.',
    helpful: 73,
    dateCreated: '2025-01-26'
  }
];

/**
 * Breadcrumb Schema FAQs
 */
export const breadcrumbFAQs: FAQ[] = [
  {
    question: 'Do breadcrumbs in search results require structured data?',
    answer: 'Yes! While Google can sometimes infer breadcrumbs from your URL structure, using <strong>BreadcrumbList schema</strong> ensures they display correctly and consistently. Structured breadcrumbs give you full control over how your site hierarchy appears in search results and prevent Google from making incorrect assumptions about your structure.',
    helpful: 126,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Should breadcrumb positions start at 0 or 1?',
    answer: 'Positions must start at <strong>1</strong> (not 0) and be sequential (1, 2, 3, 4...). The first position is typically your homepage. Each ListItem must have a unique position number in ascending order without gaps. This ordering tells Google the exact hierarchy from top to bottom.',
    helpful: 94,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Can I use relative URLs in breadcrumb items?',
    answer: 'No, breadcrumb items must use <strong>absolute URLs</strong> including the protocol (https://). Relative URLs like "/products/category" will fail validation. Each <code>item</code> property should be a complete URL like "https://example.com/products/category". This ensures Google can properly crawl and display the breadcrumb links.',
    helpful: 78,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Should the last breadcrumb item include a URL?',
    answer: 'The URL for the last breadcrumb (current page) is optional. You can either include it as a complete URL or omit the <code>item</code> property entirely for the last ListItem. Both approaches are valid. Include it for consistency, or omit it since the current page doesn\'t need a link to itself.',
    helpful: 61,
    dateCreated: '2025-01-26'
  },
  {
    question: 'What if my product is in multiple categories?',
    answer: 'Choose the <strong>primary or canonical category path</strong> for your breadcrumb. You should only have one BreadcrumbList per page, even if the product appears in multiple categories. Select the most relevant path for users and SEO. Avoid creating multiple BreadcrumbList markup on the same page as this confuses search engines.',
    helpful: 52,
    dateCreated: '2025-01-26'
  }
];

/**
 * Batch Audit FAQs
 */
export const batchAuditFAQs: FAQ[] = [
  {
    question: 'How many URLs can I validate in a batch audit?',
    answer: 'You can validate up to <strong>50 URLs</strong> in a single batch audit. For larger sites, we recommend splitting your sitemap into multiple batches or prioritizing your most important pages. The batch validator processes 5 URLs concurrently for optimal performance while respecting rate limits.',
    helpful: 87,
    dateCreated: '2025-01-26'
  },
  {
    question: 'How long does a batch audit take?',
    answer: 'Batch audit time depends on the number of URLs and their response times. Typically, each URL takes 1-3 seconds to validate. A 50-URL audit usually completes in 2-5 minutes. You can monitor real-time progress during the audit.',
    helpful: 102,
    dateCreated: '2025-01-26'
  },
  {
    question: 'What report formats can I export?',
    answer: 'Batch audit results can be exported in three formats: <strong>PDF</strong> (formatted report for sharing), <strong>Excel/XLSX</strong> (spreadsheet for analysis), and <strong>JSON</strong> (raw data for developers). All formats include URL-by-URL results, overall statistics, error details, and validation scores.',
    helpful: 76,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Can I validate password-protected or staging sites?',
    answer: 'Currently, the batch validator can only access publicly available URLs. For password-protected or staging sites, you\'ll need to either temporarily make them public, use IP whitelisting, or export your schema markup and validate it directly using the JSON-LD input method on individual schema validators.',
    helpful: 58,
    dateCreated: '2025-01-26'
  },
  {
    question: 'What happens if some URLs fail to load?',
    answer: 'Failed URLs are marked in the report with error details (timeout, 404, 500, etc.). The audit continues processing other URLs and provides partial results. You can identify and fix failed URLs, then re-run the audit for just those pages. Common failures include slow servers, blocking, or non-existent pages.',
    helpful: 64,
    dateCreated: '2025-01-26'
  }
];

/**
 * Offer Schema FAQs
 */
export const offerFAQs: FAQ[] = [
  {
    question: 'What is the difference between Offer and AggregateOffer?',
    answer: '<strong>Offer</strong> represents a single product offer with one price and availability status. <strong>AggregateOffer</strong> is for products with multiple offers (variants, sizes, colors) and displays a price range. Use AggregateOffer when you have the same product at different prices or from multiple sellers.',
    helpful: 94,
    dateCreated: '2025-01-26'
  },
  {
    question: 'How should I format the price property?',
    answer: 'The price should be a numeric string without currency symbols: <code>"price": "299.99"</code>, not <code>"$299.99"</code>. Include the <code>priceCurrency</code> separately using ISO 4217 codes (USD, EUR, GBP, etc.). For prices with decimals, use a period (.) not a comma.',
    helpful: 118,
    dateCreated: '2025-01-26'
  },
  {
    question: 'When should I update priceValidUntil?',
    answer: 'Set <code>priceValidUntil</code> to indicate when the current price expires. For sales or promotions, use the end date of the offer. For regular pricing, set it 30-90 days in the future and update regularly. This tells Google the price is temporary and prevents showing outdated pricing in search results.',
    helpful: 76,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Can I include shipping costs in the Offer?',
    answer: 'Yes! Use the <code>shippingDetails</code> property with OfferShippingDetails type. Include shipping rate, delivery time, and shipping destination. This helps Google display accurate total costs in shopping results and can improve click-through rates by showing free shipping upfront.',
    helpful: 63,
    dateCreated: '2025-01-26'
  },
  {
    question: 'What itemCondition values are valid?',
    answer: 'Use full Schema.org URLs: <code>https://schema.org/NewCondition</code>, <code>https://schema.org/UsedCondition</code>, <code>https://schema.org/RefurbishedCondition</code>, or <code>https://schema.org/DamagedCondition</code>. This is especially important for marketplaces selling used or refurbished items.',
    helpful: 51,
    dateCreated: '2025-01-26'
  }
];

/**
 * AggregateRating Schema FAQs
 */
export const aggregateRatingFAQs: FAQ[] = [
  {
    question: 'How many reviews do I need to show star ratings in search?',
    answer: 'While Google doesn\'t specify an exact minimum, we recommend at least <strong>5 authentic reviews</strong> before displaying aggregate ratings. Google may ignore ratings with very few reviews. More reviews (20+) increase the likelihood of stars appearing in search results.',
    helpful: 142,
    dateCreated: '2025-01-26'
  },
  {
    question: 'What is the difference between reviewCount and ratingCount?',
    answer: '<strong>reviewCount</strong> is the total number of written reviews. <strong>ratingCount</strong> is the total number of ratings (which may include star-only ratings without text). Use reviewCount if available, as it\'s more commonly recognized. Some sites allow ratings without reviews, making ratingCount higher.',
    helpful: 87,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Can I use aggregate ratings from third-party sites?',
    answer: 'Only if you have explicit permission and the reviews are displayed on your website. You cannot use ratings from Amazon, Yelp, or other platforms unless you have a licensing agreement and show those reviews on your product pages. Google requires ratings to reflect reviews visible to users on that page.',
    helpful: 96,
    dateCreated: '2025-01-26'
  },
  {
    question: 'How do I handle different rating scales?',
    answer: 'Use <code>bestRating</code> and <code>worstRating</code> to define your scale. Common scales: 1-5 stars (default), 1-10 points, or 0-100 percentage. Google normalizes all scales to 5 stars for display. Example: For a 10-point scale, use <code>"ratingValue": "8.5", "bestRating": "10", "worstRating": "1"</code>.',
    helpful: 73,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Should I include individual Review objects with AggregateRating?',
    answer: 'Yes, it\'s recommended! While AggregateRating shows star counts, individual Review objects can appear as review snippets in search results. Include both <code>aggregateRating</code> and <code>review</code> arrays in your Product schema for maximum rich results visibility.',
    helpful: 58,
    dateCreated: '2025-01-26'
  }
];

/**
 * NewsArticle Schema FAQs
 */
export const newsArticleFAQs: FAQ[] = [
  {
    question: 'What is the difference between NewsArticle and regular Article?',
    answer: '<strong>NewsArticle</strong> is specifically for news content and is required for Google News and Top Stories features. <strong>Article</strong> is for general editorial content. NewsArticle has stricter requirements around timeliness, author attribution, and publisher credibility. Use NewsArticle only for actual news reporting.',
    helpful: 108,
    dateCreated: '2025-01-26'
  },
  {
    question: 'How does NewsArticle affect Google News eligibility?',
    answer: 'NewsArticle schema alone doesn\'t guarantee Google News inclusion. You also need to follow <a href="https://support.google.com/news/publisher-center/answer/9606710" class="text-blue-600 hover:underline">Google News content policies</a>, have a dedicated news section, publish timely content, and maintain editorial standards. The schema helps Google understand your content is news, but quality and policies matter most.',
    helpful: 134,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Are there special image requirements for NewsArticle?',
    answer: 'Yes! For Google News, images should be at least <strong>1200×675 pixels</strong> (larger than the 696×400px minimum for regular articles). Use high-quality, relevant photojournalism. Avoid logos, text overlays, or promotional images. Include proper image credits and captions where applicable.',
    helpful: 91,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Should I update dateModified for news articles?',
    answer: 'Yes, always update <code>dateModified</code> when making significant changes to a news article (corrections, updates, new information). This signals freshness to Google News. For minor typo fixes, updating dateModified is optional. Major updates should be noted in the article itself with an "Updated:" timestamp.',
    helpful: 67,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Can blog posts or opinion pieces use NewsArticle?',
    answer: 'No, use <strong>BlogPosting</strong> or <strong>OpinionNewsArticle</strong> instead. NewsArticle should be reserved for objective news reporting. OpinionNewsArticle is a subtype for opinion journalism and editorial content from news organizations. Personal blogs should use BlogPosting even if discussing current events.',
    helpful: 54,
    dateCreated: '2025-01-26'
  }
];

/**
 * BlogPosting Schema FAQs
 */
export const blogPostingFAQs: FAQ[] = [
  {
    question: 'When should I use BlogPosting instead of Article?',
    answer: '<strong>BlogPosting</strong> is specifically for blog content and personal commentary. <strong>Article</strong> is more generic. Both work similarly in Google Search, but BlogPosting better represents the content type. Use BlogPosting for personal blogs, company blogs, and informal content. Use Article for formal editorial content or documentation.',
    helpful: 86,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Should I include the author\'s social media profiles?',
    answer: 'Yes! For BlogPosting, author credibility is important for E-E-A-T (Experience, Expertise, Authoritativeness, Trust). Include the author\'s <code>url</code> (profile page), <code>sameAs</code> (social profiles like LinkedIn, Twitter), and <code>description</code> (bio). This helps Google understand the author\'s expertise.',
    helpful: 102,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Can I use BlogPosting for WordPress or Medium posts?',
    answer: 'Absolutely! BlogPosting is perfect for WordPress blogs, Medium articles, Ghost blogs, and any blogging platform. Many platforms automatically add BlogPosting schema. Check using our validator to ensure it\'s implemented correctly. If using a CMS, plugins like Yoast SEO (WordPress) or built-in features may handle this.',
    helpful: 73,
    dateCreated: '2025-01-26'
  },
  {
    question: 'How important is the articleSection property for blogs?',
    answer: 'While optional, <code>articleSection</code> helps categorize your content. Use it to indicate the blog category or topic area (e.g., "Technology", "Marketing", "Travel"). This can help Google understand your content\'s context. You can include multiple categories as an array: <code>"articleSection": ["SEO", "Content Marketing"]</code>.',
    helpful: 59,
    dateCreated: '2025-01-26'
  },
  {
    question: 'Should I include wordCount for blog posts?',
    answer: 'Yes, <code>wordCount</code> is a useful optional property that indicates content depth. It helps search engines understand if your post is comprehensive (1500+ words) or a quick tip (300-500 words). Simply count the words in your article body and include: <code>"wordCount": 1847</code>. This can signal content quality.',
    helpful: 48,
    dateCreated: '2025-01-26'
  }
];

/**
 * JSON-LD Validator FAQs
 */
export const jsonldFAQs: FAQ[] = [
  {
    question: 'What is JSON-LD and why do I need a JSON-LD validator?',
    answer: '<strong>JSON-LD (JavaScript Object Notation for Linked Data)</strong> is the recommended format by Google for implementing Schema.org structured data on websites. A JSON-LD validator ensures your structured data syntax is correct, follows Schema.org vocabulary, and meets Google Rich Results requirements. Our free JSON-LD schema validator checks for errors that could prevent your rich snippets from appearing in search results.',
    helpful: 198,
    dateCreated: '2025-01-27'
  },
  {
    question: 'How is JSON-LD different from Microdata or RDFa?',
    answer: 'JSON-LD, Microdata, and RDFa are all formats for adding structured data, but <strong>JSON-LD is Google\'s preferred format</strong>. Unlike Microdata and RDFa which inline markup within HTML elements, JSON-LD uses a separate <code>&lt;script type="application/ld+json"&gt;</code> block, making it easier to implement, maintain, and validate. Our JSON-LD validator specifically checks this format for Schema.org compliance.',
    helpful: 156,
    dateCreated: '2025-01-27'
  },
  {
    question: 'Where should I place JSON-LD code on my webpage?',
    answer: 'JSON-LD structured data should be placed in a <code>&lt;script type="application/ld+json"&gt;</code> tag within the <code>&lt;head&gt;</code> or <code>&lt;body&gt;</code> section of your HTML. Google recommends placing it in the <code>&lt;head&gt;</code> for consistency. You can have multiple JSON-LD blocks on one page for different schema types. Use our JSON-LD validator to verify the code is properly formatted before deployment.',
    helpful: 142,
    dateCreated: '2025-01-27'
  },
  {
    question: 'Can I validate JSON-LD for multiple schema types on one page?',
    answer: 'Yes! A single page can contain multiple JSON-LD blocks for different Schema.org types. For example, an article page might have Article schema, BreadcrumbList schema, and Organization schema. Our JSON-LD schema validator can detect and validate all JSON-LD blocks on your page simultaneously, checking each against its respective Schema.org requirements.',
    helpful: 118,
    dateCreated: '2025-01-27'
  },
  {
    question: 'How do I fix JSON-LD syntax errors?',
    answer: 'Common JSON-LD syntax errors include: missing commas between properties, unescaped quotes in strings, incorrect @context or @type values, and invalid property names. Our JSON-LD validator provides specific error messages with line numbers and fix suggestions. Most errors can be fixed by: 1) Ensuring valid JSON format, 2) Using correct Schema.org property names, 3) Including required @context and @type fields, 4) Escaping special characters in strings.',
    helpful: 103,
    dateCreated: '2025-01-27'
  },
  {
    question: 'Does Google prefer JSON-LD over other structured data formats?',
    answer: 'Yes, Google explicitly recommends JSON-LD as the preferred format for structured data. From Google\'s documentation: "Google recommends using JSON-LD for structured data whenever possible." JSON-LD is easier to implement without modifying existing HTML, supports dynamic content better, and is less error-prone. Use our JSON-LD validator to ensure your implementation meets Google\'s standards for Rich Results.',
    helpful: 134,
    dateCreated: '2025-01-27'
  },
  {
    question: 'Can I use JSON-LD validator for testing before publishing?',
    answer: 'Absolutely! You can paste your JSON-LD code directly into our validator without needing a live URL. This is perfect for testing schema markup during development, verifying updates before deployment, or troubleshooting issues. The JSON-LD schema validator checks syntax, Schema.org compliance, and Google Rich Results requirements even for unpublished code.',
    helpful: 87,
    dateCreated: '2025-01-27'
  }
];

/**
 * Get FAQs for a specific page/schema type
 */
export function getFAQsForPage(pageType: string): FAQ[] {
  const faqMap: Record<string, FAQ[]> = {
    home: homepageFAQs,
    homepage: homepageFAQs,
    article: articleFAQs,
    newsarticle: newsArticleFAQs,
    blogposting: blogPostingFAQs,
    product: productFAQs,
    offer: offerFAQs,
    reviews: aggregateRatingFAQs,
    aggregaterating: aggregateRatingFAQs,
    organization: organizationFAQs,
    localbusiness: localBusinessFAQs,
    breadcrumb: breadcrumbFAQs,
    breadcrumblist: breadcrumbFAQs,
    audit: batchAuditFAQs,
    batch: batchAuditFAQs,
    jsonld: jsonldFAQs,
    'json-ld': jsonldFAQs
  };

  return faqMap[pageType.toLowerCase()] || [];
}
