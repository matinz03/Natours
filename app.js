const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');

// Express app
const app = express();
app.use(morgan('dev'));
app.use(express.json());

// File path
const filePath = path.join(__dirname, 'dev-data', 'data', 'tours-simple.json');

// Load data once
let tours = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
/**
 * HELPERS
 */
const saveTours = (res, statusCode, data = null) => {
  fs.writeFile(filePath, JSON.stringify(tours, null, 2), (err) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Failed to save file' });
    }
    if (data) {
      res.status(statusCode).json({ status: 'success', data });
    } else {
      res.status(statusCode).json({ status: 'success', data: null });
    }
  });
};

/**
 * CONTROLLERS
 */
const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};

const getTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  res.json({ status: 'success', data: { tour } });
};

const createTour = (req, res) => {
  const newId = tours.length > 0 ? tours[tours.length - 1].id + 1 : 1;
  const newTour = { id: newId, ...req.body };

  tours.push(newTour);
  saveTours(res, 201, { tour: newTour });
};

const updateTour = (req, res) => {
  const id = Number(req.params.id);
  const index = tours.findIndex((el) => el.id === id);

  if (index === -1) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  tours[index] = { ...tours[index], ...req.body };
  saveTours(res, 200, { tour: tours[index] });
};

const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  const index = tours.findIndex((el) => el.id === id);

  if (index === -1) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  tours.splice(index, 1);
  saveTours(res, 204);
};

/**
 * ROUTES
 */

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

/**
 * SERVER
 */
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});
