import type { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Card } from 'antd'
import { sdk } from '../src/client'
import Link from 'next/link'

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

      <Card title={page?.title ?? "undefined"}>
        <div dangerouslySetInnerHTML={{ __html: page?.bodyHtml ?? ""}} />
      </Card>

      <Link href="/pages/The Test Page" passHref>
        <Button type="link">tmp link</Button>
      </Link>
    </div>
  )
}

export default Home
