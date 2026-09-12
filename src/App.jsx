import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import ScrollToTop from './components/ScrollToTop';
import AmbientGlow from './components/site/AmbientGlow';
// Add page imports here
import Home from '@/pages/Home';
import About from '@/pages/About';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AmbientGlow />
      <Routes>
        {/* Add your page Route elements here */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App
