const axios = require('axios');

async function check() {
  try {
    const res = await axios.get('https://hub.docker.com/v2/repositories/faiz443/hcrf/tags');
    const tags = res.data.results;
    console.log("DOCKER HUB TAGS:");
    tags.forEach(tag => {
      console.log(`- Tag: ${tag.name}, Last Updated: ${tag.last_updated}, Size: ${tag.full_size}`);
    });
  } catch (err) {
    console.error("Error checking Docker Hub:", err.message);
  }
}

check();
