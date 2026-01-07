import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from "./components/shared/MainLayout"
import Home from './pages/Home';
import './index.css'
import EntranceExamDetails from './pages/EntranceExamDetails';

function App() {

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/concours/:id" element={<EntranceExamDetails />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
