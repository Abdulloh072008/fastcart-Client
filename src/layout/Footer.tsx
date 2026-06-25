import { Link } from 'react-router-dom'
import { Send } from 'lucide-react'

const ACCOUNT_LINKS = [
  { label: 'My Account', to: '/profile' },
  { label: 'Cart', to: '/cart' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Shop', to: '/catalog' },
]

const QUICK_LINKS = [
  { label: 'Privacy Policy', to: '/' },
  { label: 'Terms Of Use', to: '/' },
  { label: 'FAQ', to: '/' },
  { label: 'Contact', to: '/contact' },
]

// Minimal brand SVG paths (lucide dropped social icons in v1.x)
const SOCIALS: { label: string; href: string; path: string }[] = [
  {
    label: 'Facebook',
    href: '#',
    path: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  },
  {
    label: 'Twitter / X',
    href: '#',
    path: 'M4 4l16 16M4 20 20 4',
  },
  {
    label: 'Instagram',
    href: '#',
    path: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zm1.5-4.87h.01M6.5 6.5h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2z',
  },
  {
    label: 'LinkedIn',
    href: '#',
    path: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zm2-4a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  },
]

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand + Subscribe */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="mb-4 text-xl font-bold text-white">FastCart</h2>
            <p className="mb-1 text-sm font-semibold text-white">Subscribe</p>
            <p className="mb-4 text-sm text-gray-400">Get 10% off your first order</p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex h-10 overflow-hidden rounded-md border border-gray-600"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-gray-500"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="flex items-center justify-center px-3 text-gray-400 transition-colors hover:text-primary"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-5 text-base font-semibold text-white">Support</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                111 Bijoy sarani, Dhaka,
                <br />
                DH 1515, Bangladesh.
              </li>
              <li>exclusive@gmail.com</li>
              <li>+88015-88888-9999</li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-5 text-base font-semibold text-white">Account</h3>
            <ul className="space-y-3 text-sm">
              {ACCOUNT_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-gray-400 transition-colors hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Link */}
          <div>
            <h3 className="mb-5 text-base font-semibold text-white">Quick Link</h3>
            <ul className="space-y-3 text-sm">
              {QUICK_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="text-gray-400 transition-colors hover:text-primary">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-5 text-base font-semibold text-white">Social</h3>
            <div className="flex gap-4">
              {SOCIALS.map(({ label, path, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-gray-400 transition-colors hover:text-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
        &copy; Copyright FastCart {new Date().getFullYear()}. All rights reserved.
      </div>
    </footer>
  )
}
