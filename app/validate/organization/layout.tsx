import { Metadata } from 'next';
import { generateSchemaTypeMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generateSchemaTypeMetadata('organization');

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
