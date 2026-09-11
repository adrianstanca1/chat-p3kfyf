const express = require('express');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3003;

// Runtime AI configuration - available in deployed app
const VIBEKIT_AI_TOKEN = process.env.VIBEKIT_AI_TOKEN;
const VIBEKIT_AI_URL = process.env.VIBEKIT_AI_URL;
const AI_AVAILABLE = !!(VIBEKIT_AI_TOKEN && VIBEKIT_AI_URL);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '..', 'public')));

// Store generated assets in memory (use database in production)
const assets = {
  videos: {},
  music: {},
  images: {},
  ideas: {}
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    app: 'YouTube Creator Agent',
    aiAvailable: AI_AVAILABLE
  });
};

// Check API status
app.get('/api/status', (req, res) => {
  res.json({ 
    aiAvailable: AI_AVAILABLE,
    vibeKitApiAvailable: false,  // VibeKit agent API not available in deployed env
    message: AI_AVAILABLE 
      ? 'Runtime AI (Claude/ChatGPT) is available'
      : 'No AI configured. Media generation features will not work in deployed environment. Use Idea Generator instead.'
  });
});

// Generate a video plan using Runtime AI
app.post('/api/generate-plan', async (req, res) => {
  const { concept } = req.body;

  if (!concept) {
    return res.status(400).json({ error: 'Concept is required' });
  }

  try {
    if (!AI_AVAILABLE) {
      // Fallback plan without AI
      const planId = crypto.randomUUID();
      const basicPlan = `YouTube Video Plan: "${concept}"

Title: ${concept}
Description: A engaging video about ${concept} that provides value to viewers.

Outline:
1. Hook (0:00-0:30) - Grab attention with a compelling question or statement
2. Introduction (0:30-1:00) - Briefly introduce the topic and what viewers will learn
3. Main Content (1:00-4:00) - Detailed coverage of ${concept} with examples and visuals
4. Conclusion (4:00-4:30) - Summary and call to action
5. End Screen (4:30-5:00) - Subscribe button and related video suggestions

Thumbnail Idea: Bold text with vibrant background showing key elements of ${concept}
Music Style: Upbeat and engaging background music that matches the content tone
Tags: ${concept.split(' ').map(tag => `#${tag}`).join(', ')}, tutorial, how-to, guide`;

      assets.ideas[planId] = {
        concept,
        plan: basicPlan,
        status: 'complete',
        createdAt: new Date().toISOString()
      };

      res.json({ success: true, planId, plan: basicPlan });
      return;
    }

    // Use Runtime AI to generate detailed video plan
    const response = await fetch(VIBEKIT_AI_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VIBEKIT_AI_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `Create a detailed YouTube video production plan for: "${concept}". Include:
1. A compelling title and description
2. A thumbnail concept
3. Script outline with timestamps
4. Background music style recommendation
5. Visual style and shot list
6. Suggested tags and category`
        }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'AI request failed');
    }

    const planId = crypto.randomUUID();
    assets.ideas[planId] = {
      concept,
      plan: data.text || JSON.stringify(data),
      status: 'complete',
      createdAt: new Date().toISOString()
    };

    res.json({ success: true, planId, plan: data.text });
  } catch (error) {
    console.error('Plan generation error:', error);
    // Fallback to basic plan on error
    const planId = crypto.randomUUID();
    const basicPlan = `YouTube Video Plan: "${req.body.concept || 'Untitled'}"

See fallback above. AI was unavailable. Try again later.`;

    assets.ideas[planId] = {
      concept: req.body.concept,
      plan: basicPlan,
      status: 'complete',
      createdAt: new Date().toISOString()
    };

    res.json({ success: true, planId, plan: basicPlan, fallback: true });
  }
});

// Generate a video clip - note media generation requires agent interaction
// In deployed env, this provides instructions rather than calling APIs directly
app.post('/api/generate-video', (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // In deployed environment, media generation works through the agent (me)
  // The frontend should use the agent's capabilities or the VibeKit interface
  res.status(200).json({
    success: false,
    message: 'Video clip generation requires the VibeKit agent API or connected media generation. In this deployed environment, use the app interface or request agent assistance for clip generation.',
    prompt,
    instruction: 'Use /api/generate-plan for plan generation, or contact the agent for media clip generation'
  });
});

// Generate music - similar guidance
app.post('/api/generate-music', (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  res.status(200).json({
    success: false,
    message: 'Music generation requires the VibeKit agent API or connected media generation service. Use the app interface for music creation.'
  });
});

// Generate thumbnail - similar guidance
app.post('/api/generate-image', (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  res.status(200).json({
    success: false,
    message: 'Thumbnail/image generation requires the VibeKit agent API or connected media generation service. Use the app interface for image creation.'
  });
});

// Assemble video from script
app.post('/api/assemble-video', (req, res) => {
  const { script } = req.body;

  if (!script) {
    return res.status(400).json({ error: 'Script is required' });
  }

  res.status(200).json({
    success: false,
    message: 'Video assembly requires the VibeKit agent API for clip generation and stitching. Use the app interface to generate and assemble video clips.'
  });
});

// YouTube upload endpoint
app.post('/api/upload-to-youtube', (req, res) => {
  res.status(200).json({
    error: 'YouTube upload not implemented',
    message: 'To upload to YouTube, please connect your YouTube account in the app\\'s Connections section. This feature requires VibeKit YouTube integration.'
  });
});

// Get all assets
app.get('/api/assets', (req, res) => {
  res.json({
    videos: assets.videos,
    music: assets.music,
    images: assets.images,
    ideas: assets.ideas
  });
});

// Get idea by ID
app.get('/api/ideas/:id', (req, res) => {
  const { id } = req.params;
  const idea = assets.ideas[id];

  if (!idea) {
    return res.status(404).json({ error: 'Idea not found' });
  }

  res.json(idea);
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle 404
app.use((req, res) => {
  res.status(404).send('<h1>404 - Not Found</h1><p>The requested resource could not be found.</p>');
});

app.listen(PORT, () => {
  console.log(`YouTube Creator Agent running on port ${PORT}`);
  console.log(`Runtime AI Available: ${AI_AVAILABLE}`);
  console.log(`VIBEKIT_AI_URL: ${VIBEKIT_AI_URL ? 'set' : 'not set'}`);
  console.log(`VIBEKIT_AI_TOKEN: ${VIBEKIT_AI_TOKEN ? 'set (masked)' : 'not set'}`);
  console.log(`VibeKit Agent API: NOT available in deployed env - use app interface or agent assistance`);
});