const db    = require('../services/db');
const cache = require('../services/cache');
const { encode } = require('../services/base62');
require('dotenv').config();

exports.shorten = async (req, res) => {
  const { originalUrl, customAlias, expiresIn } = req.body;
  if (!originalUrl) return res.status(400).json({ error: 'URL is required' });

  try {
    const existing = await db.query(
      'SELECT short_code FROM urls WHERE original_url = $1 AND is_active = TRUE',
      [originalUrl]
    );
    if (existing.rows.length) {
      const code = existing.rows[0].short_code;
      return res.json({ shortUrl: `${process.env.BASE_URL}/${code}`, shortCode: code });
    }

    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : null;

    const { rows } = await db.query(
      `INSERT INTO urls (original_url, short_code, custom_alias, expires_at)
       VALUES ($1, 'tmp', $2, $3) RETURNING id`,
      [originalUrl, customAlias || null, expiresAt]
    );

    const shortCode = customAlias || encode(rows[0].id);
    await db.query('UPDATE urls SET short_code = $1 WHERE id = $2', [shortCode, rows[0].id]);
    await cache.set(shortCode, originalUrl);

    res.status(201).json({ shortUrl: `${process.env.BASE_URL}/${shortCode}`, shortCode });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Alias already taken' });
    res.status(500).json({ error: 'Server error' });
  }
};

exports.redirect = async (req, res) => {
  const { code } = req.params;

  if (!/^[a-zA-Z0-9]{4,10}$/.test(code)) {
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    let originalUrl = await cache.get(code);

    if (!originalUrl) {
      const { rows } = await db.query(
        'SELECT original_url, expires_at FROM urls WHERE short_code = $1 AND is_active = TRUE',
        [code]
      );
      if (!rows.length) return res.status(404).json({ error: 'Not found' });
      if (rows[0].expires_at && new Date() > rows[0].expires_at)
        return res.status(410).json({ error: 'Link expired' });

      originalUrl = rows[0].original_url;
      await cache.set(code, originalUrl);
    }

    res.redirect(301, originalUrl);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};