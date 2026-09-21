const axios = require('axios');

async function check() {
  try {
    const res = await axios.get('https://api.github.com/repos/primelogicsol/hcr_foundation_full_govind/actions/runs?per_page=5');
    const runs = res.data.workflow_runs;
    console.log("LATEST RUNS:");
    runs.forEach(run => {
      console.log(`- Commit: [${run.head_commit.id.substring(0, 7)}] "${run.head_commit.message.trim()}"`);
      console.log(`  Status: ${run.status}, Conclusion: ${run.conclusion}, Created: ${run.created_at}`);
    });
  } catch (err) {
    console.error("Error checking actions:", err.message);
  }
}

check();
