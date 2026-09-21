const http = require("http");
const views = ["ALL", "MASTER_ARTISAN", "LIVING_MASTER", "HISTORICAL_MASTER", "WOMEN_ARTISAN", "EMERGING_ARTISAN", "WORKSHOP_COMMUNITY"];
async function test() {
    for (const view of views) {
        await new Promise(resolve => {
            http.get("http://localhost:3000/api/backend/v1/artisans?view=" + view, (res) => {
                let data = "";
                res.on("data", chunk => data += chunk);
                res.on("end", () => {
                    let json = JSON.parse(data);
                    let arr = Array.isArray(json) ? json : json.data;
                    console.log("View " + view + ": " + (arr ? arr.length : "undefined"));
                    resolve();
                });
            });
        });
    }
}
test();
