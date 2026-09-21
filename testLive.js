const https = require("https");
https.get("https://khcrf.org/about/memberships/join", res => {
    let data = "";
    res.on("data", chunk => data += chunk);
    res.on("end", () => console.log(data.includes("Something went wrong") ? "CRASHED" : "OK", res.statusCode));
});
