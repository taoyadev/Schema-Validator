import { Metadata } from 'next';
import { generateSchemaTypeMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSchemaTypeMetadata('breadcrumb');

export default function BreadcrumbLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
