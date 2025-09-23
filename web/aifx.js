import { app } from "../../scripts/app.js";

import { ComfyButton } from "../../scripts/ui/components/button.js";
import { ComfyButtonGroup } from "../../scripts/ui/components/buttonGroup.js";
import { ComfyPopup } from "../../scripts/ui/components/popup.js";

let simpleButtonGroup = null;


// run comfy with --disable-smart-memory
async function postRender(data) {
  const savedApiKey = localStorage.getItem("aifx-api-key")
  alert(savedApiKey)
  let render = JSON.stringify(data)
  console.log("render", render)
  let res = await fetch("https://api.aifxart.com/network-render", {
    //credentials: "include",
    headers: {
      // "User-Agent":
      //   "Mozilla/5.0 (X11 Linux x86_64 rv:128.0) Gecko/20100101 Firefox/128.0",
      Accept: "application/json",
      "Accept-Language": "en-US,enq=0.5",
      "X-API-Key": savedApiKey,
      "Content-Type": "application/json",
      // "Sec-Fetch-Dest": "empty",
      // "Sec-Fetch-Mode": "cors",
      //  "Sec-Fetch-Site": "same-origin",
      Priority: "u=0",
    },
    // referrer: "https://api.aifxart.com/docs",
    //body: '{\n  "render": {\n    "id": "string",\n    "status": "QUEUED",\n    "notes": "string",\n    "created": 0,\n    "started": 0,\n    "finished": 0,\n    "pos": "string",\n    "neg": "string",\n    "seed": 0,\n    "width": 0,\n    "height": 0,\n    "steps": 0,\n    "guidance": 0,\n    "img2img": "string",\n    "img2imgstrength": 0,\n    "img2img_mode": "Classic",\n    "img2img2": "string",\n    "img2img2strength": 0,\n    "img2img2_mode": "Classic",\n    "filename": "string",\n    "step": 0,\n    "reponame": "string",\n    "repofiles": [\n      "string"\n    ],\n    "bitdepth": 0,\n    "eta": 0,\n    "pipeline": "string",\n    "mean": 0,\n    "stdev": 0,\n    "step_blend_factor": 0,\n    "step_blend_count": 0,\n    "time_shift": 0,\n    "implicit_steps": 0,\n    "scheduler": "string",\n    "step_noise": "Gaussian",\n    "start_noise": "Gaussian",\n    "noise_divergence": 0,\n    "json_data": "string"\n  }\n}',
    body: render,
    method: "POST",
    //  mode: "cors",
  });
  console.log(res);
}

async function handleClickLoad(app) {
  const workflow = app.graph.serialize()
  app.clean()
  app.loadGraphData(workflow)
}

async function handleClickRender(app) {
  //const workflow = app.graph.serialize()
  const graph = await app.graphToPrompt()
  console.log("graph", graph)
  const workflow = graph.output
  console.log("workflow", workflow)

  let filename = "comfyfile";
  let data = {
    render: {
      // id: "string",
      status: "QUEUED",
      //notes: "string",
      //created: 0,
      //started: 0,
      //finished: 0,
      //pos: "string",
      //neg: "string",
      //seed: 0,
      width: 0,
      height: 0,
      steps: 0,
      guidance: 0,
      //img2img: "string",
      img2imgstrength: 0,
      //img2img_mode: "Classic",
      //img2img2: "string",
      //img2img2strength: 0,
      //img2img2_mode: "Classic",
      filename: filename,
      //step: 0,
      //reponame: "string",
      //repofiles: ["string"],
      //bitdepth: 0,
      //eta: 0,
      pipeline: "COMFYUI",
      //mean: 0,
      //stdev: 0,
      //step_blend_factor: 0,
      //step_blend_count: 0,
      //time_shift: 0,
      //implicit_steps: 0,
      //scheduler: "string",
      //step_noise: "Gaussian",
      //start_noise: "Gaussian",
      //noise_divergence: 0,
      json_data: JSON.stringify(workflow, null, 2),
    },
  };
  postRender(data);

  //save workflow
  const blob = new Blob([JSON.stringify(workflow, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "workflow.json";
  a.click();
  URL.revokeObjectURL(url);

  //alert("Hello!")
  //console.log(app)
}

function addButtons() {
  // If we already added the button, don’t add again
  if (simpleButtonGroup) return;
  const buttons = [];
  // Create a button
  const button = new ComfyButton({
    icon: "share", // you can use an emoji or leave blank
    tooltip: "Render with AIFX",
    app,
    enabled: true,
    classList: "comfyui-button comfyui-menu-mobile-collapse primary",
  });
  button.iconElement.textContent = "AIFX";

  // Add a click handler
  button.element.addEventListener("click", () => {
    handleClickRender(app);
  });
  buttons.push(button);

  // load button
  const buttonLoad = new ComfyButton({
    icon: "file", // you can use an emoji or leave blank
    tooltip: "Load a file",
    app,
    enabled: true,
    classList: "comfyui-button comfyui-menu-mobile-collapse primary",
  });
  buttonLoad.iconElement.textContent = "LOAD";

  // Add a click handler
  buttonLoad.element.addEventListener("click", () => {
    handleClickLoad(app);
  });
  buttons.push(buttonLoad);


  const buttonSettings = new ComfyButton({
    icon: "wand", // you can use an emoji or leave blank
    tooltip: "AIFX Settings",
    app,
    enabled: true,
    classList: "comfyui-button comfyui-menu-mobile-collapse primary",
  });
  buttonSettings.iconElement.textContent = "⚙️";
  buttons.push(buttonSettings);
  // Create popup menu using native DOM methods
  const menuElement = document.createElement("menu");
  menuElement.style.cssText = `
    list-style: none;
    padding: 8px 0;
    margin: 0;
    min-width: 200px;
    background-color: var(--comfy-menu-bg, #1e1e1e);
    border: 1px solid var(--border-color, #444);
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  `;

  // API Key input field as first item
  const apiKeyLi = document.createElement("li");
  apiKeyLi.style.cssText = `
    padding: 8px 16px;
    border-bottom: 1px solid var(--border-color, #444);
    margin-bottom: 4px;
  `;

  const apiKeyLabel = document.createElement("label");
  apiKeyLabel.textContent = "API KEY";
  apiKeyLabel.style.cssText = `
    display: block;
    margin-bottom: 4px;
    font-size: 12px;
    color: var(--input-text, #ccc);
  `;

  const apiKeyInput = document.createElement("input");
  apiKeyInput.type = "text";
  apiKeyInput.placeholder = "Enter your API key";
  apiKeyInput.style.cssText = `
    width: 100%;
    padding: 4px 8px;
    border: 1px solid var(--border-color, #444);
    border-radius: 3px;
    background-color: var(--comfy-input-bg, #2a2a2a);
    color: var(--input-text, #ccc);
    font-size: 12px;
    margin-bottom: 8px;
  `;

  // Load saved API key from localStorage
  const savedApiKey = localStorage.getItem("aifx-api-key");
  if (savedApiKey) {
    apiKeyInput.value = savedApiKey
    console.log("created button with ",apiKeyInput.value)
  }

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.style.cssText = `
    width: 100%;
    padding: 4px 8px;
    border: 1px solid var(--border-color, #444);
    border-radius: 3px;
    background-color: var(--comfy-menu-bg, #1e1e1e);
    color: var(--input-text, #ccc);
    cursor: pointer;
    font-size: 12px;
  `;

  saveButton.addEventListener("click", () => {
    localStorage.setItem("aifx-api-key", apiKeyInput.value);
    // Visual feedback
    const originalText = saveButton.textContent;
    saveButton.textContent = "Saved!";
    saveButton.style.backgroundColor = "#4a9eff";
    setTimeout(() => {
      saveButton.textContent = originalText;
      saveButton.style.backgroundColor = "var(--comfy-menu-bg, #1e1e1e)";
    }, 1000);
  });

  saveButton.addEventListener("mouseenter", () => {
    saveButton.style.backgroundColor = "var(--comfy-menu-bg)";
  });
  saveButton.addEventListener("mouseleave", () => {
    saveButton.style.backgroundColor = "var(--comfy-menu-bg, #1e1e1e)";
  });

  apiKeyLi.appendChild(apiKeyLabel);
  apiKeyLi.appendChild(apiKeyInput);
  apiKeyLi.appendChild(saveButton);
  menuElement.appendChild(apiKeyLi);
  /* 
  // Settings menu item
  const settingsLi = document.createElement("li")
  const settingsButton = document.createElement("button")
  settingsButton.innerHTML = "⚙️ Settings (AIFX)"
  settingsButton.style.cssText = `
    width: 100%
    padding: 8px 16px
    border: none
    background: none
    text-align: left
    cursor: pointer
    display: flex
    align-items: center
    gap: 8px
  `
  settingsButton.addEventListener("click", () => {
    alert("Hello!")
  })
  settingsButton.addEventListener("mouseenter", () => {
    settingsButton.style.backgroundColor = "var(--comfy-menu-bg)"
  })
  settingsButton.addEventListener("mouseleave", () => {
    settingsButton.style.backgroundColor = "transparent"
  })
  settingsLi.appendChild(settingsButton)
  menuElement.appendChild(settingsLi)
 */
  // GitHub menu item
  const githubLi = document.createElement("li");
  const githubButton = document.createElement("button");
  githubButton.innerHTML = "Github";
  githubButton.style.cssText = `
    width: 100%;
    padding: 8px 16px;
    border: none;
    background: none;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  `;
  githubButton.addEventListener("click", () => {
    window.open("https://github.com/aifx-art", "_blank");
  });
  githubButton.addEventListener("mouseenter", () => {
    githubButton.style.backgroundColor = "var(--comfy-menu-bg)";
  });
  githubButton.addEventListener("mouseleave", () => {
    githubButton.style.backgroundColor = "transparent";
  });
  githubLi.appendChild(githubButton);
  menuElement.appendChild(githubLi);

  buttonSettings.withPopup(
    new ComfyPopup(
      {
        target: buttonSettings.element,
        classList: "aifx-top-menu",
      },
      menuElement
    ),
    "click"
  );

  // REGISTER THE BUTTON

  // Wrap in a button group (required by ComfyUI’s menu system)
  simpleButtonGroup = new ComfyButtonGroup(...buttons);

  // Insert before the settings group in the top bar
  if (app.menu?.settingsGroup?.element) {
    app.menu.settingsGroup.element.before(simpleButtonGroup.element);
  }
}

app.registerExtension({
  name: "AIFX",
  // Define commands
  //   commands: [
  //     {
  //       id: "myCommand",
  //       label: "My Command",
  //       function: () => { alert("Command executed!") }
  //     }
  //   ],
  //TODO add keybinding
  commands: [
    {
      id: "runWorkflow",
      label: "Run Workflow",
      function: () => {
        handleClickRender(app);
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
    addButtons();

    //console.log("extension running")
    //alert("Setup complete!")
  },
});

/*
// SIDEBAR
app.extensionManager.registerSidebarTab({
  id: "statefulTab",
  icon: "pi pi-list",
  title: "Notes",
  type: "custom",
  render: (el) => {
    // Create elements
    const container = document.createElement("div")
    container.style.padding = "10px"

    const notepad = document.createElement("textarea")
    notepad.style.width = "100%"
    notepad.style.height = "200px"
    notepad.style.marginBottom = "10px"

    // Load saved content if available
    const savedContent = localStorage.getItem("comfyui-notes")
    if (savedContent) {
      notepad.value = savedContent
    }

    // Auto-save content
    notepad.addEventListener("input", () => {
      localStorage.setItem("comfyui-notes", notepad.value)
    })

    // Assemble the UI
    container.appendChild(notepad)
    el.appendChild(container)
  },
})
*/
