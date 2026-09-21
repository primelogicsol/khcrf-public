const http = require("http");
async function test() {
    await new Promise(resolve => {
        http.get("http://localhost:3000/api/backend/v1/artisans?view=MASTER_ARTISAN", (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                console.log("Status: " + res.statusCode);
                console.log("Response starts with:", data.substring(0, 100));
                let json = JSON.parse(data);
                let arr = Array.isArray(json) ? json : json.data;
                console.log("Parsed array length: " + (arr ? arr.length : "undefined"));
                resolve();
            });
        });
    });
}
test();
