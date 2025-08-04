import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

/*   
index.html
        ↓
Get <div id="root"></div>
        ↓
main.tsx => Mount <App /> to root
        ↓
App.tsx Render => Provide Redux store
        ↓
All components can access the Redux store via Provider
*/