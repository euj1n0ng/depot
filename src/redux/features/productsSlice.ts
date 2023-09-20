import { Web5 } from "@web5/api"
import { Product } from "@prisma/client"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { depotProtocolDefinition } from "@/app/ConfigureProtocol"

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

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (loggedIn: boolean) => {
  const response =  await fetch("/api/products")
  const products = await response.json()

  const likedProductIds: string[] = []

  if (loggedIn) {
    const { web5, did: myDid } = await Web5.connect()
    console.log(myDid)
  
    const { records } = await web5.dwn.records.query({
      message: {
        filter: {
          protocol: depotProtocolDefinition.protocol,
          schema: depotProtocolDefinition.types.preference.schema,
          dataFormat: "application/json",
          recipient: myDid,
        },
      },
    })
    console.log(records)
  
    if (records) {
      for (const record of records) {
        const data = await record.data.json()
        likedProductIds.push(data.productId)
      }
    }
  }

  return products.map((product: Product) => {
    let liked = false
    if (likedProductIds.length > 0) {
      liked = likedProductIds.includes(product.id)
    }

    return {
      liked,
      ...product
    }
  })
})

export const toggleLike = createAsyncThunk("products/toggleLike", async (id: string) => {
  const { web5, did: myDid } = await Web5.connect()

  const { records } = await web5.dwn.records.query({
    message: {
      filter: {
        protocol: depotProtocolDefinition.protocol,
        schema: depotProtocolDefinition.types.preference.schema,
        dataFormat: "application/json",
        recipient: myDid,
      },
    },
  })

  let liked = true
  if (records) {
    for (const record of records) {
      const data = await record.data.json()
      
      if (data.productId === id) {
        await record.delete()
        liked = false
        
        break
      }
    }
  }

  if (liked) {
    const { record: preference } = await web5.dwn.records.create({
      data: { productId: id },
      message: {
        protocol: depotProtocolDefinition.protocol,
        protocolPath: "preference",
        schema: depotProtocolDefinition.types.preference.schema,
        recipient: myDid,
        dataFormat: "application/json",
      },
    })
    const { records } = await web5.dwn.records.query({
      message: {
        filter: {
          protocol: depotProtocolDefinition.protocol,
          schema: depotProtocolDefinition.types.presentee.schema,
          dataFormat: "application/json",
          recipient: myDid,
        },
      },
    })
    if (records) {
      for (const record of records) {
        const data = await record.data.json()

        const { status } = await preference?.send(data.presentee)
        console.log(status)
      }
    }
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
