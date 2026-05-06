const app = require('./app');

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`MediaNest backend running on port ${PORT}`));
}

module.exports = app;