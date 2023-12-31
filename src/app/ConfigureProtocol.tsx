"use client"

import { Web5 } from "@web5/api"
import { useEffect, useState } from "react"
import LoadingPage from "./loading"
import ErrorPage from "./error"
import { useSession } from "next-auth/react"

export const depotProtocolDefinition = {
  protocol: "https://depot.com",
  published: true,
  types: {
    preference: {
      schema: "https://depot.com/schemas/preference",
      dataFormats: ["application/json"],
    },
    presentee: {
      schema: "https://depot.com/schemas/presentee",
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
    presentee: {
      $actions: [
        {
          who: "anyone",
          can: "write",
        },
        {
          who: "author",
          of: "presentee",
          can: "read",
        },
        {
          who: "recipient",
          of: "presentee",
          can: "read",
        },
      ],
    },
  },
}

export function ConfigureProtocol({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (session) {
      Web5.connect()
        .then(({ web5, did: myDid }) => {
          web5.dwn.protocols.query({
            message: {
              filter: {
                protocol: depotProtocolDefinition.protocol,
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
    } else {
      // wait for MongoDB session loading
      setTimeout(() => setIsLoading(false), 500)
    }
  }, [session])

  if (isLoading) {
    return <LoadingPage />
  }

  if (error) {
    return <ErrorPage />
  }

  return <>{children}</>
}
