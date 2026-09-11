import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ApiKeyProvider } from './contexts/ApiKeyContext';
import Generator from './pages/Generator';
import Settings from './pages/Settings';
import History from './pages/History';
import Landing from './pages/Landing';

function ScrollToTop() {
  return null;
}

function AppContent() {
  const location = useLocation();
  const showNav = location.pathname !== '/';

  return (
    <>
      <ScrollToTop />
      {showNav && (
        <nav className="flex justify-center gap-6 py-4 border-b sticky top-0 bg-white z-10">
          <a href="/" className="font-medium text-sm">Home</a>
          <a href="/" className="font-medium text-sm">🎬 Generate</a>
          <a href="/history" className="font-medium text-sm">🎥 History</a>
          <a href="/settings" className="font-medium text-sm">🔑 API Keys</a>
        </nav>
      )}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/generate" element={<Generator />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ApiKeyProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ApiKeyProvider>
  );
}