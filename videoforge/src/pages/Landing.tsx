import { useNavigate } from 'react-router-dom';

export const logoSvg = `
<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366F1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8B5CF6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="4" y="4" width="16" height="16" rx="3" fill="url(#grad1)"/>
  <path d="M12 6L12 12M8 10L12 14L16 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl space-y-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center">
              {/* Logo */}
              <div dangerouslySetInnerHTML={{ __html: logoSvg }} />
            </div>
            <div className="text-3xl font-bold text-white">VideoForge</div>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Create AI Videos<br />
            <span className="block text-3xl font-bold from-purple-400 to-indigo-400 bg-clip-text text-transparent bg-gradient-to-r">
              With Your Own API Keys
            </span>
          </h1>
          <p className="max-w-xl text-center text-gray-300 lg:w-3/4">
            Generate professional AI videos using your own API keys from HeyGen, ElevenLabs, and more.
            No middleman, no extra costs – just you and the AI providers.
          </p>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-4">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/');
                  }}
                  className="flex items-center justify-center px-5 py-3 border border-transparent text-sm font-medium rounded-md shadow-sm bg-black text-white hover:bg-gray-800"
                >
                  Get Started →
                </a>
                <a
                  href="/settings"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/settings');
                  }}
                  className="flex items-center justify-center px-5 py-3 border border-gray-600 border-transparent text-sm font-md rounded-md text-gray-100 hover:border-gray-400 hover:bg-black/50"
                >
                  Settings
                </a>
              </div>
            </div>
            <div className="grid gap-4 pt-2 md:grid-cols-3">
              <div className="flex items-center text-sm text-gray-400">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 0l-4 4a1 1 0 001.414 1.414L8 10.414V17a1 1 0 002 0V10.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-white">Your Keys Only</p>
                  <p className="text-xs text-gray-400">API keys never leave your device</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 3a4 4 0 014-4h6a4 4 0 014 4v2a2 2 0 00-2 2H5a2 2 0 00-2-2V3zm0 6a2 2 0 100-4 2 2 0 000 4zm4-6a2 2 0 110 4 2 2 0 000-4z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-white">No Server Storage</p>
                  <p className="text-xs text-gray-400">Everything runs in your browser</p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 5a1 1 0 000 2h2a1 1 0 100-2H9zm4 0a1 1 0 000 2h2a1 1 0 100-2h-2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium text-white">Multiple Providers</p>
                  <p className="text-xs text-gray-400">HeyGen, ElevenLabs, D-ID, Runway & more</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}