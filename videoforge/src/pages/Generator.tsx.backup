import { useState } from 'react';
import { useApiKeys } from '../contexts/ApiKeyContext';
import { useNavigate } from 'react-router-dom';

const ASPECT_RATIOS = [
  { id: '9:16', label: 'Vertical', width: 1080, height: 1920, icon: '📱' },
  { id: '16:9', label: 'Horizontal', width: 1920, height: 1080, icon: '🖥️' },
];

const AVATARS = [
  { id: 'angela', name: 'Angela', provider: 'heygen' },
  { id: 'josh', name: 'Josh', provider: 'heygen' },
  { id: 'emily', name: 'Emily', provider: 'heygen' },
  { id: 'michael', name: 'Michael', provider: 'heygen' },
  { id: 'linda', name: 'Linda', provider: 'heygen' },
];

const VOICES = [
  { id: 'alloy', name: 'Alloy', provider: 'elevenlabs' },
  { id: 'echo', name: 'Echo', provider: 'elevenlabs' },
  { id: 'fable', name: 'Fable', provider: 'elevenlabs' },
  { id: 'onyx', name: 'Onyx', provider: 'elevenlabs' },
  { id: 'nova', name: 'Nova', provider: 'elevenlabs' },
];

export default function Generator() {
  const { getKey } = useApiKeys();
  const navigate = useNavigate();
  const [script, setScript] = useState('');
  const [aspect, setAspect] = useState('9:16');
  const [avatar, setAvatar] = useState('');
  const [voice, setVoice] = useState('alloy');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const generate = async () => {
    if (!script.trim()) return alert('Please enter a script');
    if (!avatar) return alert('Please select an avatar');

    const heygenKey = getKey('heygen');
    const elevenKey = getKey('elevenlabs');

    if (!heygenKey && !elevenKey) {
      return navigate('/settings');
    }

    setLoading(true);
    setStatus('Initializing...');

    try {
      // Simulate generation flow with HeyGen API
      if (heygenKey) {
        setStatus('Generating video with HeyGen...');
        // Call HeyGen API with user's key
        const res = await fetch('https://api.heygen.com/v1/video.generate', {
          method: 'POST',
          headers: {
            'X-Api-Key': heygenKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            script: { type: 'text', input: script },
            avatar_id: avatar,
            aspect_ratio: aspect,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          setStatus(`Success! Video ID: ${data.data?.video_id || 'processing'}`);
          // Save to history
          const history = JSON.parse(localStorage.getItem('vf_history') || '[]');
          history.unshift({
            id: data.data?.video_id || Date.now(),
            script: script.substring(0, 100),
            aspect,
            avatar,
            date: new Date().toISOString(),
            status: 'processing',
          });
          localStorage.setItem('vf_history', JSON.stringify(history.slice(0, 20)));
        } else {
          throw new Error('API request failed');
        }
      } else if (elevenKey) {
        // Fallback to ElevenLabs voice generation
        setStatus('Generating voice with ElevenLabs...');
        const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voice, {
          method: 'POST',
          headers: {
            'xi-api-key': elevenKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: script, model_id: 'eleven_multilingual_v2' }),
        });

        if (res.ok) {
          setStatus('Voice generated successfully!');
        } else {
          throw new Error('ElevenLabs API failed');
        }
      }
    } catch (e) {
      setStatus('Error: Check your API key and try again');
    }

    setLoading(false);
    setTimeout(() => setStatus(''), 5000);
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-5 pb-8">
      <div className="text-center pt-4">
        <h1 className="text-2xl font-bold">🎬 AI Video Generator</h1>
        <p className="text-gray-500 text-sm">Create videos with your AI avatars</p>
      </div>

      {/* Script Editor */}
      <div className="space-y-2">
        <label className="font-medium text-sm">Script</label>
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Enter your video script here..."
          className="w-full h-32 p-3 border rounded-xl resize-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <div className="text-xs text-gray-400 text-right">{script.length} characters</div>
      </div>

      {/* Avatar Selection */}
      <div className="space-y-2">
        <label className="font-medium text-sm">Avatar</label>
        <div className="grid grid-cols-3 gap-2">
          {AVATARS.map(a => (
            <button
              key={a.id}
              onClick={() => setAvatar(a.id)}
              className={`p-3 rounded-xl border text-sm transition ${
                avatar === a.id ? 'bg-black text-white' : 'hover:bg-gray-50'
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>
      </div>

      {/* Voice Selection */}
      <div className="space-y-2">
        <label className="font-medium text-sm">Voice (ElevenLabs)</label>
        <div className="grid grid-cols-3 gap-2">
          {VOICES.map(v => (
            <button
              key={v.id}
              onClick={() => setVoice(v.id)}
              className={`p-3 rounded-xl border text-sm transition ${
                voice === v.id ? 'bg-black text-white' : 'hover:bg-gray-50'
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-2">
        <label className="font-medium text-sm">Aspect Ratio</label>
        <div className="flex gap-3">
          {ASPECT_RATIOS.map(r => (
            <button
              key={r.id}
              onClick={() => setAspect(r.id)}
              className={`flex-1 py-3 rounded-xl border text-sm transition ${
                aspect === r.id ? 'bg-black text-white' : 'hover:bg-gray-50'
              }`}
            >
              {r.icon} {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generate}
        disabled={loading || !script || !avatar}
        className="w-full py-4 bg-black text-white rounded-xl font-medium text-base disabled:opacity-50 transition hover:bg-gray-800"
      >
        {loading ? '⏳ Generating...' : '🚀 Generate Video'}
      </button>

      {/* Status */}
      {status && (
        <div className="p-3 bg-gray-100 rounded-xl text-sm text-center">
          {status}
        </div>
      )}

      {/* History Link */}
      <button
        onClick={() => navigate('/history')}
        className="w-full py-3 border rounded-xl text-sm hover:bg-gray-50"
      >
        View History ({localStorage.getItem('vf_history') ? JSON.parse(localStorage.getItem('vf_history') || '[]').length : 0})
      </button>

      <div className="text-center pb-4">
        <p className="text-xs text-gray-400">VideoForge — Your Keys, Your AI</p>
      </div>
    </div>
  );
}