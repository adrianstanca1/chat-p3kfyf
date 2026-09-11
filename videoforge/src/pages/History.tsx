import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HistoryItem {
  id: string | number;
  script: string;
  aspect: string;
  avatar: string;
  date: string;
  status: string;
}

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('vf_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('vf_history');
    setHistory([]);
  };

  return (
    <div className="max-w-lg mx-auto p-4 pb-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🎥 History</h1>
        <button
          onClick={clearHistory}
          className="px-3 py-1 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50"
        >
          Clear
        </button>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No videos generated yet</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 py-2 px-4 bg-black text-white rounded-lg text-sm"
          >
            Generate your first video
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map(item => (
            <div key={item.id} className="bg-white rounded-xl border p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm line-clamp-1">{item.script || 'No script'}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(item.date).toLocaleString()}
                  </p>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{item.status}</span>
              </div>
              <div className="mt-3 flex gap-2 text-xs text-gray-500">
                <span>👤 {item.avatar}</span>
                <span>{item.aspect}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => navigate('/')}
        className="w-full mt-6 py-3 border rounded-xl text-sm hover:bg-gray-50"
      >
        ← Back to Generator
      </button>
    </div>
  );
}