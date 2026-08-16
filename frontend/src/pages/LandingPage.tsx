import React from 'react';
import OvyraTrustStrip from '../components/ovyra/OvyraTrustStrip';
import OvyraStickyCta from '../components/ovyra/OvyraStickyCta';
import OvyraHeroRealm from '../components/ovyra/OvyraHeroRealm';
import OvyraBrandSystemSection from '../components/ovyra/OvyraBrandSystemSection';
import OvyraArchiveSection from '../components/ovyra/OvyraArchiveSection';
import OvyraQuestSection from '../components/ovyra/OvyraQuestSection';
import OvyraComingSoonSection from '../components/ovyra/OvyraComingSoonSection';

const LandingPage: React.FC = () => {
  return (
    <div className="ovyra-page relative overflow-x-hidden bg-ovyra-void pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] text-ovyra-mist md:pb-0">
      <OvyraHeroRealm />

      <OvyraTrustStrip />

      <OvyraBrandSystemSection />

      <OvyraArchiveSection />

      <OvyraQuestSection />

      <OvyraComingSoonSection />

      <OvyraStickyCta />
    </div>
  );
};

export default LandingPage;
