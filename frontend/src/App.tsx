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
          <Route path="/slides" element={<div style={{ padding: 32 }}><h1>Slides Coming Soon</h1></div>} />
          <Route path="/sheets" element={<div style={{ padding: 32 }}><h1>Sheets Coming Soon</h1></div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
