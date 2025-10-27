import { Metadata } from 'next';
import { generateSchemaTypeMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSchemaTypeMetadata('newsarticle');

export default function NewsArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
