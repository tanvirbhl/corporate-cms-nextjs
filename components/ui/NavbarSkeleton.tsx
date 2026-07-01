export default function NavbarSkeleton() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md py-5 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="h-8 w-24 bg-gray-200 animate-pulse rounded-md" />
        <div className="hidden md:flex space-x-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 w-16 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
        <div className="h-10 w-24 bg-gray-200 animate-pulse rounded-full" />
      </div>
    </header>
  );
}