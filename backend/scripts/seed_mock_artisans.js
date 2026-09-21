const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding mock artisans...');
  
  // Create a default craft if none exists
  let craft = await prisma.giCraft.findFirst();
  if (!craft) {
    craft = await prisma.giCraft.create({
      data: {
        craft_name: 'Kani Shawl',
        gi_status: 'Registered',
        category: 'Textiles'
      }
    });
  }

  const artisans = [
    { khcrf_master_id: 'KHCRF-MA-1001', artisan_name: 'Fayaz Ahmad Jan', district: 'Srinagar', status: 'Living', practice_status: 'Active', gender: 'Male', artisanClass: 'MASTER', primary_craft_id: craft.id },
    { khcrf_master_id: 'KHCRF-MA-1002', artisan_name: 'Ghulam Nabi Dar', district: 'Srinagar', status: 'Living', practice_status: 'Active', gender: 'Male', artisanClass: 'MASTER', primary_craft_id: craft.id },
    { khcrf_master_id: 'KHCRF-MA-1003', artisan_name: 'Ali Mohammad Beigh', district: 'Budgam', status: 'Living', practice_status: 'Active', gender: 'Male', artisanClass: 'MASTER', primary_craft_id: craft.id },
    { khcrf_master_id: 'KHCRF-MA-1004', artisan_name: 'Zarina Begum', district: 'Anantnag', status: 'Living', practice_status: 'Active', gender: 'Female', artisanClass: 'MASTER', primary_craft_id: craft.id },
    { khcrf_master_id: 'KHCRF-MA-1005', artisan_name: 'Abdul Gani Gagroo', district: 'Srinagar', status: 'Deceased', practice_status: 'Historical', gender: 'Male', artisanClass: 'MASTER', primary_craft_id: craft.id },
  ];

  for (const data of artisans) {
    await prisma.masterArtisan.upsert({
      where: { khcrf_master_id: data.khcrf_master_id },
      update: {},
      create: data
    });
  }

  console.log('Successfully seeded 5 Master Artisans!');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
