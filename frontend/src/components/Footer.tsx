import React from 'react';
import { Link } from 'react-router-dom';
import OvyraLogo from './OvyraLogo';
import { BRAND, COPY } from '../brand/ovyra';

const archiveLinks = [
  { label: 'شخصیت‌ها', to: '/products' },
  { label: 'سبد خرید', to: '/cart' },
  { label: 'داستان برند', to: '/about' },
  { label: 'تماس', to: '/contact' },
] as const;

const legalLinks = [
  { label: 'قوانین', to: '/terms' },
  { label: 'حریم خصوصی', to: '/privacy' },
  { label: 'بازگشت وجه', to: '/refund-policy' },
  { label: 'پشتیبانی', to: '/support' },
] as const;

const Footer: React.FC = () => {
  const { footer, heroRealm } = COPY;

  return (
    <footer className="ovyra-footer ovyra-section-border relative overflow-hidden">
      <div className="ovyra-footer-ambient" aria-hidden>
        <div className="ovyra-footer-glow-left" />
        <div className="ovyra-footer-glow-right" />
        <div className="ovyra-footer-gridlines" />
      </div>

      <div className="ovyra-footer-inner">
        <div className="ovyra-footer-top">
          <div className="ovyra-footer-brand">
            <Link to="/" className="inline-block" aria-label="OVYRA home">
              <OvyraLogo className="h-11 w-auto sm:h-12" />
            </Link>
            <p className="ovyra-footer-eyebrow font-display">{footer.eyebrow}</p>
            <p className="ovyra-footer-tagline font-fa" dir="rtl" lang="fa">
              {footer.tagline}
            </p>
            <p className="ovyra-footer-tagline-en">{footer.taglineEn}</p>
            <p className="ovyra-footer-closing font-display">{BRAND.closing}</p>
            <p className="ovyra-footer-eye-line font-display">{BRAND.eyeLine}</p>
          </div>

          <div className="ovyra-footer-columns">
            <div className="ovyra-footer-panel">
              <h3 className="ovyra-footer-panel-title font-display">{footer.archiveHeading}</h3>
              <ul className="ovyra-footer-links">
                {archiveLinks.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="ovyra-footer-link font-fa">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ovyra-footer-panel">
              <h3 className="ovyra-footer-panel-title font-display">{footer.legalHeading}</h3>
              <ul className="ovyra-footer-links">
                {legalLinks.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="ovyra-footer-link font-fa">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ovyra-footer-panel ovyra-footer-panel-social">
              <h3 className="ovyra-footer-panel-title font-display">{footer.socialHeading}</h3>
              <div className="ovyra-footer-social">
                {heroRealm.social.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="ovyra-footer-social-link font-display"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <p className="ovyra-footer-series font-display">{BRAND.series}</p>
              <p className="ovyra-footer-archive font-display">{BRAND.archive}</p>
            </div>
          </div>
        </div>

        <div className="ovyra-footer-bar">
          <span className="ovyra-footer-copy">
            © {new Date().getFullYear()} OVYRA — The Lost Archive
          </span>
          <span className="ovyra-footer-manifesto font-display">{BRAND.tagline}</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
