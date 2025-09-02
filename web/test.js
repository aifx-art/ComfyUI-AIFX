import { app } from "../../scripts/app.js";

app.registerExtension({
  name: "aifx",
    // Define commands
  commands: [
    { 
      id: "myCommand", 
      label: "My Command", 
      function: () => { alert("Command executed!"); } 
    }
  ],
  // Add commands to menu
  menuCommands: [
    { 
      path: ["Extensions", "aifx"], 
      commands: ["myCommand"] 
    }
  ],
  async setup() {
    // const renderButton = new ComfyButton({
    //   icon: "aifx",
    //   tooltip: "aifx-render",
    //   app,
    //   enabled: true,
    //   classList: "comfyui-button comfyui-menu-mobile-collapse primary",
    // });
    console.log("extension running");
    alert("Setup complete!");
  },
});
