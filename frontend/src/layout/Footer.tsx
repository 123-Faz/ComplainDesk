import {
  ShieldCheckIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const Footer = () => {
  return (
    <footer className="bg-bg2 text-foreground relative overflow-hidden">
      {/* Decorative top line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Main footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-white/10 pb-8">
          {/* Logo + About */}
          <div>
            <div className="flex items-center mb-3">
              <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                Complaint Desk
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              A transparent and user-friendly platform to submit, track, and
              resolve complaints effectively with real-time updates.
            </p>
            <div className="flex space-x-3">
              <button className="bg-blue-600 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center transition">
                <UsersIcon className="h-3 w-3 mr-1.5" />
                Join Community
              </button>
              <button className="border border-gray-400 hover:border-blue-600 text-gray-600 dark:text-gray-300 hover:text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium transition">
                <QuestionMarkCircleIcon className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["About Us", "How It Works", "Features", "Community", "Contact"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition text-xs"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-foreground">
              Resources
            </h3>
            <ul className="space-y-2">
              {["FAQ", "Support Center", "Privacy Policy", "Terms of Service"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-600 dark:text-gray-300 hover:text-indigo-500 transition text-xs"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-foreground">
              Contact Info
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <PhoneIcon className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Hotline</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    +92 300 1234567
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <EnvelopeIcon className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    support@complaintdesk.com
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <MapPinIcon className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Office</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Karachi, Pakistan
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center mt-6 text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Complaint Desk. All rights reserved.
          </p>
          <div className="flex gap-4 mt-3 md:mt-0">
            {["Privacy", "Terms", "Support", "Accessibility"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition"
              >
                {item}
              </a>
            ))}
          </div>
        </div>

        {/* Badge */}
        <div className="absolute bottom-2 right-2">
          <div className="bg-blue-600/10 border border-blue-600/30 rounded-full px-2 py-1 backdrop-blur-sm">
            <p className="text-blue-600 text-xs font-medium flex items-center">
              <ExclamationTriangleIcon className="h-2.5 w-2.5 mr-1" />
              TRANSPARENT & FAIR
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
