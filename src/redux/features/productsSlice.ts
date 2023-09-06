import { Product } from "@prisma/client";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"

type InitialState = {
  products: ProductState[];
  isLoading: boolean;
  error?: string;
}

type ProductState = {
  liked: boolean;
} & Product

const initialState = {
  products: [],
  isLoading: false,
} as InitialState

export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const response =  await fetch("/api/products")
  const products = await response.json()
  return products.map((product: any) => {
    return {
      liked: false,
      ...product
    }
  })
})

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    toggleLike: (state, action: PayloadAction<string>) => {
      const index = state.products.findIndex(product => product.id === action.payload)
      state.products[index].liked = !state.products[index].liked
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false
        state.products = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message
      })
  },
})

export const { toggleLike } = productsSlice.actions
export default productsSlice.reducer
