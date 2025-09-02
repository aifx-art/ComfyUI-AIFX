import { app } from "../../scripts/app.js";

app.registerExtension({ 
	name: "aifx",
	async setup() {
        console.log("extension running")
		alert("Setup complete!")
	},
})