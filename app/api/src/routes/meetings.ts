import { Router } from 'express'
import { prisma } from '../lib/db'

const router = Router()

router.get('/', async (_req, res) => {
  const meetings = await prisma.meeting.findMany({
    orderBy: { meetingDate: 'desc' },
  })
  res.json(meetings)
})

router.get('/search', async (req, res) => {
  const query = req.query.q as string | undefined
  
  if (!query || query.trim() === '') {
    return res.json([])
  }

  const meetings = await prisma.meeting.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { body: { contains: query, mode: 'insensitive' } },
      ],
    },
    orderBy: { meetingDate: 'desc' },
  })
  res.json(meetings)
})

router.get('/:id', async (req, res) => {
  const meeting = await prisma.meeting.findUnique({
    where: { id: req.params.id },
  })
  if (!meeting) {
    return res.status(404).json({ error: 'Not found' })
  }
  res.json(meeting)
})

router.post('/', async (req, res) => {
  // TODO: validate input
  const { title, body, meetingDate } = req.body
  const meeting = await prisma.meeting.create({
    data: {
      title,
      body,
      meetingDate: new Date(meetingDate),
    },
  })
  res.status(201).json(meeting)
})

router.put('/:id', async (req, res) => {
  const { title, body, meetingDate } = req.body
  const meeting = await prisma.meeting.update({
    where: { id: req.params.id },
    data: {
      title,
      body,
      meetingDate: meetingDate ? new Date(meetingDate) : undefined,
    },
  })
  res.json(meeting)
})

router.delete('/:id', async (req, res) => {
  await prisma.meeting.delete({
    where: { id: req.params.id },
  })
  res.status(204).end()
})

export default router
