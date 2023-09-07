import { Web5 } from "@tbd54566975/web5"
import { Product } from "@prisma/client"
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

  const { web5, did: myDid } = await Web5.connect()
  const { records } = await web5.dwn.records.query({
    message: {
      filter: {
        schema: "http://depot-schema-registry.org/preference",
        dataFormat: "application/json",
      },
    },
  })

  return Promise.all(products.map(async (product: any) => {
    let liked = false

    if (records) {
      for (const record of records) {
        const data = await record.data.json()
        if (data.productId === product.id) liked = true
      }
    }

    return {
      liked,
      ...product
    }
  }))
})

export const toggleLike = createAsyncThunk("products/toggleLike", async (id: string) => {
  const { web5, did: myDid } = await Web5.connect()

  const { records } = await web5.dwn.records.query({
    message: {
      filter: {
        schema: "http://depot-schema-registry.org/preference",
        dataFormat: "application/json",
      },
    },
  })

  let liked = true
  if (records) {
    for (const record of records) {
      const data = await record.data.json()
      
      if (data.productId === id) {
        await web5.dwn.records.delete({
          message: {
            recordId: record.id,
          },
        })
        liked = false
        break
      }
    }
  }

  if (liked) {
    await web5.dwn.records.create({
      data: { productId: id },
      message: {
        schema: "http://depot-schema-registry.org/preference",
        dataFormat: "application/json",
      },
    })
  }

  return id
})

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
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
      .addCase(toggleLike.fulfilled, (state, action) => {
        const index = state.products.findIndex(product => product.id === action.payload)
        state.products[index].liked = !state.products[index].liked
      })
  },
})

export default productsSlice.reducer
