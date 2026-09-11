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

const TEMPLATES = [
  { id: 'youtube-shorts', name: 'YouTube Shorts', desc: 'Vertical videos for Shorts', icon: '▶️' },
  { id: 'tiktok', name: 'TikTok', desc: 'Vertical viral content', icon: '🎵' },
  { id: 'reels', name: 'Instagram Reels', desc: 'Engaging Reels content', icon: '📸' },
  { id: 'youtube-long', name: 'YouTube Long', desc: 'Full YouTube videos', icon: '📺' },
  { id: 'training', name: 'Training', desc: 'Tutorials and courses', icon: '🎓' },
  { id: 'ads', name: 'Ads', desc: 'Promotional videos', icon: '📢' },
];

const SCRIPT_TEMPLATES = [
  'Create a tutorial about [topic]',
  'Tell a story about [character] in [setting]',
  'Explain the benefits of [product/service]',
  'Share tips on [subject]',
  'Demonstrate how to use [tool]',
  'Share your experience with [topic]',
];

export default function Generator() {
  const { getKey } = useApiKeys();
  const navigate = useNavigate();
  const [script, setScript] = useState('');
  const [aspect, setAspect] = useState('9:16');
  const [avatar, setAvatar] = useState('');
  const [voice, setVoice] = useState('alloy');
  const [template, setTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showScriptTemplates, setShowScriptTemplates] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');

  // AI Script generation using DeepSeek or OpenRouter (free models)
  const generateScript = async (topic: string) => {
    setAiLoading(true);
    setError('');
    try {
      const openrouterKey = getKey('openrouter');
      const deepseekKey = getKey('deepseek');
      const moonshotKey = getKey('moonshot');

      let response = null;
      let usedKey = '';

      // Try OpenRouter first (free tier with many models)
      if (openrouterKey) {
        usedKey = openrouterKey;
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${usedKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://videoforge.app',
            'X-Title': 'VideoForge Script Generator'
          },
          body: JSON.stringify({
            model: 'deepseek/deepseek-r1:free',
            messages: [
              { role: 'system', content: 'You are a helpful script writer for AI video generation. Create engaging, short video scripts.' },
              { role: 'user', content: `Write a short video script about: ${topic}. Keep it under 200 words.` }
            ],
            max_tokens: 500,
            temperature: 0.7
          })
        });
      }
      // Fallback to DeepSeek
      else if (deepseekKey) {
        usedKey = deepseekKey;
        response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${usedKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              { role: 'system', content: 'You are a helpful script writer for AI video generation. Create engaging, short video scripts.' },
              { role: 'user', content: `Write a short video script about: ${topic}. Keep it under 200 words.` }
            ],
            max_tokens: 500,
            temperature: 0.7
          })
        });
      }
      // Fallback to Moonshot
      else if (moonshotKey) {
        usedKey = moonshotKey;
        response = await fetch('https://api.moonshot.cn/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${usedKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'moonshot-v1-8k',
            messages: [
              { role: 'system', content: 'You are a helpful script writer for AI video generation. Create engaging, short video scripts.' },
              { role: 'user', content: `Write a short video script about: ${topic}. Keep it under 200 words.` }
            ],
            max_tokens: 500,
            temperature: 0.7
          })
        });
      }

      if (response && response.ok) {
        const data = await response.json();
        const generatedScript = data.choices[0]?.message?.content || '';
        setAiResult(generatedScript);
        setScript(generatedScript);
        setStatus('✅ Script generated!');
        setTimeout(() => setStatus(''), 3000);
      } else {
        throw new Error('AI script generation failed');
      }
    } catch (err) {
      setError('Script generation failed — check your API keys in Settings');
    }
    setAiLoading(false);
  };

  const generate = async () => {
    setError('');
    setVideoUrl('');

    if (!script.trim()) { setError('Please enter a script'); return; }
    if (!avatar) { setError('Please select an avatar'); return; }

    const heygenKey = getKey('heygen');
    const elevenKey = getKey('elevenlabs');

    if (!heygenKey && !elevenKey) {
      navigate('/settings');
      return;
    }

    setLoading(true);
    setStatus('Initializing video generation...');

    try {
      if (heygenKey) {
        setStatus('Generating video with HeyGen...');
        const res = await fetch('https://api.heygen.com/v1/video.generate', {
          method: 'POST',
          headers: { 'X-Api-Key': heygenKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            script: { type: 'text', input: script },
            avatar_id: avatar,
            aspect_ratio: aspect,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const videoId = data.data?.video_id || Date.now();
          setStatus('✅ Video generated successfully!');

          const history = JSON.parse(localStorage.getItem('vf_history') || '[]');
          history.unshift({
            id: videoId,
            script: script.substring(0, 100),
            aspect,
            avatar,
            date: new Date().toISOString(),
            status: 'complete',
            thumbnail: `https://api.heygen.com/v1/video/${videoId}/thumbnail`,
          });
          localStorage.setItem('vf_history', JSON.stringify(history.slice(0, 20)));
          setVideoUrl(`https://api.heygen.com/v1/video/${videoId}/play`);
        } else {
          throw new Error('API request failed');
        }
      } else if (elevenKey) {
        setStatus('Generating voice with ElevenLabs...');
        const res = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voice, {
          method: 'POST',
          headers: { 'xi-api-key': elevenKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: script, model_id: 'eleven_multilingual_v2' }),
        });

        if (res.ok) {
          setStatus('✅ Voice generated!');
        } else {
          throw new Error('ElevenLabs API failed');
        }
      }
    } catch (e) {
      setError('Generation failed — check your API key and try again');
      setStatus('');
    }

    setLoading(false);
    setTimeout(() => setStatus(''), 5000);
  };

  const applyScriptTemplate = (tpl: string) => {
    setScript(tpl);
    setShowScriptTemplates(false);
  };

  return (
    <div className="max-w-lg mx-auto p-4 space-y-5 pb-8">
      <div className="text-center pt-4">
        <h1 className="text-2xl font-bold">🎬 AI Video Generator</h1>
        <p className="text-gray-500 text-sm">Create videos with your AI avatars</p>
      </div>

      {/* AI Script Generation */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="font-medium text-sm">Script (AI-powered)</label>
          <div className="flex gap-2">
            <button
              onClick={() => setShowScriptTemplates(!showScriptTemplates)}
              className="text-xs text-blue-600 hover:underline"
            >
              Templates
            </button>
            <button
              onClick={() => {
                const topic = prompt('Enter a topic for the video script:');
                if (topic) generateScript(topic);
              }}
              disabled={aiLoading}
              className="text-xs text-green-600 hover:underline disabled:opacity-50"
            >
              {aiLoading ? 'Generating...' : '✨ AI Script'}
            </button>
          </div>
        </div>
        {showScriptTemplates && (
          <div className="space-y-2 mb-2">
            {SCRIPT_TEMPLATES.map(t => (
              <button
                key={t}
                onClick={() => applyScriptTemplate(t)}
                className="block w-full text-left px-3 py-2 border rounded-lg text-sm hover:bg-gray-50"
              >
                {t}
              </button>
            ))}
          </div>
        )}
        {aiResult && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
            <span className="font-medium text-green-700">AI Generated:</span>
            <button
              onClick={() => { setScript(aiResult); setAiResult(''); }}
              className="ml-2 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
            >
              Use This
            </button>
          </div>
        )}
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder="Enter your video script here... (or use AI to generate)"
          className="w-full h-32 p-3 border rounded-xl resize-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <div className="text-xs text-gray-400 text-right">{script.length} characters</div>
      </div>

      {/* Template Selection */}
      <button
        onClick={() => setShowTemplates(!showTemplates)}
        className="w-full py-2 border rounded-xl text-sm hover:bg-gray-50"
      >
        {template ? `📁 Template: ${template}` : '📁 Choose a template'}
      </button>
      {showTemplates && (
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => { setTemplate(t.name); setShowTemplates(false); }}
              className="p-3 border rounded-xl text-sm text-left hover:bg-gray-50"
            >
              <span>{t.icon}</span>
              <span className="block font-medium">{t.name}</span>
              <span className="text-xs text-gray-500">{t.desc}</span>
            </button>
          ))}
        </div>
      )}

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
              <span className="text-2xl block mb-1">{a.id === 'angela' ? '👩' : a.id === 'josh' ? '👨' : a.id === 'emily' ? '👩' : a.id === 'michael' ? '👨' : '👩'}</span>
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

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
          {error}
        </div>
      )}

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

      {/* Video Preview */}
      {videoUrl && (
        <div className="space-y-3">
          <div className="aspect-video bg-black rounded-xl flex items-center justify-center">
            <video src={videoUrl} controls className="w-full h-full rounded-xl" />
          </div>
          <a
            href={videoUrl}
            download="video.mp4"
            className="block w-full py-3 bg-black text-white rounded-xl text-center text-sm font-medium hover:bg-gray-800 transition"
          >
            ⬇ Download Video
          </a>
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