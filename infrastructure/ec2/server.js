require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const { limiter } = require('./middleware/rateLimit');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const sleepRoutes = require('./routes/sleep');
const memoryRoutes = require('./routes/memory');
const claudeService = require('./services/claudeService');

const app = express();
const PORT = process.env.PORT ?? 3000;
const VERSION = '1.0.0';

const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(helmet());
app.use(cors({
  origin: allowedOrigins.length > 0
    ? (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error('Not allowed by CORS'));
      }
    : true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('combined', {
  skip: (req) => req.path === '/api/v1/health',
}));
app.use(express.json({ limit: '50kb' }));
app.use(limiter);

app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'ok',
    version: VERSION,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/v1/stats', (req, res) => {
  res.json(claudeService.getStats());
});

const S3_FREE    = 'https://sona-app-audios.s3.us-east-1.amazonaws.com/sons-sleep-app';
const S3_PREMIUM = 'https://sona-app-audios.s3.us-east-1.amazonaws.com';

const SOUND_CATALOG = [
  // nature — free
  { id: 'rain',        isPremium: false, url: `${S3_FREE}/chuva-suave.mp3.mp3` },
  { id: 'forest',      isPremium: false, url: `${S3_FREE}/floresta-noite.mp3.mp3` },
  { id: 'ocean',       isPremium: false, url: `${S3_FREE}/ondas-mar.mp3.mp3` },
  // nature — premium
  { id: 'thunder',     isPremium: true,  url: `${S3_PREMIUM}/trovao.mp3.mp3` },
  { id: 'river',       isPremium: true,  url: `${S3_PREMIUM}/rio-montanha.mp3.mp3` },
  { id: 'tropical',    isPremium: true,  url: `${S3_PREMIUM}/floresta-tropical.mp3.mp3` },
  // white — free
  { id: 'white_noise', isPremium: false, url: `${S3_FREE}/ruido-branco.mp3.mp3` },
  { id: 'wind',        isPremium: false, url: `${S3_FREE}/vento-suave.mp3.mp3` },
  // white — premium
  { id: 'fan',         isPremium: true,  url: `${S3_PREMIUM}/ventilador.mp3.mp3` },
  { id: 'shower',      isPremium: true,  url: `${S3_PREMIUM}/chuveiro.mp3.mp3` },
  // asmr — free
  { id: 'fireplace',   isPremium: false, url: `${S3_FREE}/lareira.mp3.mp3` },
  { id: 'rain_window', isPremium: false, url: `${S3_FREE}/chuva-janela.mp3.mp3` },
  // asmr — premium
  { id: 'whispers',    isPremium: true,  url: `${S3_PREMIUM}/sussurros.mp3.mp3` },
  { id: 'book_pages',  isPremium: true,  url: `${S3_PREMIUM}/paginas-livro.mp3.mp3` },
  { id: 'handwriting', isPremium: true,  url: `${S3_PREMIUM}/escrita-mao.mp3.mp3` },
  { id: 'tapping',     isPremium: true,  url: `${S3_PREMIUM}/tapping.mp3.mp3` },
  // ambient — free
  { id: 'cafe',        isPremium: false, url: `${S3_FREE}/cafe-parisiense.mp3.mp3` },
  { id: 'library',     isPremium: false, url: `${S3_FREE}/biblioteca.mp3.mp3` },
  // ambient — premium
  { id: 'train',       isPremium: true,  url: `${S3_PREMIUM}/trem-noturno.mp3.mp3` },
  { id: 'aquarium',    isPremium: true,  url: `${S3_PREMIUM}/aquario.mp3.mp3` },
  { id: 'spa',         isPremium: true,  url: `${S3_PREMIUM}/spa.mp3.mp3` },
  { id: 'garden',      isPremium: true,  url: `${S3_PREMIUM}/jardim-japones.mp3.mp3` },
  // body — free
  { id: 'heartbeat',   isPremium: false, url: `${S3_FREE}/batimentos.mp3.mp3` },
  // body — premium
  { id: 'breathing',   isPremium: true,  url: `${S3_PREMIUM}/respiracao-guiada.mp3.mp3` },
  { id: 'whale',       isPremium: true,  url: `${S3_PREMIUM}/baleia.mp3.mp3` },
  { id: 'birds_dawn',  isPremium: true,  url: `${S3_PREMIUM}/passaros-manha.mp3.mp3` },
  // special — premium
  { id: 'hz432',       isPremium: true,  url: `${S3_PREMIUM}/432hz.mp3.mp3` },
  { id: 'binaural',    isPremium: true,  url: `${S3_PREMIUM}/binaural-delta.mp3.mp3` },
  { id: 'tibetan',     isPremium: true,  url: `${S3_PREMIUM}/tibetan-bowls.mp3.mp3` },
  { id: 'amazon',      isPremium: true,  url: `${S3_PREMIUM}/passaros-amazonia.mp3.mp3` },
];

app.get('/api/v1/config/sounds', (req, res) => {
  res.json({
    total: SOUND_CATALOG.length,
    free: SOUND_CATALOG.filter(s => !s.isPremium).length,
    premium: SOUND_CATALOG.filter(s => s.isPremium).length,
    sounds: SOUND_CATALOG,
  });
});

app.use('/api/v1/sleep', sleepRoutes);
app.use('/api/v1/memory', memoryRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`[sleep-app-backend] v${VERSION} running on port ${PORT} (${process.env.NODE_ENV})`);
});

module.exports = app;
