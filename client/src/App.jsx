import { useState } from 'react';
import ShortenForm from './components/ShortenForm';
import UrlCard from './components/UrlCard';
import './App.css';

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="page">
      <div className="bg-blur one" />
      <div className="bg-blur two" />

      <div className="container">
        <div className="badge">Free · No signup · Instant</div>

        <h1>
          Shorten any link<br />
          <span className="gradient-text">in one click</span>
        </h1>

        <p className="subtitle">
          Paste your long URL below and get a clean short link instantly.
        </p>

        <div className="card">
          <ShortenForm onResult={(data) => setResult(data)} />
          {result && <UrlCard data={result} />}
        </div>
      </div>
    </div>
  );
}