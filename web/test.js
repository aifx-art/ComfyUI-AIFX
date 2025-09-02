import { app } from "../../scripts/app.js";

import { ComfyButton } from "../../scripts/ui/components/button.js";
import { ComfyButtonGroup } from "../../scripts/ui/components/buttonGroup.js";

let simpleButtonGroup = null;

function addSimpleButton() {
  // If we already added the button, don’t add again
  if (simpleButtonGroup) return;

  // Create a button
  const button = new ComfyButton({
    icon: "", // you can use an emoji or leave blank
    tooltip: "Click me!",
    app,
    enabled: true,
    classList: "comfyui-button comfyui-menu-mobile-collapse primary",
  });
button.iconElement.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
       fill="none" stroke="currentColor" stroke-width="2"
       stroke-linecap="round" stroke-linejoin="round">
    <text x="0" y="15" font-size="14" font-family="Arial" fill="currentColor">AIFX</text>
  </svg>
`;
  // Add a click handler
  button.element.addEventListener("click", () => {
    alert("Hello from AIFX!");
  });

  // Wrap in a button group (required by ComfyUI’s menu system)
  simpleButtonGroup = new ComfyButtonGroup(button);

  // Insert before the settings group in the top bar
  if (app.menu?.settingsGroup?.element) {
    app.menu.settingsGroup.element.before(simpleButtonGroup.element);
  }
}

app.registerExtension({
  name: "aifx",
  // Define commands
  //   commands: [
  //     {
  //       id: "myCommand",
  //       label: "My Command",
  //       function: () => { alert("Command executed!"); }
  //     }
  //   ],
  commands: [
    {
      id: "runWorkflow",
      label: "Run Workflow",
      function: () => {
        app.queuePrompt();
      },
    },
    {
      id: "clearWorkflow",
      label: "Clear Workflow",
      function: () => {
        if (confirm("Clear the workflow?")) {
          app.graph.clear();
        }
      },
    },
    {
      id: "saveWorkflow",
      label: "Save Workflow",
      function: () => {
        app.graphToPrompt().then((workflow) => {
          const blob = new Blob([JSON.stringify(workflow)], {
            type: "application/json",
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "workflow.json";
          a.click();
          URL.revokeObjectURL(url);
        });
      },
    },
  ],
  // Add commands to menu
  //   menuCommands: [
  //     {
  //       path: ["aifx"],
  //       commands: ["myCommand"]
  //     }
  //   ],
  async setup() {
    addSimpleButton();
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

app.extensionManager.registerSidebarTab({
  id: "statefulTab",
  icon: "pi pi-list",
  title: "Notes",
  type: "custom",
  render: (el) => {
    // Create elements
    const container = document.createElement("div");
    container.style.padding = "10px";

    const notepad = document.createElement("textarea");
    notepad.style.width = "100%";
    notepad.style.height = "200px";
    notepad.style.marginBottom = "10px";

    // Load saved content if available
    const savedContent = localStorage.getItem("comfyui-notes");
    if (savedContent) {
      notepad.value = savedContent;
    }

    // Auto-save content
    notepad.addEventListener("input", () => {
      localStorage.setItem("comfyui-notes", notepad.value);
    });

    // Assemble the UI
    container.appendChild(notepad);
    el.appendChild(container);
  },
});
