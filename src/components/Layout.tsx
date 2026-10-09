import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import {
  FileText,
  FlaskConical,
  LayoutDashboard,
  Menu,
  Settings,
  Share2,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Logo from './Logo'

type NavItem = {
  to: string
  label: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/records', label: 'Records', icon: FileText },
  { to: '/share', label: 'Share', icon: Share2 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="mode-banner">
        <p className="container mode-banner-inner">
          <FlaskConical size={16} aria-hidden="true" />
          <span>
            <strong>Demo mode.</strong> All data is fictional. Nothing is stored
            or shared for real.
          </span>
        </p>
      </div>

      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand-link" aria-label="MediVault home" onClick={closeMenu}>
            <Logo />
          </Link>

          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
          </button>

          <nav
            id="primary-navigation"
            className={menuOpen ? 'primary-nav is-open' : 'primary-nav'}
            aria-label="Primary"
          >
            <ul>
              {navItems.map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                    onClick={closeMenu}
                  >
                    <Icon size={18} aria-hidden="true" />
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="nav-actions">
              <Link to="/login" className="btn btn-secondary btn-sm" onClick={closeMenu}>
                Log in
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm" onClick={closeMenu}>
                Sign up
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-content" className="site-main">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <Logo />
          <p className="muted small">
            Hackathon prototype using fictional data only. Not a medical device,
            and not a replacement for hospital information systems.
          </p>
        </div>
      </footer>
    </div>
  )
}