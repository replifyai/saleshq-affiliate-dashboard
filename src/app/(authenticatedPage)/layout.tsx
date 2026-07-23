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
  // Fetch profile on server-side (reads httpOnly token cookies, refreshes as needed).
  // Tokens are intentionally NOT forwarded to the client — they stay httpOnly.
  const { profile, error, errorType } = await fetchCreatorProfileServer();

  if (error) {
    console.error('Server: Profile fetch error:', error, `(type: ${errorType})`);
  }

  // Pass server-fetched data (including errors) to client component
  return (
    <AuthenticatedClientLayout
      initialProfile={profile}
      initialError={error}
      initialErrorType={errorType}
    >
      {children}
    </AuthenticatedClientLayout>
  );
}
