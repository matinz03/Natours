/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-nested-ternary */
const fs = require('fs');

const path = require('path');

const saveToFile = require('../helpers/helpers');

const filePath = path.join(
  __dirname,
  '..',
  'dev-data',
  'data',
  'tours-simple.json',
);
const tours = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const checkId = (req, res, next, val) => {
  if (!tours.find((el) => el.id === Number(val))) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  next();
};
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

  res.json({ status: 'success', data: { tour } });
};

const createTour = (req, res) => {
  const newId = tours.length > 0 ? tours[tours.length - 1].id + 1 : 1;
  // eslint-disable-next-line no-unused-vars
  const { id, ...rest } = req.body;
  const newTour = { id: newId, ...rest };

  tours.push(newTour);
  saveToFile(filePath, tours, res, 201, { tour: newTour });
};

const updateTour = (req, res) => {
  const id = Number(req.params.id);
  const index = tours.findIndex((el) => el.id === id);

  tours[index] = { ...tours[index], ...req.body };
  saveToFile(filePath, tours, res, 200, { tour: tours[index] });
};

const deleteTour = (req, res) => {
  const id = Number(req.params.id);
  const index = tours.findIndex((el) => el.id === id);

  tours.splice(index, 1);
  saveToFile(filePath, tours, res, 204);
};
const checkData = (req, res, next) => {
  if (!req.body.price || !req.body.name) {
    return res.status(400).json({
      status: 'fail',
      message: `missing ${
        !req.body.price ? (!req.body.name ? 'name and price' : 'price') : 'name'
      }`,
    });
  }
  next();
};

module.exports = {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  checkId,
  checkData,
};
