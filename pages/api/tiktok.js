export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metode tidak diizinkan' });
  }

  const { url } = req.body;
  if (!url || !url.includes('tiktok.com')) {
    return res.status(400).json({ error: 'Link TikTok tidak valid' });
  }

  try {
    const apiUrl = `https://tikwm.com/api?url=${encodeURIComponent(url)}`;
    const response = await fetch(apiUrl);
    const result = await response.json();

    if (!result || !result.data || !result.data.play) {
      return res.status(500).json({ error: 'Gagal mengambil data video TikTok' });
    }

    return res.status(200).json({
      title: result.data.title,
      thumbnail: result.data.cover,
      downloadUrl: result.data.play
    });
  } catch (error) {
    return res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data dari TikTok' });
  }
}
