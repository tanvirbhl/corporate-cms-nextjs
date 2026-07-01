import Link from "next/link";
import { FiLayout, FiSettings, FiMenu, FiLogOut } from "react-icons/fi";

export const metadata = {
  title: "Admin Dashboard | Corporate CMS",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Scalable for 30+ modules later */}
      <aside className="w-64 bg-brand-primary text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <span className="text-2xl font-bold tracking-tight">CMS Admin</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">
            Navigation
          </div>
          <Link 
            href="/admin/navbar" 
            className="flex items-center space-x-3 px-3 py-2 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <FiMenu />
            <span>Navbar</span>
          </Link>

          {/* Placeholders for future phases */}
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-6">
            Future Modules
          </div>
          <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-400 opacity-50 cursor-not-allowed">
            <FiLayout />
            <span>Hero Banner</span>
          </div>
          <div className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-400 opacity-50 cursor-not-allowed">
            <FiSettings />
            <span>Site Settings</span>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center space-x-3 px-3 py-2 w-full rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Admin User</span>
            <div className="h-8 w-8 rounded-full bg-brand-accent text-white flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}