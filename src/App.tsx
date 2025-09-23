import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import BusinessDetailPage from './pages/BusinessDetailPage';
import CategoryPage from './pages/CategoryPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="business/:id" element={<BusinessDetailPage />} />
          <Route path="category/:category" element={<CategoryPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
