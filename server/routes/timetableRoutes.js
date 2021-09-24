import express from 'express';

import {
  getUserTimeTable,
  createUserTimeTable,
} from '../controllers/timetableController.js';

const router = express.Router();

router.route('/').post(createUserTimeTable);
router.route('/:id').get(getUserTimeTable);

export default router;
