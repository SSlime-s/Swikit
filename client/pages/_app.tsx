import '@/styles/globals.css'
import 'antd/dist/antd.css'
import { Layout } from 'antd'
import Search from 'antd/lib/input/Search'
import { Content, Footer } from 'antd/lib/layout/layout'
import type { AppProps } from 'next/app'
import Image from 'next/image'
import 'windi.css'
import Link from 'next/link'

const { Header } = Layout

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout className="min-h-screen">
      <Header className="bg-white flex items-center fixed z-50 w-full">
        <Link href="/">
          <a className="mr-4 text-lg">Swikit</a>
        </Link>
        <Search className="max-w-80" placeholder="search" allowClear />
      </Header>

      <Content className="mt-[64px] flex-grow">
        <Component {...pageProps} />
      </Content>

      <Footer className="text-center">
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          rel="noopener noreferrer"
          target="_blank"
        >
          Powered by{' '}
          <span>
            <Image alt="Vercel Logo" height={16} src="/vercel.svg" width={72} />
          </span>
        </a>
      </Footer>
    </Layout>
  )
}

export default MyApp
