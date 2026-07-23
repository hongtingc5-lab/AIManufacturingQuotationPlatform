import { VerifiedHtmlPage } from './VerifiedHtmlPage'

/** /resources/news — news hub from verified HTML. */
export default function ResourcesNewsHome() {
  return (
    <VerifiedHtmlPage
      localeKey="pages.news.home"
      fallbackBodyClasses={['resource-page', 'news-hub-page']}
    />
  )
}
