/**
 * Last Updated Component
 * Displays content freshness signal for E-E-A-T
 */

interface LastUpdatedProps {
  date: string | Date;
  label?: string;
  className?: string;
  showIcon?: boolean;
}

export function LastUpdated({
  date,
  label = 'Last Updated',
  className = '',
  showIcon = true,
}: LastUpdatedProps) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isoDate = dateObj.toISOString();

  return (
    <div className={`inline-flex items-center gap-2 text-sm text-slate-600 ${className}`}>
      {showIcon && (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      <span>
        {label}: <time dateTime={isoDate}>{formattedDate}</time>
      </span>
    </div>
  );
}

/**
 * Author Component
 * Displays authorship information for E-E-A-T
 */

interface AuthorProps {
  name: string;
  role?: string;
  url?: string;
  className?: string;
  showIcon?: boolean;
}

export function Author({
  name,
  role = 'Content Team',
  url,
  className = '',
  showIcon = true,
}: AuthorProps) {
  const content = (
    <div className={`inline-flex items-center gap-2 text-sm text-slate-600 ${className}`}>
      {showIcon && (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      )}
      <span>
        By <span className="font-medium text-slate-800">{name}</span>
        {role && <span className="text-slate-500"> • {role}</span>}
      </span>
    </div>
  );

  if (url) {
    return (
      <a
        href={url}
        className="hover:text-blue-600 transition-colors"
        rel="author"
      >
        {content}
      </a>
    );
  }

  return content;
}

/**
 * Content Metadata Component
 * Combines author and last updated information
 */

interface ContentMetadataProps {
  author?: {
    name: string;
    role?: string;
    url?: string;
  };
  lastUpdated?: string | Date;
  publishedDate?: string | Date;
  className?: string;
  layout?: 'horizontal' | 'vertical';
}

export function ContentMetadata({
  author,
  lastUpdated,
  publishedDate,
  className = '',
  layout = 'horizontal',
}: ContentMetadataProps) {
  const layoutClasses = {
    horizontal: 'flex flex-wrap items-center gap-4',
    vertical: 'flex flex-col gap-2',
  };

  return (
    <div className={`${layoutClasses[layout]} ${className}`}>
      {author && (
        <Author
          name={author.name}
          role={author.role}
          url={author.url}
        />
      )}

      {lastUpdated && (
        <LastUpdated date={lastUpdated} />
      )}

      {publishedDate && !lastUpdated && (
        <LastUpdated date={publishedDate} label="Published" />
      )}
    </div>
  );
}
