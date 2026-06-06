require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const morgan   = require('morgan');
const { redirect }       = require('./controllers/urlController');
const urlRoutes          = require('./routes/urlRoutes');
const { checkRateLimit } = require('./services/cache');

const app = express();
app.set('trust proxy', 1);
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/shorten', async (req, res, next) => {
  const ok = await checkRateLimit(req.ip);
  if (!ok) return res.status(429).json({ error: 'Too many requests. Try again in a minute.' });
  next();
});

app.use('/api', urlRoutes);
app.get('/:code', redirect);

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server on http://localhost:${process.env.PORT || 5000}`)
);