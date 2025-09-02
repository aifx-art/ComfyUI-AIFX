import { app } from "/scripts/app.js";

app.registerExtension({
    name: "test",
    async setup() {
        console.log("[My Extension] Loaded!");

        // Add a button to the toolbar
        const toolbar = document.querySelector("#comfy-toolbar");
        if (toolbar) {
            const btn = document.createElement("button");
            btn.innerText = "Click Me!";
            btn.onclick = () => alert("Hello from My Extension!");
            toolbar.appendChild(btn);
        }
    }
});
