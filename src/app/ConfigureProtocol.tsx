"use client"

import { Web5 } from "@web5/api"
import { useEffect, useState } from "react"
import LoadingPage from "./loading"
import ErrorPage from "./error"

export const depotProtocolDefinition = {
  protocol: "https://depot.com/protocol",
  published: true,
  types: {
    preference: {
      schema: "https://depot.com/protocol/preference",
      dataFormats: ["application/json"],
    },
  },
  structure: {
    preference: {
      $actions: [
        {
          who: "anyone",
          can: "write",
        },
        {
          who: "author",
          of: "preference",
          can: "read",
        },
        {
          who: "recipient",
          of: "preference",
          can: "read",
        },
      ],
    },
  },
}

export function ConfigureProtocol({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    Web5.connect()
      .then(({ web5, did: myDid }) => {
        web5.dwn.protocols.query({
          message: {
            filter: {
              protocol: "https://depot.com/protocol",
            },
          },
        })
          .then(({ protocols, status: queryStatus }) => {
            if (queryStatus.code !== 200) {
              console.error("failed to query protocols", queryStatus)
              setIsLoading(false)
              setError(true)
              return
            }

            if (protocols.length > 0) {
              console.log("protocol already exists")
              setIsLoading(false)
              return
            }

            web5.dwn.protocols.configure({
              message: {
                definition: depotProtocolDefinition,
              },
            })
              .then(({ status: configureStatus, protocol }) => {
                if (configureStatus.code !== 202) {
                  console.error("failed to configure protocol", configureStatus)
                  setIsLoading(false)
                  setError(true)
                  return
                }

                setIsLoading(false)

                // configure protocol on remote DWN, in case sync may not have occured yet
                protocol?.send(myDid).then(({ status: remoteConfigureStatus }) => {
                  console.log("configure protocol remote status", remoteConfigureStatus)
                })
              })
          })
      })
  }, [])

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    return <ErrorPage />
  }

  return <>{children}</>
}
