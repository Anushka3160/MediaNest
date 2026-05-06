const prisma = require('../lib/prisma');

async function getRooms(req, res) {
  const rooms = await prisma.room.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'asc' }
  });
  res.json(rooms);
}

async function createRoom(req, res) {
  const { name, icon, theme, type, color } = req.body;
  if (!name || !icon) return res.status(400).json({ error: 'Name and icon required' });
  const room = await prisma.room.create({
    data: { name, icon, theme: theme || 'forest', type: type || 'custom', color, userId: req.user.id }
  });
  res.status(201).json(room);
}

async function updateRoom(req, res) {
  const room = await prisma.room.findFirst({
    where: { id: req.params.id, userId: req.user.id }
  });
  if (!room) return res.status(404).json({ error: 'Room not found' });
  const updated = await prisma.room.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(updated);
}

async function deleteRoom(req, res) {
  const room = await prisma.room.findFirst({
    where: { id: req.params.id, userId: req.user.id }
  });
  if (!room) return res.status(404).json({ error: 'Room not found' });
  await prisma.room.delete({ where: { id: req.params.id } });
  res.json({ deleted: true });
}

module.exports = { getRooms, createRoom, updateRoom, deleteRoom };