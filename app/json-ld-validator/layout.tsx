import { generateSchemaTypeMetadata } from '@/lib/seo/metadata';

export const metadata = generateSchemaTypeMetadata('jsonld');

export default function JsonLdValidatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
