export default size => {
  if (size > 1024) size = Math.round(size / 1024);
  else return `${size} Kb`;
  if (size > 1024) size = Math.round(size / 1024);
  else return `${size} Mb`;

  if (size > 1024) size = Math.round(size / 1024);
  else return `${size} Gb`;

  return `${size} Gb`;
};
