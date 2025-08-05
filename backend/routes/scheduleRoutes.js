import express from 'express';
import { 
  getProviderSchedule, 
  createAvailability, 
  createReservation, 
  updateScheduleItem, 
  deleteScheduleItem,
  getAvailableSlots
} from '../controllers/scheduleController.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// GET /api/schedule/:providerId - Get provider schedule
router.get('/:providerId', authenticateToken, getProviderSchedule);

// GET /api/schedule/availability/:providerId - Get available slots
router.get('/availability/:providerId', authenticateToken, getAvailableSlots);

// POST /api/schedule/availability - Create availability slots
router.post('/availability', authenticateToken, createAvailability);

// POST /api/schedule/reservation - Create a reservation
router.post('/reservation', authenticateToken, createReservation);

// PUT /api/schedule/:scheduleId - Update a schedule item
router.put('/:scheduleId', authenticateToken, updateScheduleItem);

// DELETE /api/schedule/:scheduleId - Delete a schedule item
router.delete('/:scheduleId', authenticateToken, deleteScheduleItem);

export default router; 