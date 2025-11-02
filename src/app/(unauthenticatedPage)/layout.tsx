export default function UnauthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* <Navigation className="fixed top-0 left-0 right-0 z-50" /> */}
      <div>{children}</div>
    </div>
  );
}