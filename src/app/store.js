import { configureStore } from '@reduxjs/toolkit';
import enquiryReducer from '../features/enquiry/enquirySlice';
import { loadState, saveState } from '../utils/sessionStorage';

// Load persisted state from sessionStorage on app startup
const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    enquiry: enquiryReducer,
  },
  preloadedState,
});

// Save to sessionStorage whenever the store changes
store.subscribe(() => {
  saveState(store.getState());
});
