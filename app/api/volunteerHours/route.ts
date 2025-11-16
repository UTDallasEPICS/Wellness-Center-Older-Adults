// Example of a PUT endpoint to update a ride with total time
import express from 'express';
import prisma from '../../../util/prisma-client';

const app = express();
app.use(express.json());
 

app.put('/api/ride/:id', async (req, res) => {
  const { id } = req.params;
  const { totalTime } = req.body;

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