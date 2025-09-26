const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful'));
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('data imported');
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('data deleted');
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
