import React from 'react';
import { ClipboardCheck, Package, Truck, ShieldCheck } from 'lucide-react';

export const getHowItWorksSteps = (t) => [
  {
    id: 1,
    title: t('howItWorksData.requestQuote'),
    description: t('howItWorksData.requestQuoteDesc'),
    icon: <ClipboardCheck className="w-10 h-10 stroke-[1.5]" />,
    tag: "Analysis"
  },
  {
    id: 2,
    title: t('howItWorksData.cargoProcessing'),
    description: t('howItWorksData.cargoProcessingDesc'),
    icon: <Package className="w-10 h-10 stroke-[1.5]" />,
    tag: "Operations"
  },
  {
    id: 3,
    title: t('howItWorksData.liveTransit'),
    description: t('howItWorksData.liveTransitDesc'),
    icon: <Truck className="w-10 h-10 stroke-[1.5]" />,
    tag: "Logistics"
  },
  {
    id: 4,
    title: t('howItWorksData.proofOfArrival'),
    description: t('howItWorksData.proofOfArrivalDesc'),
    icon: <ShieldCheck className="w-10 h-10 stroke-[1.5]" />,
    tag: "Execution"
  }
];
