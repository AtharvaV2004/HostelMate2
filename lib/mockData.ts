import { Trip } from '../types';

export const MOCK_TRIPS: Trip[] = [
  { id: 1, store: 'Dmart', location: '2.5 km away', time: '15 mins', slots: 2, total: 5, user: 'Rahul', rating: 4.8, type: 'Grocery', upiId: 'rahul.sharma@okicici' },
  { id: 2, store: 'Zepto', location: 'Hostel Gate', time: '5 mins', slots: 1, total: 3, user: 'Priya', rating: 4.9, type: 'Quick', upiId: 'priya.v@okaxis' },
  { id: 3, store: 'Blinkit', location: '1.2 km away', time: '10 mins', slots: 4, total: 6, user: 'Amit', rating: 4.7, type: 'Quick', upiId: 'amit.99@oksbi' },
  { id: 4, store: 'McDonalds', location: '3.0 km away', time: '25 mins', slots: 0, total: 4, user: 'Sneha', rating: 4.6, type: 'Food', upiId: 'sneha.foodie@okicici' },
  { id: 5, store: 'Pharmacy', location: '0.5 km away', time: '8 mins', slots: 2, total: 2, user: 'Vikram', rating: 5.0, type: 'Medical', upiId: 'vikram.med@okaxis' },
];

export const ACTIVE_TRIPS = MOCK_TRIPS.slice(0, 2);
