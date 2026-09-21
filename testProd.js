const fetch = require("node-fetch");
fetch("http://localhost:3000/state-of-kashmir-crafts/public-hearings")
    .then(res => res.text())
    .then(text => console.log(text.includes("Something went wrong") ? "CRASHED" : "OK"))
    .catch(console.error);
