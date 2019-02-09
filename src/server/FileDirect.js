const filedir = MimeType => {
  let fileType = MimeType.substring(0, 3);

  switch (fileType) {
    case "ima":
      return "./src/server/uploads/images";
    case "vid":
      return "./src/server/uploads/videos";
    case "aud":
      return "./src/server/uploads/audios";
    default:
      return "./src/server/uploads/files";
  }
};

module.exports = filedir;
