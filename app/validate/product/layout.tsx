import { Metadata } from 'next';
import { generateSchemaTypeMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSchemaTypeMetadata('product');

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
