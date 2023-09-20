"use client"

import { useDispatch } from "react-redux"
import { AppDispatch, useAppSelector } from "@/redux/store"
import { issuePresentee } from "@/redux/features/presenteesSlice"

export function IssuePresentee() {
  const dispatch = useDispatch<AppDispatch>()
  const pending = useAppSelector(state => state.presenteesReducer.pending)

  function issuePresenteeCredential (formData: FormData) {
    const presentee = formData.get("presentee")?.toString()
    if (!presentee ) {
      throw Error("Missing required fields")
    }

    dispatch(issuePresentee(presentee))
  }

  return (
    <form action={issuePresenteeCredential}>
      <input
        required
        name="presentee"
        placeholder="Presentee DID"
        className="input input-bordered mb-3 w-full"
      />
      <button
        className="btn btn-primary btn-block"
        type="submit"
        disabled={pending}
      >
        {pending && <span className="loading loading-spinner" />}
        Issue Presentee Credential
      </button>
    </form>
  )
}
