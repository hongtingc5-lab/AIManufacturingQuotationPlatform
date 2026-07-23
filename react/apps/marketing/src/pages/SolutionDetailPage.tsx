import { Navigate, useParams } from 'react-router-dom'
import { isSolutionDetailSlug } from '../i18n/solutionLocales'
import { VerifiedHtmlPage } from './VerifiedHtmlPage'

/** /solutions/:slug — solution detail from verified HTML locale JSON. */
export default function SolutionDetailPage() {
  const { slug = '' } = useParams()
  if (!isSolutionDetailSlug(slug)) {
    return <Navigate to="/solutions" replace />
  }
  return (
    <VerifiedHtmlPage
      localeKey={`pages.solutions.${slug}`}
      fallbackBodyClasses={['solution-page', 'solution-detail-page']}
    />
  )
}
