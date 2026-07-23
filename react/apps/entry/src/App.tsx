import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { getAuthPage } from './data/authPages'
import type { Locale } from './data/authPages'
import { LangSync } from './i18n/LangSync'
import { pathHasEnPrefix, resolvePreferredLang, withEnPrefix } from './i18n/lang'
import { AuthPage } from './pages/AuthPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { HubPage } from './pages/HubPage'

function useRouteLocale(): Locale {
  const { pathname } = useLocation()
  return pathHasEnPrefix(pathname) ? 'en' : 'zh'
}

function HubRoute() {
  const locale = useRouteLocale()
  return <HubPage key={locale} locale={locale} />
}

function AuthRoute({ pageId }: { pageId: string }) {
  const locale = useRouteLocale()
  const config = getAuthPage(pageId, locale)
  if (!config) return <Navigate to={locale === 'en' ? '/en/login' : '/login'} replace />
  return <AuthPage key={`${pageId}-${locale}`} config={config} locale={locale} />
}

function ForgotRoute() {
  const locale = useRouteLocale()
  return <ForgotPasswordPage key={locale} locale={locale} />
}

/** Default entry (:5175) → customer workspace login. */
function DefaultEntry() {
  const location = useLocation()
  const preferred = resolvePreferredLang(location.pathname, location.search)
  const to = preferred === 'en' ? '/en/login' : '/login'
  return <Navigate to={`${to}${location.search}`} replace />
}

function FallbackRedirect() {
  const location = useLocation()
  const preferred = resolvePreferredLang(location.pathname, location.search)
  return <Navigate to={preferred === 'en' ? withEnPrefix('/login') : '/login'} replace />
}

export default function App() {
  return (
    <LangSync>
      <Routes>
        {/* Default: customer workspace login. Multi-system Hub kept at /hub for later linking. */}
        <Route path="/en" element={<DefaultEntry />} />
        <Route path="/en/hub" element={<HubRoute />} />
        <Route path="/en/login" element={<AuthRoute pageId="customer-login" />} />
        <Route path="/en/register" element={<AuthRoute pageId="customer-register" />} />
        <Route path="/en/forgot-password" element={<ForgotRoute />} />
        <Route path="/en/admin/login" element={<AuthRoute pageId="admin-login" />} />
        <Route path="/en/admin/register" element={<AuthRoute pageId="admin-register" />} />
        <Route path="/en/mes/login" element={<AuthRoute pageId="mes-login" />} />
        <Route path="/en/mes/register" element={<AuthRoute pageId="mes-register" />} />
        <Route path="/en/supplier/login" element={<AuthRoute pageId="supplier-login" />} />
        <Route path="/en/supplier/register" element={<AuthRoute pageId="supplier-register" />} />

        <Route path="/" element={<DefaultEntry />} />
        <Route path="/hub" element={<HubRoute />} />
        <Route path="/login" element={<AuthRoute pageId="customer-login" />} />
        <Route path="/register" element={<AuthRoute pageId="customer-register" />} />
        <Route path="/forgot-password" element={<ForgotRoute />} />
        <Route path="/admin/login" element={<AuthRoute pageId="admin-login" />} />
        <Route path="/admin/register" element={<AuthRoute pageId="admin-register" />} />
        <Route path="/mes/login" element={<AuthRoute pageId="mes-login" />} />
        <Route path="/mes/register" element={<AuthRoute pageId="mes-register" />} />
        <Route path="/supplier/login" element={<AuthRoute pageId="supplier-login" />} />
        <Route path="/supplier/register" element={<AuthRoute pageId="supplier-register" />} />

        <Route path="*" element={<FallbackRedirect />} />
      </Routes>
    </LangSync>
  )
}
