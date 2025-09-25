const express = require('express');
const {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkId,
  checkData,
} = require('../controllers/tourController');

const router = express.Router();
router.param('id', checkId);
router.route('/').get(getAllTours).post(checkData, createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(checkData, updateTour)
  .delete(deleteTour);
router.use(checkData);

module.exports = router;
