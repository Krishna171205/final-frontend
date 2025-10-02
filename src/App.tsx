import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './router'
import { Analytics } from "@vercel/analytics/react"


function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Analytics/>
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App