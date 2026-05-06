const prisma = require('../lib/prisma');

async function getEntries(req, res) {
  const { roomId } = req.query;
  // verify room belongs to user
  const room = await prisma.room.findFirst({ where: { id: roomId, userId: req.user.id } });
  if (!room) return res.status(404).json({ error: 'Room not found' });
  const entries = await prisma.entry.findMany({
    where: { roomId },
    orderBy: { addedAt: 'desc' }
  });
  res.json(entries);
}

async function createEntry(req, res) {
  const { roomId, title, type, creator, coverUrl, previewUrl, status, year, color, size } = req.body;
  if (!roomId || !title) return res.status(400).json({ error: 'roomId and title required' });
  const room = await prisma.room.findFirst({ where: { id: roomId, userId: req.user.id } });
  if (!room) return res.status(403).json({ error: 'Not your room' });
  const entry = await prisma.entry.create({
    data: { roomId, title, type: type || 'item', creator, coverUrl, previewUrl,status: status || 'want', year, color, size }
  });
  res.status(201).json(entry);
}

async function updateEntry(req, res) {
  // find entry and verify ownership via room
  const entry = await prisma.entry.findFirst({
    where: { id: req.params.id },
    include: { room: true }
  });
  if (!entry || entry.room.userId !== req.user.id)
    return res.status(404).json({ error: 'Entry not found' });
  const updated = await prisma.entry.update({
    where: { id: req.params.id },
    data: req.body
  });
  res.json(updated);
}

async function deleteEntry(req, res) {
  const entry = await prisma.entry.findFirst({
    where: { id: req.params.id },
    include: { room: true }
  });
  if (!entry || entry.room.userId !== req.user.id)
    return res.status(404).json({ error: 'Entry not found' });
  await prisma.entry.delete({ where: { id: req.params.id } });
  res.json({ deleted: true });
}

module.exports = { getEntries, createEntry, updateEntry, deleteEntry };