export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metode tidak diizinkan' });
  }

  const { url } = req.body;
  if (!url || !url.includes('x.com')) {
    return res.status(400).json({ error: 'URL tidak valid' });
  }

  try {
    const response = await fetch('https://fast-video-dowloander.p.rapidapi.com/all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-rapidapi-host': 'fast-video-dowloander.p.rapidapi.com',
        'x-rapidapi-key': '61617f5a38msh8e1d370b081bd16p105bb4jsnd01cc56401cc',
      },
      body: new URLSearchParams({ url })
    });

    const result = await response.json();
    console.log("X API Response:", result);

    // Validasi jika gagal
    if (!result || !result.url) {
      return res.status(500).json({ error: 'Gagal mengambil video dari X' });
    }

    return res.status(200).json({
      title: result.title || 'X Video',
      uploader: result.uploader || '',
      uploader_url: result.uploader_url || '',
      downloadUrl: result.url,
      thumbnail: result.thumbnails ? result.thumbnails[0]?.url : null,
      resolution: result.height + 'x' + result.width
    });
  } catch (error) {
    console.error("X Download Error:", error);
    return res.status(500).json({ error: error.message || 'Terjadi kesalahan saat mengambil video' });
  }
}
