import { getSiteSettings } from "@/actions/settings.action";
import Link from "next/link";
import { FiFacebook, FiLinkedin, FiGithub } from "react-icons/fi";

export default async function Footer() {
  const settings = await getSiteSettings();

  if (!settings) return null;

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold">{settings.siteName}</h3>
          <p className="text-gray-400 mt-2">{settings.address}</p>
        </div>

        <div>
          <h4 className="font-semibold">Contact</h4>
          <p className="text-gray-400">{settings.email}</p>
          <p className="text-gray-400">{settings.phone}</p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            {settings.socialLinks?.facebook && (
              <Link href={settings.socialLinks.facebook} target="_blank">
                <FiFacebook className="text-2xl " />
              </Link>
            )}
            {settings.socialLinks?.linkedin && (
              <Link href={settings.socialLinks.linkedin} target="_blank">
                <FiLinkedin className="text-2xl " />
              </Link>
            )}
            {settings.socialLinks?.github && (
              <Link href={settings.socialLinks.github} target="_blank">
                <FiGithub className="text-2xl " />
              </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
