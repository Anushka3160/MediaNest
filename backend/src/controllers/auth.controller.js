const prisma  = require('../lib/prisma');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');

function makeToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

// POST /api/auth/register
async function register(req, res) {
  const { email, username, password } = req.body;
  if (!email || !username || !password)
    return res.status(400).json({ error: 'All fields required' });

  const exists = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] }
  });
  if (exists) return res.status(409).json({ error: 'Email or username already taken' });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, username, passwordHash }
  });

  // Create the 3 default rooms for every new user
  await prisma.room.createMany({
    data: [
      { name: 'Screen Room', icon: '🎬', type: 'movies',  isDefault: true, userId: user.id },
      { name: 'Books Room',  icon: '📖', type: 'books',   isDefault: true, userId: user.id },
      { name: 'Music Room',  icon: '🎵', type: 'music',   isDefault: true, userId: user.id },
    ]
  });

  res.status(201).json({ token: makeToken(user), username: user.username });
}

// POST /api/auth/login
async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  res.json({ token: makeToken(user), username: user.username });
}

// GET /api/auth/me
async function me(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, username: true, createdAt: true }
  });
  res.json(user);
}

module.exports = { register, login, me };