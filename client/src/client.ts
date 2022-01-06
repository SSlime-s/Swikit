import { GraphQLClient } from 'graphql-request'
import { getSdk } from '../generated/graphql'

const endpoint = "http://localhost:8088/graphql"

const graphQlClient = new GraphQLClient(endpoint)
export const sdk = getSdk(graphQlClient)
