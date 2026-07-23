import { VerifiedHtmlPage } from './VerifiedHtmlPage'

/** /about — about hub from verified HTML. */
export default function AboutHome() {
  return <VerifiedHtmlPage localeKey="pages.about.home" fallbackBodyClasses={['about-page']} />
}
