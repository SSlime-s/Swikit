import '../styles/globals.css'
import 'antd/dist/antd.css'
import type { AppProps } from 'next/app'
import { Layout } from 'antd'
import Search from 'antd/lib/input/Search'
import 'windi.css'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

const { Header } = Layout

const client = new ApolloClient({
  uri: "http://localhost:8088/graphql",
  cache: new InMemoryCache(),
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Header className='bg-white flex items-center'>
          <Search placeholder='search' allowClear className='max-w-80' />
        </Header>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  )
}

export default MyApp
