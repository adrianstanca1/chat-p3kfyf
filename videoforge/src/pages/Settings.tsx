import { useState } from 'react';
import { useApiKeys, type ApiKeys } from '../contexts/ApiKeyContext';

const SERVICES = [
  { id: 'heygen', name: 'HeyGen API', url: 'https://heygen.com/api-keys', desc: 'For AI avatars and video generation' },
  { id: 'elevenlabs', name: 'ElevenLabs (Voice)', url: 'https://elevenlabs.io/api-keys', desc: 'For AI voice synthesis' },
  { id: 'openai', name: 'OpenAI (GPT-4o)', url: 'https://platform.openai.com/api-keys', desc: 'For script generation and AI' },
  { id: 'did', name: 'D-ID (Avatars)', url: 'https://studio.d-id.com/api-keys', desc: 'Alternative avatar provider' },
  { id: 'runway', name: 'Runway Gen-2', url: 'https://runwayml.com/api-keys', desc: 'For AI video generation' },
];

export default function Settings() {
  const { keys, setKey, clearAll } = useApiKeys();
  const [show, setShow] = useState<Record<string, boolean>>({});
  const [tested, setTested] = useState<Record<string, boolean>>({});

  const testKey = async (svc: string) => {
    const key = keys[svc as keyof ApiKeys] || '';
    if (!key) return;
    try {
      // Basic validation: check if key looks valid
      if (key.length < 10) throw new Error('Key too short');
      setTested(p => ({ ...p, [svc]: true }));
      setTimeout(() => setTested(p => ({ ...p, [svc]: false })), 3000);
    } catch {
      setTested(p => ({ ...p, [svc]: false }));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-6">
      <div className="text-center pt-4">
        <h1 className="text-2xl font-bold">🔑 Your API Keys</h1>
        <p className="text-gray-500 text-sm mt-2">
          Keys stored encrypted on your device only. Never sent to our servers.
        </p>
      </div>

      {SERVICES.map(svc => (
        <div key={svc.id} className="bg-white rounded-xl border p-4 space-y-3 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <label className="font-medium text-sm">{svc.name}</label>
              <p className="text-xs text-gray-500 mt-1">{svc.desc}</p>
            </div>
            <a href={svc.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 whitespace-nowrap">
              Get key →
            </a>
          </div>
          <div className="flex gap-2">
            <input
              type={show[svc.id] ? 'text' : 'password'}
              value={keys[svc.id as keyof ApiKeys] || ''}
              onChange={(e) => setKey(svc.id as keyof ApiKeys, e.target.value)}
              placeholder="Paste your API key..."
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <button
              onClick={() => setShow(p => ({ ...p, [svc.id]: !p[svc.id] }))}
              className="px-3 border rounded-lg text-sm hover:bg-gray-50"
            >
              {show[svc.id] ? '🙈' : '👁️'}
            </button>
            <button
              onClick={() => testKey(svc.id)}
              className="px-3 border rounded-lg text-sm hover:bg-gray-50"
            >
              {tested[svc.id] ? '✓' : 'Test'}
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={clearAll}
        className="w-full py-3 text-red-500 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-50"
      >
        Clear All Keys
      </button>

      <div className="text-center pb-8">
        <p className="text-xs text-gray-400">VideoForge — Your Keys, Your AI</p>
      </div>
    </div>
  );
}