import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { LocaleProvider } from './i18n/LocaleContext'
import SiteLayout from './components/layout/SiteLayout'
import Home from './pages/Home'
import CapabilitiesHome from './pages/CapabilitiesHome'
import CapabilitiesHub from './pages/CapabilitiesHub'
import CapabilitiesServiceHub from './pages/CapabilitiesServiceHub'
import CapabilitiesMaterialHub from './pages/CapabilitiesMaterialHub'
import CapabilitiesFinishHub from './pages/CapabilitiesFinishHub'
import CapabilityDetailPage from './pages/CapabilityDetailPage'
import SolutionsHome from './pages/SolutionsHome'
import SolutionDetailPage from './pages/SolutionDetailPage'
import IndustriesHome from './pages/IndustriesHome'
import IndustryDetailPage from './pages/IndustryDetailPage'
import CaseDetailPage from './pages/CaseDetailPage'
import ResourcesHome from './pages/ResourcesHome'
import ResourceDetailPage from './pages/ResourceDetailPage'
import ResourcesNewsHome from './pages/ResourcesNewsHome'
import ResourcesNewsDetailPage from './pages/ResourcesNewsDetailPage'
import AboutHome from './pages/AboutHome'
import AboutDetailPage from './pages/AboutDetailPage'
import QuoteGuestPage from './pages/QuoteGuestPage'

function NotFoundPage() {
  return (
    <div className="container" style={{ padding: '120px 24px' }}>
      <h1>页面不存在</h1>
      <p>该地址没有对应的营销页。</p>
      <Link to="/">返回首页</Link>
    </div>
  )
}

/** Single route tree — language via i18n, not /en/* mirrors. */
function App() {
  return (
    <BrowserRouter>
      <LocaleProvider>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="capabilities" element={<CapabilitiesHome />} />
            <Route path="capabilities/process" element={<CapabilitiesHub />} />
            <Route path="capabilities/service" element={<CapabilitiesServiceHub />} />
            <Route path="capabilities/material" element={<CapabilitiesMaterialHub />} />
            <Route path="capabilities/finish" element={<CapabilitiesFinishHub />} />
            <Route path="capabilities/:category/:slug" element={<CapabilityDetailPage />} />
            <Route path="solutions" element={<SolutionsHome />} />
            <Route path="solutions/:slug" element={<SolutionDetailPage />} />
            <Route path="industries" element={<IndustriesHome />} />
            <Route path="industries/:slug" element={<IndustryDetailPage />} />
            <Route path="cases/:slug" element={<CaseDetailPage />} />
            <Route path="resources" element={<ResourcesHome />} />
            <Route path="resources/news" element={<ResourcesNewsHome />} />
            <Route path="resources/news/:slug" element={<ResourcesNewsDetailPage />} />
            <Route path="resources/:slug" element={<ResourceDetailPage />} />
            <Route path="about" element={<AboutHome />} />
            <Route path="about/:slug" element={<AboutDetailPage />} />
            <Route path="quote" element={<QuoteGuestPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </LocaleProvider>
    </BrowserRouter>
  )
}

export default App
