export default index => {
  switch (index) {
    case "dark":
      return [
        { name: "--full-screen", value: " #e4ebef" },
        { name: "--app-screen", value: " #181c21" },
        { name: "--app-screen-deeper", value: " #101316" },
        { name: "--app-screen-lighter", value: "#1d2129" },
        { name: "--app-screen-header", value: " #1d2129" },
        { name: "--app-screen-shadow", value: " #77797c" },

        { name: " --input-color", value: " #1d2129" },
        { name: "--button-hover", value: " #8f9296" },
        { name: "--pro-icon-color", value: " #8f9296" },
        { name: "--icon-color", value: " #8f9296" },
        { name: "--control-icon", value: " #8f9296" },

        { name: "--line", value: " #101316" },
        { name: "--shadow", value: " black" },
        { name: "--spinner", value: " #8f9296" },
        { name: "--font-color", value: " #8f9296" },
        { name: "--muted-font-color", value: " #73797c" },
        { name: "--font-color-alternate", value: " #090a0c" },
        { name: "--font-color-button", value: "#8f9296" },
        { name: "--font-color-alternate-1", value: " #1f8946" },

        { name: "--chatbox-bg", value: " #e1e4e7" },
        { name: "--msg-compose-bg", value: " whitesmoke" },
        { name: "--message-user-border", value: " #181c21" },
        { name: "--message-friend-bg", value: " #181c21" },
        { name: "--message-friend-color", value: " #8c9296" },
        { name: "--message-user-color", value: " #181c21" },
        { name: "--message-shadow", value: " rgb(133, 132, 132)" },

        { name: "--header-font-color", value: " rgb(235, 232, 232)" },
        { name: "--img-border", value: " black" },

        { name: "--hover", value: " #1f8946" },
        { name: "--error", value: " #ff386c" },
        { name: "--active", value: " rgb(24, 218, 153)" },
        { name: "--in-active", value: " #ff386c" }
      ];
    case "dark-light":
      return [
        { name: "--full-screen", value: " #e4ebef" },
        { name: "--app-screen", value: " #eef0f1" },
        { name: "--app-screen-deeper", value: " #101316" },
        { name: "--app-screen-lighter", value: " #dbdfe0" },
        { name: "--app-screen-header", value: "#1d2129" },
        { name: "--app-screen-shadow", value: " #77797c" },

        { name: "--input-color", value: "#101316" },
        { name: "--pro-icon-color", value: " #8f9296" },
        { name: "--button-hover", value: " #8f9296" },
        { name: "--icon-color", value: " #8f9296" },
        { name: "--control-icon", value: " #8f9296" },
        { name: "--line", value: " #101316" },
        { name: "--shadow", value: " black" },
        { name: "--spinner", value: " #8f9296" },
        { name: "--font-color", value: " #1d2129" },
        { name: "--muted-font-color", value: " #73797c" },
        { name: "--font-color-button", value: " #e1e4e7" },
        { name: "--font-color-input", value: " #e1e4e7" },
        { name: "--font-color-alternate", value: " #090a0c" },
        { name: "--font-color-alternate-1", value: " #1f8946" },

        { name: "--chatbox-bg", value: " #e1e4e7" },
        { name: "--msg-compose-bg", value: " whitesmoke" },
        { name: "--message-user-border", value: " #181c21" },
        { name: "--message-friend-bg", value: " #181c21" },
        { name: "--message-friend-color", value: " #8c9296" },
        { name: "--message-user-color", value: " #181c21" },
        { name: "--message-shadow", value: " rgb(133, 132, 132)" },

        { name: "--header-font-color", value: " rgb(235, 232, 232)" },
        { name: "--img-border", value: " black" },

        { name: "--hover", value: " #101316" },
        { name: "--error", value: " #ff386c" },
        { name: "--active", value: " rgb(24, 218, 153)" },
        { name: "--in-active", value: " #ff386c" }
      ];
    case "light":
      return [
        { name: "--full-screen", value: " #f1f4f5" },
        { name: "--app-screen", value: " #ebecf0" },
        { name: "--app-screen-deeper", value: " #2eb5f0" },
        { name: "--app-screen-lighter", value: " #e1e4e9" },
        { name: "--app-screen-header", value: " #59c1ee" },
        { name: "--app-screen-shadow", value: " #77797c" },

        { name: "--input-color", value: " #59c1ee" },
        { name: "--button-hover", value: " #8f9296" },
        { name: "--pro-icon-color", value: " #59c1ee" },
        { name: "--icon-color", value: " #e1e4e7" },
        { name: "--control-icon", value: " #e1e4e7" },
        { name: "--line", value: " #61c4ee" },
        { name: "--shadow", value: " #1e8ebe" },
        { name: "--spinner", value: " #2eb5f0" },
        { name: "--font-color", value: " #1d2129" },
        { name: "--muted-font-color", value: " #73797c" },
        { name: "--font-color-button", value: " #e1e4e7" },
        { name: "--font-color-input", value: " #e1e4e7" },
        { name: "--font-color-alternate", value: " #090a0c" },
        { name: "--font-color-alternate-1", value: " #e1e4e7" },

        { name: "--chatbox-bg", value: " #e1e4e7" },
        { name: "--msg-compose-bg", value: " whitesmoke" },
        { name: "--message-user-border", value: " #2eb5f0" },
        { name: "--message-friend-bg", value: " #2eb5f0" },
        { name: "--message-friend-color", value: " #eaf0f3" },
        { name: "--message-user-color", value: " #181c21" },
        { name: "--message-shadow", value: " #1e8ebe" },

        { name: "--header-font-color", value: " rgb(235, 232, 232)" },
        { name: "--img-border", value: " #2eb5f0" },

        { name: "--hover", value: " #70c7ec" },
        { name: "--error", value: " #ff386c" },
        { name: "--active", value: " rgb(24, 218, 153)" },
        { name: "--in-active", value: " #ff386c" }
      ];
    default:
      return [
        { name: "--full-screen", value: "#f1f4f5" },
        { name: "--app-screen", value: "white" },
        { name: "--app-screen-deeper", value: "#2eb5f0" },
        { name: "--app-screen-lighter", value: "#edf0f6" },
        { name: "--app-screen-header", value: "white" },
        { name: "--app-screen-shadow", value: "#bbbcbe" },

        { name: "--input-color", value: "#2eb5f0" },
        { name: "--button-hover", value: "#8f9296" },
        { name: "--pro-icon-color", value: "#2eb5f0" },
        { name: "--icon-color", value: "#2eb5f0" },
        { name: "--control-icon", value: "white" },
        { name: "--line", value: "#61c4ee" },
        { name: "--shadow", value: "#1e8ebe" },
        { name: "--spinner", value: "#2eb5f0" },
        { name: "--font-color", value: "#1d2129" },
        { name: "--muted-font-color", value: "#73797c" },
        { name: "--font-color-button", value: "#e1e4e7" },
        { name: "--font-color-input", value: "#e1e4e7" },
        { name: "--font-color-alternate", value: "#090a0c" },
        { name: "--font-color-alternate-1", value: "#e1e4e7" },

        { name: "--chatbox-bg", value: "#edf0f3" },
        { name: "--msg-compose-bg", value: "whitesmoke" },
        { name: "--message-user-border", value: "white" },
        { name: "--message-friend-bg", value: "#2eb5f0" },
        { name: "--message-friend-color", value: "#eaf0f3" },
        { name: "--message-user-color", value: "#181c21" },
        { name: "--message-shadow", value: "#1e8ebe" },

        { name: "--header-font-color", value: "rgb(235, 232, 232)" },
        { name: "--img-border", value: "#2eb5f0" },

        { name: "--hover", value: "#70c7ec" },
        { name: "--error", value: "#ff386c" },
        { name: "--active", value: "rgb(24, 218, 153)" },
        { name: "--in-active", value: "#ff386c" }
      ];
  }
};
