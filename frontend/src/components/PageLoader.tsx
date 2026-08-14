import React from 'react';

const PageLoader: React.FC = () => (
  <div className="flex min-h-[50vh] items-center justify-center bg-ovyra-void">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-ovyra-violet/30 border-t-ovyra-gold" />
  </div>
);

export default PageLoader;
