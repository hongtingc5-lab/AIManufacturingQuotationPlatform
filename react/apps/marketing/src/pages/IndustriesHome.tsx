import { VerifiedHtmlPage } from './VerifiedHtmlPage'

/** /industries — industry hub from verified HTML. */
export default function IndustriesHome() {
  return (
    <VerifiedHtmlPage localeKey="pages.industries.home" fallbackBodyClasses={['industry-hub-page']} />
  )
}
