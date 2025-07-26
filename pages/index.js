import { useState, useEffect } from 'react';
import { detectPlatform } from '../utils/detectPlatform';
import { saveToHistory, getHistory, clearHistory } from '../utils/history';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDownload = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    const platform = detectPlatform(url);
    if (!platform) {
      setError('Platform tidak didukung. Masukkan link dari TikTok, YouTube, Instagram, atau X.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/${platform}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal');

      setResult(data);
      saveToHistory({ title: data.title, url: data.downloadUrl });
      setHistory(getHistory());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <main className="min-h-screen bg-zinc-900 text-white transition-all flex flex-col items-center justify-center px-4 py-6">
  <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center">🎥 Multi Downloader</h1>

  <p className="text-sm sm:text-base mb-4 text-zinc-300 text-center">
    Unduh video dari <strong>TikTok</strong>, <strong>YouTube</strong>, <strong>Instagram</strong>, dan <strong>X (Twitter)</strong> dengan mudah dan cepat!
  </p>

  <div className="w-full max-w-md bg-zinc-800 p-5 rounded-2xl shadow-xl space-y-4">
    <input
      type="text"
      value={url}
      onChange={(e) => setUrl(e.target.value)}
      placeholder="Tempel link video Anda..."
      className="w-full p-3 rounded-md bg-zinc-700 text-white placeholder-zinc-400 outline-none focus:ring-2 focus:ring-blue-500"
    />

    <button
      onClick={handleDownload}
      className="w-full bg-blue-600 hover:bg-blue-700 transition-all py-3 rounded-md text-white font-semibold"
    >
      {loading ? 'Memproses...' : 'Download Sekarang'}
    </button>

    {error && <p className="text-red-500 text-sm">{error}</p>}

    {result && (
      <div className="mt-6 bg-zinc-900 p-4 rounded-xl space-y-2">
        <img src={result.thumbnail} alt="Thumbnail" className="rounded w-full" />
        <p className="font-bold text-lg">{result.title}</p>
        <a
          href={result.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white"
        >
          Download Video
        </a>
      </div>
    )}
  </div>

  <div className="max-w-md w-full mt-10 px-2">
    <h2 className="text-xl font-semibold mb-2">📂 Riwayat Unduhan</h2>
    {history.length === 0 ? (
      <p className="text-sm text-zinc-400">Belum ada riwayat.</p>
    ) : (
      <ul className="space-y-1 text-sm">
        {history.map((item, i) => (
          <li key={i}>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    )}

    {history.length > 0 && (
      <button
        onClick={handleClearHistory}
        className="mt-2 text-xs text-red-400 hover:underline"
      >
        Hapus Riwayat
      </button>
    )}
  </div>

  <footer className="mt-10 text-xs text-zinc-500 text-center">
    <p>
      <a href="https://www.instagram.com/kiareza23" target="_blank" className="underline">Instagram</a> |{' '}
      <a href="https://www.facebook.com/share/1C61Tf65Xq/" target="_blank" className="underline">Facebook</a>
    </p>
  </footer>
</main>

  );
}
