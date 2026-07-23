import { Navigate, Route, Routes } from 'react-router-dom'
import { MesShell } from './components/MesShell'
import { MES_ROUTES, getMesPage } from './data/pages'
import { LocaleProvider, useMesLocale } from './i18n/LocaleContext'
import { MesHtmlPage } from './pages/MesHtmlPage'

function PageRoute({ slug }: { slug: string }) {
  const { locale } = useMesLocale()
  const page = getMesPage(slug, locale)
  if (!page?.mainHtml) return <Navigate to="/" replace />
  return <MesHtmlPage page={page} />
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MesShell />}>
        {MES_ROUTES.map(({ slug, route }) =>
          route === '/' ? (
            <Route key={slug} index element={<PageRoute slug={slug} />} />
          ) : (
            <Route key={slug} path={route.replace(/^\//, '')} element={<PageRoute slug={slug} />} />
          ),
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <LocaleProvider>
      <AppRoutes />
    </LocaleProvider>
  )
}
