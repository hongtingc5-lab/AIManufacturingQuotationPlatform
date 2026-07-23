import { Navigate, useParams } from 'react-router-dom'
import { isNewsSlug } from '../i18n/newsLocales'
import { VerifiedHtmlPage } from './VerifiedHtmlPage'

/** /resources/news/:slug — news article from verified HTML locale JSON. */
export default function ResourcesNewsDetailPage() {
  const { slug = '' } = useParams()
  if (!isNewsSlug(slug)) {
    return <Navigate to="/resources/news" replace />
  }
  return (
    <VerifiedHtmlPage
      localeKey={`pages.news.${slug}`}
      fallbackBodyClasses={['resource-page', 'news-detail-page']}
    />
  )
}
