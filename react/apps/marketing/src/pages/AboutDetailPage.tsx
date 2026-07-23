import { Navigate, useParams } from 'react-router-dom'
import { isAboutDetailSlug } from '../i18n/aboutLocales'
import { VerifiedHtmlPage } from './VerifiedHtmlPage'

/** /about/:slug — about detail from verified HTML locale JSON. */
export default function AboutDetailPage() {
  const { slug = '' } = useParams()
  if (!isAboutDetailSlug(slug)) {
    return <Navigate to="/about" replace />
  }
  return (
    <VerifiedHtmlPage
      localeKey={`pages.about.${slug}`}
      fallbackBodyClasses={['about-detail-page']}
    />
  )
}
