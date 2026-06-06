import { useState } from 'react';
import { shortenUrl } from '../api';

export default function ShortenForm({ onResult }) {
  const [url,     setUrl]     = useState('');
  const [alias,   setAlias]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await shortenUrl(url, alias || undefined);
      onResult(data);
      setUrl('');
      setAlias('');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="shorten-form">
      <input
        type="url"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="Paste a long URL..."
        required
      />
      <input
        type="text"
        value={alias}
        onChange={e => setAlias(e.target.value)}
        placeholder="Custom alias (optional)"
        pattern="[a-zA-Z0-9-]+"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Shortening...' : 'Shorten →'}
      </button>
    </form>
  );
}