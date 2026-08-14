import React from 'react';
import { Link } from 'react-router-dom';
import OvyraLogo from './OvyraLogo';
import { BRAND, COPY } from '../brand/ovyra';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-black py-12">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <OvyraLogo className="h-12 w-auto" />
          <p className="font-fa mt-4 max-w-md text-sm leading-7 text-ovyra-mist/65">
            {COPY.footer.tagline}
          </p>
          <p className="mt-3 font-display text-[11px] tracking-[0.35em] text-ovyra-gold">
            {BRAND.tagline}
          </p>
        </div>

        <div>
          <h3 className="font-display text-xs tracking-[0.3em] text-white">ARCHIVE</h3>
          <ul className="mt-4 space-y-2 text-sm text-ovyra-mist/70">
            <li><Link className="hover:text-ovyra-gold" to="/products">شخصیت‌ها</Link></li>
            <li><Link className="hover:text-ovyra-gold" to="/cart">سبد خرید</Link></li>
            <li><Link className="hover:text-ovyra-gold" to="/about">داستان برند</Link></li>
            <li><Link className="hover:text-ovyra-gold" to="/contact">تماس</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-xs tracking-[0.3em] text-white">POLICY</h3>
          <ul className="mt-4 space-y-2 text-sm text-ovyra-mist/70">
            <li><Link className="hover:text-ovyra-gold" to="/terms">قوانین</Link></li>
            <li><Link className="hover:text-ovyra-gold" to="/privacy">حریم خصوصی</Link></li>
            <li><Link className="hover:text-ovyra-gold" to="/refund-policy">بازگشت وجه</Link></li>
            <li><Link className="hover:text-ovyra-gold" to="/support">پشتیبانی</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-white/10 px-5 pt-6 text-center text-xs text-ovyra-mist/45 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:text-right">
        <span>© {new Date().getFullYear()} OVYRA — The Lost Archive</span>
        <span className="font-display text-[10px] tracking-[0.22em] sm:text-xs sm:tracking-[0.3em]">{BRAND.closing}</span>
      </div>
    </footer>
  );
};

export default Footer;
