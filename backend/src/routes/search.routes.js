const router = require('express').Router();
 
router.get('/movies', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    const url  = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(q)}&page=1`;
    const data = await fetch(url).then(r => r.json());
    const results = (data.results || []).slice(0, 8).map(m => ({
      title:    m.title,
      creator:  '',
      coverUrl: m.poster_path ? `https://image.tmdb.org/t/p/w200${m.poster_path}` : '',
      year:     (m.release_date || '').slice(0, 4)
    }));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
module.exports = router;