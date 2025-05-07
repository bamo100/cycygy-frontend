"use client"

import type React from "react"
import { ApolloClient, InMemoryCache, ApolloProvider, from, createHttpLink } from "@apollo/client"
import { onError } from "@apollo/client/link/error"
import { useEffect, useState } from "react"

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
    )
  if (networkError) console.error(`[Network error]: ${networkError}`)
})

// HTTP link with cookie support
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRPAHQL_URL || "http://localhost:5000/graphql",
  credentials: 'include', // This ensures cookies are sent with requests
});

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  const [client, setClient] = useState<ApolloClient<unknown> | null>(null)

  useEffect(() => {
    // Create Apollo client on the client side
    const client = new ApolloClient({
      link: from([errorLink, httpLink]),
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: "cache-and-network",
        },
      },
    })
    // Log the client configuration for debugging
    //console.log("Apollo Client initialized with URI:", client.link)
    setClient(client)
  }, [])

  if (!client) {
    return null
  }

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}