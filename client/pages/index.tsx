import type { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Card } from 'antd'
import { sdk } from '../src/client'

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const data = await sdk.getPageByTitle({ title: 'Home' })
  const page = data.pageByTitle

  return {
    props: {
      page
    }
  }
}
type Props = Awaited<ReturnType<typeof getServerSideProps>>["props"]

const Home: NextPage<Props> = ({ page }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Swikit</title>
      </Head>

      <main>
        <Card title={page?.title ?? "undefined"}>
          <div dangerouslySetInnerHTML={{ __html: page?.bodyHtml ?? ""}} />
        </Card>
        <Button type="primary">Button</Button>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
