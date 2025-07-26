export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metode tidak diizinkan' });
  }

  const { url } = req.body;
  if (!url || !url.includes('instagram.com')) {
    return res.status(400).json({ error: 'Link Instagram tidak valid' });
  }

  try {
    const apiUrl = `https://instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com/convert?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com',
      },
    });

    const result = await response.json();
    console.log("Raw response:", result);

    if (!result.media || result.media.length === 0) {
      return res.status(500).json({ error: 'Gagal mengambil data dari Instagram' });
    }

    return res.status(200).json({
      title: 'Instagram Video',
      thumbnail: result.media[0].thumbnail,
      downloadUrl: result.media[0].url
    });
  } catch (error) {
    console.error("Instagram Error:", error);
    return res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data dari Instagram' });
  }
}
