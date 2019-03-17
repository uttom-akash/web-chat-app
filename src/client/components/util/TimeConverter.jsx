export default time => {
  const sec = time % 60;
  const min = Math.floor(time / 60) % 60;
  const hr = Math.floor(time / 3600) % 60;

  if (hr) return `${hr} : ${min} : ${sec}`;
  else if (min) return `${min} : ${sec}`;
  else return `${sec}`;
};
