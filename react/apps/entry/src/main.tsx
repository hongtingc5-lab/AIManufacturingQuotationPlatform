import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { applySystemIdentity } from './system/meta'
import App from './App'
import './styles/auth.css'
import './styles/hub.css'

applySystemIdentity()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
