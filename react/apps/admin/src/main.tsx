import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { applySystemIdentity } from './system/meta'
import App from './App'
import './styles/admin-workspace.css'

applySystemIdentity()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
