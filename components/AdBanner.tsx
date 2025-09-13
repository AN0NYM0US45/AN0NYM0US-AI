import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any;
  }
}

interface AdBannerProps {
  adSlot: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ adSlot }) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, [adSlot]);

  return (
    <div className="w-full text-center" aria-hidden="true">
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-slot={adSlot}
           data-ad-format="auto"
           data-full-width-responsive="true"></ins>
    </div>
  );
};

export default React.memo(AdBanner);