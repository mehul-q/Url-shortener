import { useState } from 'react';

export default function UrlCard({ data }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(data.shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="result-card">
      <div className="result-label">Your short link is ready</div>
      <div className="result-row">
        <div className="result-url">
          <span className="link-icon">🔗</span>
          <a href={data.shortUrl} target="_blank" rel="noreferrer">
            {data.shortUrl}
          </a>
        </div>
        <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={copy}>
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}