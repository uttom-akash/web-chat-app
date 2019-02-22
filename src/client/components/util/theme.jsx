export default index => {
  switch (index) {
    case "1":
      return [
        { name: "--full-screen", value: "#e4ebef" },
        { name: "--app-screen", value: "#171717" },
        { name: "--app-screen-deeper", value: "#212121" },
        { name: "--header", value: "#212121" },
        { name: "--footer", value: "#212121" },
        { name: "--header-font-color", value: "#ffffff" },
        { name: "--font-color", value: "#a6abad" },
        { name: "--muted-font-color", value: "#73797c" },
        { name: "--line", value: "#212121" },
        { name: "--img-border", value: "#212121" },
        { name: "--border", value: "#212121" },
        { name: "--border-fixed", value: "#a4d132" },
        { name: "--highlight", value: "#a4d132" },
        { name: "--hover", value: "#a4d132" },
        { name: "--unhover", value: "#171717" },
        { name: "--error", value: "#ff386c" },
        { name: "--shadow", value: "#b9d2dd" },
        { name: "--active", value: "rgb(24, 218, 153)" },
        { name: "--in-active", value: "#ff386c" }
      ];
    default:
      return [
        { name: "--full-screen", value: "#e4ebef" },
        { name: "--app-screen", value: "#f2f5f8" },
        { name: "--app-screen-deeper", value: "#e6f5fc" },
        { name: "--header", value: "#e6f5fc" },
        { name: "--footer", value: "#e6f5fc" },
        { name: "--header-font-color", value: "#26231f" },
        { name: "--font-color", value: "#4a575e" },
        { name: "--muted-font-color", value: "#73797c" },
        { name: "--line", value: "#c7d4da" },
        { name: "--img-border", value: "#c7d4da" },
        { name: "--border", value: "#f2f5f8" },
        { name: "--border-fixed", value: "#2eb5f0" },
        { name: "--highlight", value: "#2eb5f0" },
        { name: "--hover", value: "#2eb5f0" },
        { name: "--unhover", value: "#f2f5f8" },
        { name: "--error", value: "#ff386c" },
        { name: "--shadow", value: "#b9d2dd" },
        { name: "--active", value: "rgb(24, 218, 153)" },
        { name: "--in-active", value: "#ff386c" }
      ];
  }
};
