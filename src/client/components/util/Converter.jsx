export default size => {
  if (size > 1024) size = (size / 1024).toFixed(2);
  else return `${size} Kb`;
  if (size > 1024) size = (size / 1024).toFixed(2);
  else return `${size} Mb`;

  if (size > 1024) size = (size / 1024).toFixed(2);
  else return `${size} Gb`;

  return `${size} Gb`;
};
