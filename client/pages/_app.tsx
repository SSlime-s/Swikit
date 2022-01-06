import '../styles/globals.css'
import 'antd/dist/antd.css'
import type { AppProps } from 'next/app'
import { Layout } from 'antd'
import Search from 'antd/lib/input/Search'
import 'windi.css'

const { Header } = Layout


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Header className='bg-white flex items-center'>
        <Search placeholder='search' allowClear className='max-w-80' />
      </Header>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
