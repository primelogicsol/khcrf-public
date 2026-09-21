import React from 'react';
import HCRFCoverCanvas from './cover/HCRFCoverCanvas';
import HeaderRegion from './cover/HeaderRegion';
import TitleRegion from './cover/TitleRegion';
import SubtitleRegion from './cover/SubtitleRegion';
import SpacerRegion from './cover/SpacerRegion';
import FooterRegion from './cover/FooterRegion';

interface HCRFPressCoverTemplateProps {
  publicationType: string;
  year: string;
  title: string;
  subtitle?: string | null;
  publicationCode?: string;
  isbn?: string;
  edition?: string;
  isComingSoon?: boolean;
}

export default function HCRFPressCoverTemplateV1({
  publicationType,
  year,
  title,
  subtitle,
  publicationCode,
  isbn,
  edition,
  isComingSoon = false,
}: HCRFPressCoverTemplateProps) {
  
  return (
    <HCRFCoverCanvas>
      <HeaderRegion publicationType={publicationType} year={year} />
      <TitleRegion title={title} />
      <SubtitleRegion subtitle={subtitle} />
      <SpacerRegion />
      <FooterRegion 
        edition={edition} 
        publicationCode={publicationCode} 
        isbn={isbn} 
      />
      {isComingSoon && (
        <div className="absolute top-4 right-4 bg-brand-secondary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg z-50">
          Coming Soon
        </div>
      )}
    </HCRFCoverCanvas>
  );
}
