import { Button, Card } from 'antd'
import type { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import { sdk } from '@/src/client'
import styles from '@/styles/Home.module.css'

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const data = await sdk.getPageByTitle({ title: 'Home' })
  const page = data.pageByTitle

  return {
    props: {
      page,
    },
  }
}
type Props = Awaited<ReturnType<typeof getServerSideProps>>['props']

const Home: NextPage<Props> = ({ page }) => {
  return (
    <div>
      <Head>
        <title>Swikit</title>
      </Head>

      <Card className="max-w-screen-lg m-auto" title={page?.title ?? 'undefined'}>
        <article
          className="markdown-body"
          dangerouslySetInnerHTML={{ __html: page?.bodyHtml ?? '' }}
        />
      </Card>

      <Link href="/pages/The Test Page" passHref>
        <Button type="link">tmp link</Button>
      </Link>
    </div>
  )
}

export default Home
