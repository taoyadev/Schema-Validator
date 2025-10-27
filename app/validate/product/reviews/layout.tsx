import { Metadata } from 'next';
import { generateSchemaTypeMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSchemaTypeMetadata('aggregaterating');

export default function AggregateRatingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
