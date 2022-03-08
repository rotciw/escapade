import sanityClient from '@sanity/client';

export default sanityClient({
  projectId: 'goaqtmij',
  dataset: 'production',
  // Choose dataset development or production
  useCdn: true,
  apiVersion: '2022-02-03',
});
