const router = require('express').Router();
const requireAuth = require('../middleware/auth.middleware');
const { getRooms, createRoom, updateRoom, deleteRoom } = require('../controllers/rooms.controller');

router.use(requireAuth);   // all room routes need auth
router.get('/',    getRooms);
router.post('/',   createRoom);
router.patch('/:id', updateRoom);
router.delete('/:id', deleteRoom);

module.exports = router;