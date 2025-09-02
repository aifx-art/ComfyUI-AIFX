import { app } from "../../scripts/app.js";

app.registerExtension({
  name: "aifx",
  async setup() {
    const renderButton = new ComfyButton({
      icon: "aifx",
      tooltip: "aifx-render",
      app,
      enabled: true,
      classList: "comfyui-button comfyui-menu-mobile-collapse primary",
    });
    console.log("extension running");
    alert("Setup complete!");
  },
});
