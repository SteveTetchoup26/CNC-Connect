import { configureStore } from "@reduxjs/toolkit";
import concoursReducer from "@/features/concours/concoursSlice";

export const store = configureStore({
  reducer: {
    concours: concoursReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;