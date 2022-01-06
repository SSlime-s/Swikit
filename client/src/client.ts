import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { GraphQLClient } from 'graphql-request'
import { getSdk } from '../generated/graphql'

const endpoint = "http://localhost:8088/graphql"

export const apollo = new ApolloClient({
  uri: endpoint,
  cache: new InMemoryCache(),
})

const graphQlClient = new GraphQLClient(endpoint)
export const sdk = getSdk(graphQlClient)
