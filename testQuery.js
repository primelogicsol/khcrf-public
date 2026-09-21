const http = require("http");
http.get("http://localhost:3000/api/backend/v1/artisans?view=MASTER_ARTISAN", res => {
    let data = "";
    res.on("data", chunk => data += chunk);
    res.on("end", () => console.log("Status:", res.statusCode, "Data length:", JSON.parse(data).data?.length));
});
