const fileType = mimeType => {
  let Type = mimeType.substring(0, 3);

  switch (Type) {
    case "ima":
      return "images";
    case "vid":
      return "videos";
    case "aud":
      return "audios";
    default:
      return "files";
  }
};

module.exports = fileType;
