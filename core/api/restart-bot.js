const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const PID_FILE = path.join(process.cwd(), "data", "bot.pid");
const START_SCRIPT = path.join(process.cwd(), "index.js");

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
	console.log("[Restart] Bot restart initiated...");

	if (fs.existsSync(PID_FILE)) {
		try {
			const oldPid = parseInt(fs.readFileSync(PID_FILE, "utf8").trim(), 10);
			if (oldPid && !isNaN(oldPid)) {
				console.log(`[Restart] Attempting to stop old process (PID: ${oldPid})`);
				try {
					process.kill(oldPid, "SIGTERM");
				} catch (e) {
					console.log("[Restart] Old process already gone");
				}
			}
		} catch (e) {
			console.log("[Restart] Could not read old PID file");
		}
	}

	console.log("[Restart] Waiting for cleanup...");
	await sleep(2000);

	const env = { ...process.env };
	console.log(`[Restart] Starting bot from ${START_SCRIPT}...`);

	const child = spawn("node", [START_SCRIPT], {
		env,
		cwd: process.cwd(),
		stdio: "inherit",
		detached: false,
	});

	fs.writeFileSync(PID_FILE, String(child.pid));

	console.log(`[Restart] New bot started with PID: ${child.pid}`);

	child.on("exit", (code) => {
		console.log(`[Restart] Bot process exited with code ${code}`);
		process.exit(code);
	});
}

main().catch((err) => {
	console.error("[Restart] Failed to restart:", err);
	process.exit(1);
});