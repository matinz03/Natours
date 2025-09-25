const fs = require('fs');
const path = require('path');
const saveToFile = require('../helpers/helpers');

const userFilePath = path.join(
  __dirname,
  '..',
  'dev-data',
  'data',
  'users.json'
);
let users = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users },
  });
};

const getUser = (req, res) => {
  const mail = req.params.mail;
  const user = users.find((el) => el.email === mail);

  if (!user)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  res.json({ status: 'success', data: { user } });
};

const createUser = (req, res) => {
  const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
  const newUser = { id: newId, ...req.body };

  users.push(newUser);
  saveToFile(userFilePath, users, res, 201, { user: newUser });
};

const updateUser = (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((el) => el.id === id);

  if (index === -1)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  users[index] = { ...users[index], ...req.body };
  saveToFile(userFilePath, users, res, 200, { user: users[index] });
};

const deleteUser = (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex((el) => el.id === id);

  if (index === -1)
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });

  users.splice(index, 1);
  saveToFile(userFilePath, users, res, 204);
};

module.exports = { getAllUsers, getUser, createUser, updateUser, deleteUser };
