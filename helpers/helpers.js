const fs = require('fs');

const saveToFile = (file, data, res, statusCode, responseData = null) => {
  fs.writeFile(file, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 'error', message: 'Failed to save file' });
    }
    res.status(statusCode).json({
      status: 'success',
      data: responseData,
    });
  });
};
module.exports = saveToFile;
