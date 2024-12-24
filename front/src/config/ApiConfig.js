export const API_URL = 'http://localhost:5000/api';

export const endpoints = {
  auth: {
    login: '/auth/login',
    register: '/auth/register'
  },
  bookings: {
    create: '/bookings',
    list: '/bookings',
    cancel: (id) => `/bookings/${id}`,
    update: (id) => `/bookings/${id}`
  },
  testimonials: {
    create: '/testimonials',
    list: '/testimonials',
    delete: (id) => `/testimonials/${id}`,
    approve: (id) => `/testimonials/${id}/approve`,
    all: '/testimonials/all'
  }
}; 