'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ValidationResult } from '@/lib/validation/types';

interface RichResultsPreviewProps {
  result: ValidationResult;
  deviceType: 'mobile' | 'desktop';
}

export function RichResultsPreview({ result, deviceType }: RichResultsPreviewProps) {
  const { schema } = result;
  const props = schema.properties as Record<string, unknown>;

  // Determine which preview to render based on schema type
  const renderPreview = () => {
    const type = schema.type;

    if (type === 'Article' || type === 'NewsArticle' || type === 'BlogPosting') {
      return <ArticlePreview props={props} deviceType={deviceType} />;
    }

    if (type === 'Product') {
      return <ProductPreview props={props} deviceType={deviceType} />;
    }

    if (type === 'Organization' || type === 'LocalBusiness') {
      return <OrganizationPreview props={props} type={type} />;
    }

    if (type === 'BreadcrumbList') {
      return <BreadcrumbPreview props={props} />;
    }

    if (type === 'FAQPage') {
      return <FAQPreview props={props} />;
    }

    if (type === 'HowTo') {
      return <HowToPreview props={props} />;
    }

    if (type === 'Recipe') {
      return <RecipePreview props={props} deviceType={deviceType} />;
    }

    if (type === 'Event') {
      return <EventPreview props={props} />;
    }

    if (type === 'JobPosting') {
      return <JobPreview props={props} />;
    }

    if (type === 'VideoObject') {
      return <VideoPreview props={props} />;
    }

    return <GenericPreview type={type} />;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-50 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Rich Results Preview</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {schema.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {result.richResultsEligible ? (
          renderPreview()
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="mb-2">This schema is not eligible for Rich Results</p>
            <p className="text-sm">Fix the errors above to enable rich result previews</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ArticlePreview({ props, deviceType }: { props: Record<string, unknown>; deviceType: string }) {
  const imageData = props.image;
  const image = Array.isArray(imageData) ? imageData[0] : imageData;
  const imageUrl = typeof image === 'string' ? image : (image as { url?: string })?.url;
  const authorData = props.author as { name?: string } | string | undefined;
  const author = typeof authorData === 'object' ? authorData?.name : authorData;
  const publisherData = props.publisher as { name?: string } | string | undefined;
  const publisher = typeof publisherData === 'object' ? publisherData?.name : publisherData;
  const datePublished = props.datePublished ? new Date(props.datePublished as string).toLocaleDateString() : '';

  const isMobile = deviceType === 'mobile';

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${isMobile ? 'max-w-sm' : 'max-w-2xl'}`}>
      {/* Google Search Result Style */}
      <div className="p-4">
        {/* Breadcrumb-style URL */}
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
          </svg>
          <span>{publisher || 'example.com'}</span>
          <span>›</span>
          <span>article</span>
        </div>

        {/* Title */}
        <h3 className="text-blue-600 text-xl hover:underline cursor-pointer mb-1 line-clamp-2">
          {(props.headline as string) || 'Article Title'}
        </h3>

        {/* Meta information */}
        <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
          {datePublished && <span>{datePublished}</span>}
          {author && (
            <>
              <span>•</span>
              <span>By {author}</span>
            </>
          )}
        </div>

        <div className={`flex gap-4 ${isMobile ? 'flex-col' : 'flex-row'}`}>
          {/* Image */}
          {imageUrl && (
            <div className={`${isMobile ? 'w-full' : 'w-32'} flex-shrink-0`}>
              <div className="bg-gray-200 rounded overflow-hidden aspect-video">
                <img
                  src={imageUrl}
                  alt={(props.headline as string) || 'Article image'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="flex-1">
            <p className="text-sm text-gray-700 line-clamp-3">
              {(props.description as string) || 'Article description will appear here. This is a preview of how your article will look in Google search results with rich snippets enabled.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductPreview({ props, deviceType }: { props: Record<string, unknown>; deviceType: string }) {
  const imageData = props.image;
  const image = Array.isArray(imageData) ? imageData[0] : imageData;
  const imageUrl = typeof image === 'string' ? image : (image as { url?: string })?.url;
  const offersData = props.offers || props.offer;
  const offersArray = Array.isArray(offersData) ? offersData : [offersData];
  const offerObj = offersArray[0] as { price?: string | number; priceCurrency?: string; availability?: string } | undefined;
  const price = (offersData as { price?: string | number })?.price || offerObj?.price;
  const priceCurrency = (offersData as { priceCurrency?: string })?.priceCurrency || offerObj?.priceCurrency || 'USD';
  const availability = (offersData as { availability?: string })?.availability || offerObj?.availability;
  const aggregateRating = props.aggregateRating as { ratingValue?: number; reviewCount?: number } | undefined;
  const rating = aggregateRating?.ratingValue;
  const reviewCount = aggregateRating?.reviewCount;

  const isMobile = deviceType === 'mobile';

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${isMobile ? 'max-w-sm' : 'max-w-2xl'}`}>
      <div className="p-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
          <span>example.com</span>
          <span>›</span>
          <span>products</span>
        </div>

        {/* Title */}
        <h3 className="text-blue-600 text-xl hover:underline cursor-pointer mb-2 line-clamp-2">
          {(props.name as string) || 'Product Name'}
        </h3>

        <div className={`flex gap-4 ${isMobile ? 'flex-col' : 'flex-row'}`}>
          {/* Image */}
          {imageUrl && (
            <div className={`${isMobile ? 'w-full' : 'w-40'} flex-shrink-0`}>
              <div className="bg-gray-200 rounded overflow-hidden aspect-square">
                <img
                  src={imageUrl}
                  alt={(props.name as string) || 'Product image'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex-1 space-y-2">
            {/* Rating */}
            {rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {rating}/5 {reviewCount && `(${reviewCount} reviews)`}
                </span>
              </div>
            )}

            {/* Price */}
            {price && (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {priceCurrency === 'USD' ? '$' : priceCurrency}
                  {price}
                </span>
                {availability && (
                  <span className={`text-xs px-2 py-1 rounded ${
                    availability.includes('InStock')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {availability.includes('InStock') ? 'In Stock' : 'Out of Stock'}
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-gray-700 line-clamp-2">
              {(props.description as string) || 'Product description will appear here'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrganizationPreview({ props, type }: { props: Record<string, unknown>; type: string }) {
  const logoData = props.logo as { url?: string } | string | undefined;
  const logo = typeof logoData === 'object' ? logoData?.url : logoData;
  const imageData = props.image;
  const image = Array.isArray(imageData) ? imageData[0] : imageData;
  const imageUrl = typeof image === 'string' ? image : (image as { url?: string })?.url;
  const addressData = props.address as { streetAddress?: string; addressLocality?: string; addressRegion?: string; postalCode?: string } | string | undefined;
  const addressValue = typeof addressData === 'string'
    ? addressData
    : addressData
      ? `${addressData.streetAddress || ''}, ${addressData.addressLocality || ''}, ${addressData.addressRegion || ''} ${addressData.postalCode || ''}`.trim()
      : undefined;
  const telephone = (props.telephone || props.phone) as string | undefined;
  const nameValue = props.name ? String(props.name) : 'Organization Name';
  const descValue = props.description ? String(props.description) : undefined;
  const urlValue = props.url ? String(props.url) : undefined;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-md">
      {/* Knowledge Panel Style */}
      <div className="p-6">
        {/* Logo/Image */}
        {(logo || imageUrl) && (
          <div className="mb-4">
            <img
              src={logo || imageUrl}
              alt={nameValue}
              className="w-24 h-24 object-contain rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Name */}
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          {nameValue}
        </h3>

        {/* Type */}
        <p className="text-sm text-gray-600 mb-3">{type}</p>

        {/* Description */}
        {descValue && (
          <p className="text-sm text-gray-700 mb-4 line-clamp-4">
            {descValue}
          </p>
        )}

        {/* Contact Info */}
        <div className="space-y-2 border-t pt-4">
          {addressValue && (
            <div className="flex items-start gap-2 text-sm">
              <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-700">
                {addressValue}
              </span>
            </div>
          )}

          {telephone && (
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-blue-600 hover:underline cursor-pointer">{telephone}</span>
            </div>
          )}

          {urlValue && (
            <div className="flex items-center gap-2 text-sm">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="text-blue-600 hover:underline cursor-pointer">{urlValue}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BreadcrumbPreview({ props }: { props: Record<string, unknown> }) {
  const itemListElement = (props.itemListElement || []) as Array<{ name?: string; item?: { name?: string } }>;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-2xl">
      <div className="p-4">
        <div className="flex items-center gap-1 text-sm text-gray-600 flex-wrap">
          {itemListElement.map((item, index: number) => (
            <div key={index} className="flex items-center gap-1">
              <span className="text-blue-600 hover:underline cursor-pointer">
                {item.name || item.item?.name || `Item ${index + 1}`}
              </span>
              {index < itemListElement.length - 1 && (
                <span className="text-gray-400">›</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FAQPreview({ props }: { props: Record<string, unknown> }) {
  const mainEntity = (props.mainEntity || []) as Array<{ name?: string; acceptedAnswer?: { text?: string } }>;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-2xl">
      <div className="p-4 space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h3>
        {mainEntity.slice(0, 3).map((faq, index) => (
          <details key={index} className="group border-t pt-4">
            <summary className="flex items-center justify-between cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
              {faq.name || `Question ${index + 1}`}
              <svg className="w-5 h-5 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <p className="mt-3 text-sm text-gray-700">
              {faq.acceptedAnswer?.text || 'Answer text'}
            </p>
          </details>
        ))}
        {mainEntity.length > 3 && (
          <p className="text-sm text-gray-500">+ {mainEntity.length - 3} more questions</p>
        )}
      </div>
    </div>
  );
}

function HowToPreview({ props }: { props: Record<string, unknown> }) {
  const steps = (props.step || []) as Array<{ name?: string; text?: string }>;
  const totalTime = props.totalTime as string | undefined;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-2xl">
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {props.name ? String(props.name) : 'How-To Title'}
        </h3>
        {props.description ? (
          <p className="text-sm text-gray-700 mb-4">{String(props.description)}</p>
        ) : null}
        {totalTime && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Total time: {totalTime}
          </div>
        )}
        <div className="space-y-3">
          {steps.slice(0, 5).map((step, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                {index + 1}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{step.name || `Step ${index + 1}`}</h4>
                <p className="text-sm text-gray-700 mt-1">{step.text || 'Step instructions'}</p>
              </div>
            </div>
          ))}
          {steps.length > 5 && (
            <p className="text-sm text-gray-500 pl-11">+ {steps.length - 5} more steps</p>
          )}
        </div>
      </div>
    </div>
  );
}

function RecipePreview({ props, deviceType }: { props: Record<string, unknown>; deviceType: string }) {
  const imageData = props.image;
  const image = Array.isArray(imageData) ? imageData[0] : imageData;
  const imageUrl = typeof image === 'string' ? image : (image as { url?: string })?.url;
  const isMobile = deviceType === 'mobile';

  return (
    <div className={`bg-white rounded-lg border border-gray-200 overflow-hidden ${isMobile ? 'max-w-sm' : 'max-w-2xl'}`}>
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {props.name ? String(props.name) : 'Recipe Name'}
        </h3>

        {imageUrl && (
          <div className="mb-4">
            <img
              src={imageUrl}
              alt={props.name ? String(props.name) : 'Recipe'}
              className="w-full h-48 object-cover rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          {props.prepTime ? (
            <div>
              <p className="text-xs text-gray-600">Prep</p>
              <p className="font-semibold text-sm">{String(props.prepTime)}</p>
            </div>
          ) : null}
          {props.cookTime ? (
            <div>
              <p className="text-xs text-gray-600">Cook</p>
              <p className="font-semibold text-sm">{String(props.cookTime)}</p>
            </div>
          ) : null}
          {props.recipeYield ? (
            <div>
              <p className="text-xs text-gray-600">Serves</p>
              <p className="font-semibold text-sm">{String(props.recipeYield)}</p>
            </div>
          ) : null}
        </div>

        {props.description ? (
          <p className="text-sm text-gray-700 mb-3">{String(props.description)}</p>
        ) : null}
      </div>
    </div>
  );
}

function EventPreview({ props }: { props: Record<string, unknown> }) {
  const startDate = props.startDate ? new Date(props.startDate as string).toLocaleString() : '';
  const location = props.location as { name?: string; address?: string | { streetAddress?: string; addressLocality?: string } } | undefined;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-2xl">
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-16 h-16 bg-blue-100 rounded flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-blue-600">
              {new Date(props.startDate as string || Date.now()).getDate()}
            </span>
            <span className="text-xs text-blue-600">
              {new Date(props.startDate as string || Date.now()).toLocaleString('default', { month: 'short' })}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {props.name ? String(props.name) : 'Event Name'}
            </h3>
            {startDate && (
              <p className="text-sm text-gray-600 mb-2">{startDate}</p>
            )}
            {location && (
              <p className="text-sm text-gray-700">
                📍 {location.name || 'Location'}
              </p>
            )}
            {props.description ? (
              <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                {String(props.description)}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function JobPreview({ props }: { props: Record<string, unknown> }) {
  const hiringOrg = props.hiringOrganization as { name?: string } | undefined;
  const jobLocation = props.jobLocation as { address?: { addressLocality?: string; addressRegion?: string } } | undefined;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-2xl">
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          {props.title ? String(props.title) : 'Job Title'}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          {hiringOrg?.name || 'Company Name'}
        </p>
        {jobLocation?.address && (
          <p className="text-sm text-gray-700 mb-3">
            📍 {jobLocation.address.addressLocality}, {jobLocation.address.addressRegion}
          </p>
        )}
        {props.employmentType ? (
          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded mb-3">
            {String(props.employmentType)}
          </span>
        ) : null}
        {props.description ? (
          <p className="text-sm text-gray-700 line-clamp-3">
            {String(props.description)}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function VideoPreview({ props }: { props: Record<string, unknown> }) {
  const thumbnailData = props.thumbnailUrl;
  const thumbnail = Array.isArray(thumbnailData) ? thumbnailData[0] : thumbnailData;
  const thumbnailUrl = typeof thumbnail === 'string' ? thumbnail : (thumbnail as { url?: string })?.url;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-md">
      {thumbnailUrl && (
        <div className="relative">
          <img
            src={thumbnailUrl}
            alt={props.name ? String(props.name) : 'Video'}
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
            </div>
          </div>
          {props.duration ? (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
              {String(props.duration)}
            </div>
          ) : null}
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1">
          {props.name ? String(props.name) : 'Video Title'}
        </h3>
        {props.description ? (
          <p className="text-sm text-gray-700 line-clamp-2">
            {String(props.description)}
          </p>
        ) : null}
        {props.uploadDate ? (
          <p className="text-xs text-gray-500 mt-2">
            Uploaded: {new Date(props.uploadDate as string).toLocaleDateString()}
          </p>
        ) : null}
      </div>
    </div>
  );
}

function GenericPreview({ type }: { type: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center text-muted-foreground">
        <p className="mb-2">Preview for {type} schema</p>
        <p className="text-sm">This schema type doesn't have a specific rich result preview yet</p>
      </div>
    </div>
  );
}
