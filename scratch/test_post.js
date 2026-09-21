const axios = require('axios');

async function testIndividualSuccess() {
  const email = `test-ind-${Date.now()}@example.com`;
  console.log(`\n--- Testing Individual Registration Success: ${email} ---`);
  try {
    const res = await axios.post('http://127.0.0.1:4000/api/skc/stakeholders/register', {
      fullName: "Fayaz Ahmed",
      organization: "Kashmir Crafts Guild",
      category: "Artisan / Weaver",
      designation: "Master Weaver",
      district: "Srinagar",
      craftSector: "Kani Shawl",
      email: email,
      phone: "9876543210",
      website: "https://weaver.example.com",
      participationModes: ["Online Survey", "Field Consultation"],
      consent: true,
      participationScope: "BOTH"
    });
    console.log("SUCCESS RESPONSE:", res.status, JSON.stringify(res.data, null, 2));
    return email;
  } catch (err) {
    console.log("SUCCESS ERROR:", err.response?.status, err.response?.data || err.message);
  }
}

async function testIndividualDuplicate(email) {
  console.log(`\n--- Testing Individual Registration Duplicate: ${email} ---`);
  try {
    const res = await axios.post('http://127.0.0.1:4000/api/skc/stakeholders/register', {
      fullName: "Fayaz Ahmed",
      organization: "Kashmir Crafts Guild",
      category: "Artisan / Weaver",
      designation: "Master Weaver",
      district: "Srinagar",
      craftSector: "Kani Shawl",
      email: email,
      phone: "9876543210",
      website: "https://weaver.example.com",
      participationModes: ["Online Survey"],
      consent: true,
      participationScope: "BOTH"
    });
    console.log("DUP RESPONSE (should not happen):", res.status, res.data);
  } catch (err) {
    console.log("DUP RESPONSE (expected 409):", err.response?.status, JSON.stringify(err.response?.data, null, 2));
  }
}

async function testIndividualValidation() {
  console.log(`\n--- Testing Individual Registration Validation Errors ---`);
  try {
    const res = await axios.post('http://127.0.0.1:4000/api/skc/stakeholders/register', {
      fullName: "F",
      organization: "",
      category: "",
      designation: "",
      district: "",
      craftSector: "",
      email: "not-an-email",
      phone: "",
      website: "invalid-url",
      participationModes: [],
      consent: false,
      participationScope: "INVALID_SCOPE"
    });
    console.log("VAL RESPONSE (should not happen):", res.status, res.data);
  } catch (err) {
    console.log("VAL RESPONSE (expected 400):", err.response?.status, JSON.stringify(err.response?.data, null, 2));
  }
}

async function runAll() {
  const email = await testIndividualSuccess();
  if (email) {
    await testIndividualDuplicate(email);
  }
  await testIndividualValidation();
}

runAll();
