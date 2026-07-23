import { Navigate, useParams } from 'react-router-dom'
import { isResourceDetailSlug } from '../i18n/resourceLocales'
import { VerifiedHtmlPage } from './VerifiedHtmlPage'

/** /resources/:slug — resource detail from verified HTML locale JSON. */
export default function ResourceDetailPage() {
  const { slug = '' } = useParams()
  if (!isResourceDetailSlug(slug)) {
    return <Navigate to="/resources" replace />
  }
  return (
    <VerifiedHtmlPage
      localeKey={`pages.resources.${slug}`}
      fallbackBodyClasses={['supplement-page']}
    />
  )
}
