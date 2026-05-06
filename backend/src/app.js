const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();
 
const authRoutes    = require('./routes/auth.routes');
const roomsRoutes   = require('./routes/rooms.routes');
const entriesRoutes = require('./routes/entries.routes');
const searchRoutes  = require('./routes/search.routes');   // ← MOVED UP
 
const app = express();
 
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
 
app.use('/api/auth',    authRoutes);
app.use('/api/rooms',   roomsRoutes);
app.use('/api/entries', entriesRoutes);
app.use('/api/search',  searchRoutes);                     // ← MOVED UP
 
app.get('/api/health', (_, res) => res.json({ ok: true }));
 
module.exports = app;         