import { app } from "../../scripts/app.js";

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
      }
    },
    {
      id: "clearWorkflow",
      label: "Clear Workflow",
      function: () => {
        if (confirm("Clear the workflow?")) {
          app.graph.clear();
        }
      }
    },
    {
      id: "saveWorkflow",
      label: "Save Workflow",
      function: () => {
        app.graphToPrompt().then(workflow => {
          const blob = new Blob([JSON.stringify(workflow)], {type: "application/json"});
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "workflow.json";
          a.click();
          URL.revokeObjectURL(url);
        });
      }
    }
  ],
  // Add commands to menu
//   menuCommands: [
//     { 
//       path: ["aifx"], 
//       commands: ["myCommand"] 
//     }
//   ],
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


app.extensionManager.registerSidebarTab({
  id: "statefulTab",
  icon: "pi pi-list",
  title: "Notes",
  type: "custom",
  render: (el) => {
    // Create elements
    const container = document.createElement('div');
    container.style.padding = '10px';
    
    const notepad = document.createElement('textarea');
    notepad.style.width = '100%';
    notepad.style.height = '200px';
    notepad.style.marginBottom = '10px';
    
    // Load saved content if available
    const savedContent = localStorage.getItem('comfyui-notes');
    if (savedContent) {
      notepad.value = savedContent;
    }
    
    // Auto-save content
    notepad.addEventListener('input', () => {
      localStorage.setItem('comfyui-notes', notepad.value);
    });
    
    // Assemble the UI
    container.appendChild(notepad);
    el.appendChild(container);
  }
});