import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './apps/Home';
import { DocumentEditor } from './apps/DocumentEditor';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<DocumentEditor />} />
          <Route path="/docs/:id" element={<DocumentEditor />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
