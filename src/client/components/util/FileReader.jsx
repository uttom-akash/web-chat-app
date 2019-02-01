
const  getReadFile =async (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    let messageObject;
    reader.onload = await (ev) => {
      messageObject = {
        fileName: file.name,
        type: file.type,
        file: reader.result,
        size: file.size
      };
      console.log(".........", messageObject);
    };
    console.log(".....out....", messageObject);
  
};

export default getReadFile;
