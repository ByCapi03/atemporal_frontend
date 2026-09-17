export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
  },
  catalog: {
    products: '/catalog/products',
    categories: '/catalog/categories',
  },
  branches: {
    list: '/branches',
  },
  reservations: {
    create: '/reservations',
    list: '/reservations',
  },
  cart: {
    items: '/cart/items',
  },
  orders: {
    list: '/orders',
  },
};
