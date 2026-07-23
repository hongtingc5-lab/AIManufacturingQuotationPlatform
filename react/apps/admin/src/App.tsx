import { Navigate, Route, Routes } from 'react-router-dom'
import { AdminShell } from './components/AdminShell'
import { ADMIN_ROUTES, getAdminPage } from './data/pages'
import { LocaleProvider, useAdminLocale } from './i18n/LocaleContext'
import { AdminHtmlPage } from './pages/AdminHtmlPage'

function PageRoute({ slug }: { slug: string }) {
  const { locale } = useAdminLocale()
  const page = getAdminPage(slug, locale)
  if (!page?.mainHtml) return <Navigate to="/" replace />
  return <AdminHtmlPage page={page} />
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AdminShell />}>
        {ADMIN_ROUTES.map(({ slug, route }) =>
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
