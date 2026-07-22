import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LocaleProvider } from './i18n/LocaleContext'
import SiteLayout from './components/layout/SiteLayout'
import Home from './pages/Home'
import CapabilitiesHome from './pages/CapabilitiesHome'
import CapabilitiesHub from './pages/CapabilitiesHub'
import CapabilitiesServiceHub from './pages/CapabilitiesServiceHub'
import CapabilitiesMaterialHub from './pages/CapabilitiesMaterialHub'
import CapabilitiesFinishHub from './pages/CapabilitiesFinishHub'
import CapabilityDetailPage from './pages/CapabilityDetailPage'
import StaticMarketingPage from './pages/StaticMarketingPage'
import routeAssetMap from './data/routeAssetMap.json'

/** Single route tree — language via i18n, not /en/* mirrors. */
const REACT_CAPABILITY_PREFIX = '/capabilities'
const staticRoutes = Object.keys(routeAssetMap).filter(
  (path) => !path.startsWith(REACT_CAPABILITY_PREFIX),
)

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
            {staticRoutes.map((path) => (
              <Route
                key={path}
                path={path.replace(/^\//, '')}
                element={<StaticMarketingPage />}
              />
            ))}
            <Route path="*" element={<StaticMarketingPage />} />
          </Route>
        </Routes>
      </LocaleProvider>
    </BrowserRouter>
  )
}

export default App
