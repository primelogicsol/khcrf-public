const axios = require('axios');
async function run() {
  try {
    const res = await axios.get('http://localhost:4000/api/skc/hearings/public');
    console.log(JSON.stringify(res.data.data.slice(0, 3), null, 2));
  } catch(e) {
    console.log("Error:", e.message);
  }
}
run();
