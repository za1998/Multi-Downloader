export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metode tidak diizinkan' });
  }

  const { url } = req.body;
  if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
    return res.status(400).json({ error: 'URL tidak valid untuk YouTube' });
  }

  try {
    const response = await fetch('https://fast-video-dowloander.p.rapidapi.com/all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-rapidapi-host': 'fast-video-dowloander.p.rapidapi.com',
        'x-rapidapi-key': '61617f5a38msh8e1d370b081bd16p105bb4jsnd01cc56401cc'
      },
      body: new URLSearchParams({ url })
    });

    const result = await response.json();

    if (!result || !result.url) {
      return res.status(500).json({ error: 'Video YouTube tidak ditemukan atau gagal diambil' });
    }

    return res.status(200).json({
      title: result.title || 'YouTube Video',
      downloadUrl: result.url,
      uploader: result.uploader || '',
      thumbnail: result.thumbnail || ''
    });
  } catch (error) {
    console.error('YouTube Download Error:', error);
    return res.status(500).json({ error: error.message || 'Gagal mengambil video YouTube' });
  }
}
