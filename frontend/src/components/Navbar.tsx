import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, Package, User, LogOut, LogIn } from 'lucide-react';
import OvyraLogo from './OvyraLogo';
import OvyraNavPill from './ovyra/OvyraNavPill';
import OvyraNavChip from './ovyra/OvyraNavChip';
import { BRAND, NAV_AUTH, NAV_HOME, NAV_PILLS, NAV_UTIL } from '../brand/ovyra';
import { useAuth } from '../context/AuthContext';

const iconProps = { className: 'h-[14px] w-[14px]', strokeWidth: 1.75 };

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, showAuthModal } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const closeMenu = () => setIsMenuOpen(false);

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await logout();
      navigate('/');
    } else {
      showAuthModal();
    }
    closeMenu();
  };

  const utilIcons: Record<string, React.ReactNode> = {
    cart: <ShoppingCart {...iconProps} />,
    orders: <Package {...iconProps} />,
  };

  return (
    <header className="ovyra-header fixed top-0 left-0 right-0 z-50">
      <div className="ovyra-header-beam" aria-hidden />
      <div className="ovyra-header-glow" aria-hidden />

      <div className="ovyra-header-inner relative mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="ovyra-header-brand relative z-[3] shrink-0" onClick={closeMenu}>
          <OvyraLogo className="h-9 w-auto sm:h-10" priority />
          <span className="ovyra-header-brand-meta hidden lg:flex lg:flex-col">
            <span className="font-display text-[10px] tracking-[0.42em] text-ovyra-gold/90">{BRAND.name}</span>
            <span className="font-display text-[8px] tracking-[0.32em] text-white/30">{BRAND.series}</span>
          </span>
        </Link>

        {/* Desktop: centered rail — absolute so viewport center stays exact */}
        <nav
          className="ovyra-header-cluster absolute left-1/2 top-1/2 z-[2] hidden -translate-x-1/2 -translate-y-1/2 md:flex"
          aria-label="ناوبری"
        >
          <OvyraNavChip
            item={{ ...NAV_HOME, id: NAV_HOME.id }}
            active={pathname === '/'}
          />

          <span className="ovyra-header-divider" aria-hidden />

          {NAV_PILLS.map((item) => (
            <OvyraNavPill key={item.id} item={item} />
          ))}

          <span className="ovyra-header-divider" aria-hidden />

          {NAV_UTIL.map((link) => (
            <OvyraNavChip
              key={link.id}
              item={{ ...link, icon: utilIcons[link.id] }}
              active={pathname === link.to}
            />
          ))}

          <span className="ovyra-header-divider" aria-hidden />

          {isAuthenticated ? (
            <>
              <OvyraNavChip
                item={{
                  id: 'profile',
                  to: '/profile',
                  label: user?.username || 'پروفایل',
                  icon: <User {...iconProps} />,
                }}
                active={pathname === '/profile'}
              />
              <OvyraNavPill
                item={{
                  id: NAV_AUTH.logout.id,
                  label: NAV_AUTH.logout.label,
                  accent: NAV_AUTH.logout.accent,
                  glow: NAV_AUTH.logout.glow,
                }}
                icon={<LogOut {...iconProps} />}
                asButton
                onClick={handleAuthAction}
              />
            </>
          ) : (
            <OvyraNavPill
              item={{
                id: NAV_AUTH.login.id,
                label: NAV_AUTH.login.label,
                accent: NAV_AUTH.login.accent,
                glow: NAV_AUTH.login.glow,
              }}
              icon={<LogIn {...iconProps} />}
              asButton
              onClick={handleAuthAction}
            />
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="ovyra-header-menu-btn relative z-[3] shrink-0 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'بستن منو' : 'باز کردن منو'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {isMenuOpen && (
        <div className="ovyra-header-mobile border-t border-white/[0.06] md:hidden">
          <nav className="flex flex-col gap-2 px-4 py-4">
            <OvyraNavChip
              item={{ ...NAV_HOME, id: NAV_HOME.id }}
              fullWidth
              active={pathname === '/'}
              onClick={closeMenu}
            />
            {NAV_PILLS.map((item) => (
              <OvyraNavPill key={item.id} item={item} fullWidth onClick={closeMenu} />
            ))}
          </nav>

          <div className="flex flex-col gap-2 border-t border-white/[0.06] px-4 py-4">
            {NAV_UTIL.map((link) => (
              <OvyraNavChip
                key={link.id}
                item={{ ...link, icon: utilIcons[link.id] }}
                fullWidth
                active={pathname === link.to}
                onClick={closeMenu}
              />
            ))}
          </div>

          <div className="px-4 pb-5">
            {isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <OvyraNavChip
                  item={{
                    id: 'profile',
                    to: '/profile',
                    label: user?.username || 'پروفایل',
                    icon: <User className="h-4 w-4" strokeWidth={1.75} />,
                  }}
                  fullWidth
                  onClick={closeMenu}
                />
                <OvyraNavPill
                  item={{
                    id: NAV_AUTH.logout.id,
                    label: NAV_AUTH.logout.label,
                    accent: NAV_AUTH.logout.accent,
                    glow: NAV_AUTH.logout.glow,
                  }}
                  icon={<LogOut className="h-4 w-4" strokeWidth={1.75} />}
                  fullWidth
                  asButton
                  onClick={handleAuthAction}
                />
              </div>
            ) : (
              <OvyraNavPill
                item={{
                  id: NAV_AUTH.login.id,
                  label: NAV_AUTH.login.label,
                  accent: NAV_AUTH.login.accent,
                  glow: NAV_AUTH.login.glow,
                }}
                icon={<LogIn className="h-4 w-4" strokeWidth={1.75} />}
                fullWidth
                asButton
                onClick={handleAuthAction}
              />
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
