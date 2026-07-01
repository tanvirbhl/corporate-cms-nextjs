import Link from "next/link";
import {
  FiLayout,
  FiSettings,
  FiMenu,
  FiLogOut,
  FiImage,
  FiInfo,
} from "react-icons/fi";

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
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <span className="text-2xl font-bold tracking-tight">CMS Admin</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {/* Dashboard Home */}
          <Link
            href="/admin"
            className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-300 hover:bg-white/10 hover:text-white transition-colors mb-6"
          >
            <FiLayout />
            <span>Dashboard Home</span>
          </Link>

          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-4">
            Navigation
          </div>

          <Link
            href="/admin/navbar"
            className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <FiMenu />
            <span>Navbar</span>
          </Link>

          <Link
            href="/admin/hero"
            className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <FiImage />
            <span>Hero Banner</span>
          </Link>
          <Link
            href="/admin/about"
            className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <FiInfo /> <span>About Us</span>
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
          >
            <FiSettings />
            <span>Site Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center space-x-3 px-3 py-2 w-full text-gray-400 hover:text-white transition-colors">
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">Dashboard</h2>
          <div className="text-sm text-gray-500">Admin User</div>
        </header>
        {children}
      </main>
    </div>
  );
}
