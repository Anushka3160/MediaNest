const router = require('express').Router();
const requireAuth = require('../middleware/auth.middleware');
const { getEntries, createEntry, updateEntry, deleteEntry } = require('../controllers/entries.controller');

router.use(requireAuth);
router.get('/',      getEntries);    // ?roomId=xxx
router.post('/',     createEntry);
router.patch('/:id', updateEntry);
router.delete('/:id', deleteEntry);

module.exports = router;