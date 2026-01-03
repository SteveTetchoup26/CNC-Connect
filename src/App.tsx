import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from "./components/shared/MainLayout"
import Home from './pages/Home';
import './index.css'

function App() {

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
