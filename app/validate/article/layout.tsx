import { Metadata } from 'next';
import { generateSchemaTypeMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSchemaTypeMetadata('article');

export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
