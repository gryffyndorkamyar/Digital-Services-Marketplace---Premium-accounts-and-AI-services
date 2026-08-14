import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-ovyra-void text-ovyra-mist">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
