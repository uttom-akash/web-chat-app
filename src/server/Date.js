const getDateTime = () => {
  let date = new Date();
  return `${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};

const getDate = () => {
  let date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

module.exports = { getDateTime, getDate };
