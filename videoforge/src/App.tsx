import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ApiKeyProvider } from './contexts/ApiKeyContext';
import Generator from './pages/Generator';
import Settings from './pages/Settings';
import History from './pages/History';

export default function App() {
  return (
    <ApiKeyProvider>
      <BrowserRouter>
        <nav className="flex justify-center gap-6 py-4 border-b sticky top-0 bg-white z-10">
          <Link to="/" className="font-medium text-sm">🎬 Generate</Link>
          <Link to="/history" className="font-medium text-sm">🎥 History</Link>
          <Link to="/settings" className="font-medium text-sm">🔑 API Keys</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Generator />} />
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </ApiKeyProvider>
  );
}