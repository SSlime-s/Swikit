import type { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { Button, Card, Empty } from 'antd'
import { sdk } from '../../src/client'

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ title: string[] }>
) => {
  const { title } = context.params!
  const joinedTitle = title.join('/')
  const data = await sdk.getPageByTitle({ title: joinedTitle })
  const page = data.pageByTitle

  return {
    props: {
      page,
    },
  }
}
type Props = Awaited<ReturnType<typeof getServerSideProps>>['props']

const Page: NextPage<Props> = ({ page }) => {
  return (
    <div>
      <Head>
        <title>Swikit - {page?.title}</title>
      </Head>

      {page === null || page === undefined ? (
        <Card>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      ) : (
        <Card title={page.title ?? 'undefined'}>
          <article
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: page.bodyHtml ?? '' }}
          />
        </Card>
      )}
      <Button type="primary">Button</Button>
    </div>
  )
}

export default Page
