import { configureStore } from '@reduxjs/toolkit';

/**
 * ✅ Redux Store Configuration
 * 
 * Currently using Zustand + Axios for state management instead of Redux RTK Query.
 * This store is maintained for future Redux integration if needed.
 */

const rootReducer = {
  // Reducers would go here when Redux is needed
};

// Check if reducer is empty and provide a simple dummy to avoid errors
const reducerToUse = Object.keys(rootReducer).length > 0 ? rootReducer : {
  dummy: (state = {}) => state, // Placeholder reducer
};

export const store = configureStore({
  reducer: reducerToUse,
});
