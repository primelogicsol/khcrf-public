const https = require("https");
https.get("https://khcrf.org/about/memberships/join", res => {
    let data = "";
    res.on("data", chunk => data += chunk);
    res.on("end", () => {
        const match = data.match(/<script[^>]*src="([^"]+)"[^>]*>/g);
        console.log(match ? match.slice(0, 5) : "No scripts found");
    });
});
