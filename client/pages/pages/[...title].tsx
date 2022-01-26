import { EditOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Card, Empty, Input } from 'antd'
import type { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { ChangeEvent, useCallback, useState } from 'react'

import { Page } from '@/generated/graphql'
import { sdk } from '@/src/client'

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

// TODO: Page がコンフリクトしてる (今のところ問題はないけどよくないよね)
const Page: NextPage<Props> = ({ ...props }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [page, setPage] = useState(props.page)
  const startEditing = useCallback(() => {
    setIsEditing(true)
  }, [])
  const handleCancelEditor = useCallback(() => {
    setIsEditing(false)
  }, [])
  const handleSave = useCallback((page: Page) => {
    setPage(page)
    setIsEditing(false)
  }, [])

  return (
    <div>
      <Head>
        <title>Swikit - {page?.title}</title>
      </Head>

      {page === null || page === undefined ? (
        <Card>
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </Card>
      ) : isEditing ? (
        <PageEditor
          id={page?.id ?? -1}
          onCancel={handleCancelEditor}
          onUpdate={handleSave}
          source={page?.source ?? ''}
          title={page?.title ?? ''}
        />
      ) : (
        <Card
          extra={
            <Button
              icon={<EditOutlined />}
              onClick={startEditing}
              type="default"
            >
              編集
            </Button>
          }
          title={page.title ?? 'undefined'}
        >
          <article
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: page.bodyHtml ?? '' }}
          />
        </Card>
      )}
    </div>
  )
}

type PageEditorProps = {
  onCancel: () => void
  onUpdate: (page: Page) => void
  id: number
  title: string
  source: string
}
const PageEditor: React.VFC<PageEditorProps> = ({
  onCancel,
  onUpdate,
  id,
  title,
  source,
}) => {
  const [newTitle, setNewTitle] = useState(title)
  const [newSource, setNewSource] = useState(source)
  const onTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNewTitle(e.target.value)
  }, [])
  const onSourceChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setNewSource(e.target.value)
  }, [])

  const handleClickSave = useCallback(async () => {
    const data = await sdk.updatePage({
      id,
      title: newTitle,
      source: newSource,
    })
    onUpdate(data.updatePage!)
  }, [id, newTitle, newSource, onUpdate])

  return (
    <Card
      extra={
        <div className="ml-4 space-x-2">
          <Button
            icon={<SaveOutlined />}
            onClick={handleClickSave}
            type="primary"
          >
            保存して終了
          </Button>
          <Button onClick={onCancel} type="default">
            終了
          </Button>
        </div>
      }
      title={<Input defaultValue={title} onChange={onTitleChange} />}
    >
      <Input.TextArea
        autoSize={{ minRows: 20 }}
        defaultValue={source}
        onChange={onSourceChange}
      />
    </Card>
  )
}

export default Page
