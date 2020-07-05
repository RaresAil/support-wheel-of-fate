
module.exports.dateToOutput = (date) => {
  if (!(date instanceof Date)) {
    return;
  }

  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

module.exports.dateToOutputCDay = (date, day) => {
  if (!(date instanceof Date)) {
    return;
  }

  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate() + day).toString().padStart(2, '0')}`;
};

module.exports.getNextMonday = (date) => {
  if (!date || !(date instanceof Date)) {
    date = new Date();
  }

  date.setDate(date.getDate() + (1 + 7 - date.getDay()) % 7);
  return date;
};
