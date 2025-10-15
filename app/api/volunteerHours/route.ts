// Example of a PUT endpoint to update a ride with total time
import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(express.json());
const prisma = new PrismaClient();

app.put('/api/ride/:id', async (req, res) => {
  const { id } = req.params;
  const { totalTime } = req.body; // totalTime is now a string like "01:30"

  try {
    const updatedRide = await prisma.ride.update({
      where: {
        id: parseInt(id),
      },
      data: {
        totalTime: totalTime,
      },
    });
    res.status(200).json(updatedRide);
  } catch (error) {
    console.error('Failed to update ride:', error);
    res.status(500).json({ error: 'Failed to update ride' });
  }
});