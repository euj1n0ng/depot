import { configureStore } from "@reduxjs/toolkit"
import productsReducer from "./features/productsSlice"
import presenteesReducer from "./features/presenteesSlice"
import { TypedUseSelectorHook, useSelector } from "react-redux"

export const store = configureStore({
  reducer: {
    productsReducer,
    presenteesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
