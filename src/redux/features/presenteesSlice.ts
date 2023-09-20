import { Web5 } from "@web5/api"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { depotProtocolDefinition } from "@/app/ConfigureProtocol"

type InitialState = {
  presentees: any[];
  pending: boolean;
  error?: string;
}

const initialState = {
  presentees: [],
  pending: false,
} as InitialState

export const fetchPresentees = createAsyncThunk("presentees/fetchPresentees", async () => {
  const { web5, did: myDid } = await Web5.connect()

  const { records } = await web5.dwn.records.query({
    message: {
      filter: {
        protocol: depotProtocolDefinition.protocol,
        schema: depotProtocolDefinition.types.presentee.schema,
        dataFormat: "application/json",
      },
    },
  })

  const presentees: any[] = []
  if (records) {
    for (const record of records) {
      const presentee = await record.data.json()
      presentees.push(presentee)
    }
  }

  return presentees
})

export const issuePresentee = createAsyncThunk("presentees/issuePresentee", async (presentee: string) => {
  const { web5, did: myDid } = await Web5.connect()

  const { record } = await web5.dwn.records.create({
    data: {
      presentee,
      presenter: myDid 
    },
    message: {
      protocol: depotProtocolDefinition.protocol,
      protocolPath: "presentee",
      schema: depotProtocolDefinition.types.presentee.schema,
      recipient: myDid,
      dataFormat: "application/json",
    },
  })

  const { status } = await record?.send(presentee)
  console.log(status)
  
  // give preference to the new presentee
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

  if (records) {
    for (const record of records) {
      const { status } = await record.send(presentee)
      console.log(status)
    }
  }
})

export const presenteesSlice = createSlice({
  name: "presentees",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPresentees.pending, (state) => {
        state.pending = true
      })
      .addCase(fetchPresentees.fulfilled, (state, action) => {
        state.pending = false
        state.presentees = action.payload
      })
      .addCase(fetchPresentees.rejected, (state, action) => {
        state.pending = false
        state.error = action.error.message
      })
      .addCase(issuePresentee.pending, (state) => {
        state.pending = true
      })
      .addCase(issuePresentee.fulfilled, (state) => {
        state.pending = false
      })
      .addCase(issuePresentee.rejected, (state, action) => {
        state.pending = false
        state.error = action.error.message
      })
  },
})

export default presenteesSlice.reducer
