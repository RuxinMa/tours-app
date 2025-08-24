// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)

/*   index.html
        ↓
Get <div id="root"></div>
        ↓
main.tsx => Mount <App /> to root
        ↓
App.tsx Render => Provide Redux store
        ↓
All components can access the Redux store via Provider
*/