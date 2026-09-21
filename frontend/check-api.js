const axios = require('axios');
async function run() {
  try {
    const res = await axios.get('http://localhost:4000/api/skc/hearings/public');
    const d = res.data.data;
    console.log(JSON.stringify(d.find(e => e.code === 'HEARING_CLIMATE'), null, 2));
    console.log(JSON.stringify(d.find(e => e.code === 'SUBMISSION_DEADLINE'), null, 2));
  } catch(e) {
    console.log(e.message);
  }
}
run();
