const http = require("http");
async function test() {
    await new Promise(resolve => {
        http.get("http://localhost:3000/api/backend/v1/artisans?view=LIVING_MASTER", (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                console.log("Status: " + res.statusCode);
                console.log(data);
                resolve();
            });
        });
    });
}
test();
