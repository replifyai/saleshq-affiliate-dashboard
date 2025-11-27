import { fetchCreatorProfileServer } from '@/lib/server/profile';
import AuthenticatedClientLayout from './AuthenticatedClientLayout';

/**
 * Server Component: Fetches profile data before rendering
 * This ensures profile data is available immediately, improving UX
 */
export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch profile on server-side with automatic token refresh
  const { profile, tokens, error } = await fetchCreatorProfileServer();
console.log('profile', JSON.stringify(profile, null, 2));
  if (error) {
    console.error('Server: Profile fetch error:', error);
  }

  // Pass server-fetched data to client component
  return (
    <AuthenticatedClientLayout
      initialProfile={profile}
      initialTokens={tokens}
    >
      {children}
    </AuthenticatedClientLayout>
  );
}