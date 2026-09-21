const http = require("http");
http.get("http://localhost:4000/api/partner/registry", res => {
    console.log(res.statusCode);
});
