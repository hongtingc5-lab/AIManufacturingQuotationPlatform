import { Navigate, useParams } from 'react-router-dom'
import { isIndustryDetailSlug } from '../i18n/industryLocales'
import { VerifiedHtmlPage } from './VerifiedHtmlPage'

/** /industries/:slug — industry detail from verified HTML locale JSON. */
export default function IndustryDetailPage() {
  const { slug = '' } = useParams()
  if (!isIndustryDetailSlug(slug)) {
    return <Navigate to="/industries" replace />
  }
  return (
    <VerifiedHtmlPage
      localeKey={`pages.industries.${slug}`}
      fallbackBodyClasses={['industry-detail-page', 'supplement-page']}
    />
  )
}
