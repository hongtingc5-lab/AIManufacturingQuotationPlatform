import ReactDOM from 'react-dom/client'
import { applySystemIdentity } from './system/meta'
import './i18n'
import App from './App'

applySystemIdentity()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />,
)
