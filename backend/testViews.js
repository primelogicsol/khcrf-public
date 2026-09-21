const http = require("http");
const views = ["MASTER_ARTISAN", "LIVING_MASTER", "HISTORICAL_MASTER", "WOMEN_ARTISAN", "EMERGING_ARTISAN", "WORKSHOP_COMMUNITY"];
async function test() {
    for (const view of views) {
        await new Promise(resolve => {
            http.get("http://localhost:4000/api/v1/artisans?view=" + view, (res) => {
                let data = "";
                res.on("data", chunk => data += chunk);
                res.on("end", () => {
                    console.log("View " + view + ": Status " + res.statusCode);
                    if (res.statusCode !== 200) console.log(data);
                    resolve();
                });
            });
        });
    }
}
test();
