import { Navigate, useParams } from 'react-router-dom'
import { isCaseSlug } from '../i18n/caseLocales'
import { VerifiedHtmlPage } from './VerifiedHtmlPage'

/** /cases/:slug — industry case detail from verified HTML locale JSON. */
export default function CaseDetailPage() {
  const { slug: raw = '' } = useParams()
  const slug = decodeURIComponent(raw)
  if (!isCaseSlug(slug)) {
    return <Navigate to="/industries" replace />
  }
  return (
    <VerifiedHtmlPage
      localeKey={`pages.cases.${slug}`}
      fallbackBodyClasses={['industry-case-page']}
    />
  )
}
