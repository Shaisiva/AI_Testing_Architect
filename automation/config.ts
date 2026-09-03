export const config = {
  baseURL: (process.env.BASE_URL ?? 'https://demo.inventree.org').replace(/\/$/, ''),
  user: process.env.INVENTREE_USER ?? 'allaccess',
  password: process.env.INVENTREE_PASSWORD ?? 'nolimits',
  readOnlyUser: process.env.INVENTREE_READONLY_USER ?? 'reader',
  readOnlyPassword: process.env.INVENTREE_READONLY_PASSWORD ?? 'readonly',
  noPrivUser: process.env.INVENTREE_NOPRIV_USER ?? 'noaccess',
  noPrivPassword: process.env.INVENTREE_NOPRIV_PASSWORD ?? 'youshallnotpass',
  dataPrefix: 'QA-ARCH',
};
