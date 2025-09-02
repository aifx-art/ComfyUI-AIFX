import { app } from "../../scripts/app.js";

app.registerExtension({
  name: "aifx",
   commands: [
    { 
      id: "saveAsImage", 
      label: "Save as Image", 
      function: () => { 
        // Code to save canvas as image
      } 
    },
    { 
      id: "exportWorkflow", 
      label: "Export Workflow", 
      function: () => { 
        // Code to export workflow
      } 
    }
  ],
  menuCommands: [
    // Add to File menu
    { 
      path: ["File"], 
      commands: ["saveAsImage", "exportWorkflow"] 
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
