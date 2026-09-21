const http = require("http");
http.get("http://localhost:4000/api/v1/artisans", res => {
    let data = "";
    res.on("data", chunk => data += chunk);
    res.on("end", () => {
        const items = JSON.parse(data).data;
        console.log("Total:", items.length);
        const classes = [...new Set(items.map(i => i.artisanClass))];
        console.log("Classes:", classes);
        const statuses = [...new Set(items.map(i => i.status))];
        console.log("Statuses:", statuses);
    });
});
