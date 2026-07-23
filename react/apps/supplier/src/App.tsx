import { Navigate, Route, Routes } from 'react-router-dom'
import { SupplierShell } from './components/SupplierShell'
import { SUPPLIER_ROUTES, getSupplierPage } from './data/pages'
import { LocaleProvider, useSupplierLocale } from './i18n/LocaleContext'
import { SupplierHtmlPage } from './pages/SupplierHtmlPage'

function PageRoute({ slug }: { slug: string }) {
  const { locale } = useSupplierLocale()
  const page = getSupplierPage(slug, locale)
  if (!page?.mainHtml) return <Navigate to="/" replace />
  return <SupplierHtmlPage page={page} />
}

function AppRoutes() {
  return (
    <Routes>
      <Route element={<SupplierShell />}>
        {SUPPLIER_ROUTES.map(({ slug, route }) =>
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
