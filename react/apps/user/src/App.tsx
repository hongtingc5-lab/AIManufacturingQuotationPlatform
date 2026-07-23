import { Navigate, Route, Routes } from 'react-router-dom'
import { UserShell } from './components/UserShell'
import { USER_ROUTES, getUserPage } from './data/pages'
import { LocaleProvider, useUserLocale } from './i18n/LocaleContext'
import { UserHtmlPage } from './pages/UserHtmlPage'

function PageRoute({ slug }: { slug: string }) {
  const { locale } = useUserLocale()
  const page = getUserPage(slug, locale)
  if (!page?.mainHtml) return <Navigate to="/" replace />
  return <UserHtmlPage page={page} />
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<UserShell />}>
        {USER_ROUTES.map(({ slug, route }) =>
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
