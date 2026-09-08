
const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } catch (e) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Getting ready</title><style>*{margin:0;box-sizing:border-box}body{min-height:100vh;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at top,#1a0b2e 0%,#0a0a0f 55%) fixed;color:#fff;font-family:system-ui,-apple-system,sans-serif}.b{text-align:center;padding:2rem}.dots{display:flex;gap:10px;justify-content:center;margin-bottom:28px}.dots i{width:12px;height:12px;border-radius:50%;background:#a78bfa;animation:vkb 1.2s ease-in-out infinite}.dots i:nth-child(2){animation-delay:.15s}.dots i:nth-child(3){animation-delay:.3s}@keyframes vkb{0%,60%,100%{transform:translateY(0);opacity:.45}30%{transform:translateY(-10px);opacity:1}}h1{font-size:1.4rem;font-weight:600;letter-spacing:-.02em;margin-bottom:10px}p{color:#9ca3af;font-size:.95rem}</style></head><body><div class="b"><div class="dots"><i></i><i></i><i></i></div><h1>Getting your app ready</h1><p>Your agent is building this page right now. It will appear here on its own.</p></div><script>setTimeout(function(){location.reload()},3000)</script></body></html>');
  }
}).listen(PORT, () => console.log('Placeholder ready on port ' + PORT));
