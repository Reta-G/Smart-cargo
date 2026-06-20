import image from '../image1.jpg';
import image3 from '../image3.jpg';
import image4 from '../image4.jpg';

export const getServices = (t) => [
  {
    title: t('servicesData.groundShipping'),
    description: t('servicesData.groundShippingDesc'),
    image: image
  },
  {
    title: t('servicesData.smartTracking'),
    description: t('servicesData.smartTrackingDesc'),
    image: image3
  },
  {
    title: t('servicesData.fleetManagement'),
    description: t('servicesData.fleetManagementDesc'),
    image: image4
  },
];
