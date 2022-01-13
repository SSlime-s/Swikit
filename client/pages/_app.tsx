import '../styles/globals.css'
import 'antd/dist/antd.css'
import type { AppProps } from 'next/app'
import { Layout } from 'antd'
import Image from 'next/image'
import Search from 'antd/lib/input/Search'
import 'windi.css'
import { Content, Footer } from 'antd/lib/layout/layout'
import Link from 'next/link'

const { Header } = Layout


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout className='h-screen'>
      <Header className='bg-white flex items-center fixed z-50 w-full'>
        <Link href="/">
          <a className='mr-4 text-lg'>Swikit</a>
        </Link>
        <Search placeholder='search' allowClear className='max-w-80' />
      </Header>
      <Content className='mt-[64px] flex-grow'>
        <Component {...pageProps} />
      </Content>
      <Footer className='text-center'>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </Footer>
    </Layout>
  )
}

export default MyApp
