import { Metadata } from 'next';
import { generateSchemaTypeMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSchemaTypeMetadata('blogposting');

export default function BlogPostingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
