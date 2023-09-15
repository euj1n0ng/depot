"use client"

import { useEffect, useState } from "react"
import "./wasm_exec.js"
import "./wasmTypes.d.ts"
import LoadingPage from "../loading"

async function loadWasm(): Promise<void> {
  const goWasm = new window.Go()
  const result = await WebAssembly.instantiateStreaming(fetch('main.wasm'), goWasm.importObject)
  goWasm.run(result.instance)
}

export function LoadWasm({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadWasm().then(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return <LoadingPage />
  }

  return <>{children}</>
}
