import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌍 Seeding Orbitra database...");

  // ── Countries ──────────────────────────────
  const countries = await Promise.all([
    prisma.country.upsert({
      where: { code: "US" },
      update: {},
      create: { code: "US", name: "United States", flagEmoji: "🇺🇸", continent: "North America" },
    }),
    prisma.country.upsert({
      where: { code: "RU" },
      update: {},
      create: { code: "RU", name: "Russia", flagEmoji: "🇷🇺", continent: "Europe" },
    }),
    prisma.country.upsert({
      where: { code: "CN" },
      update: {},
      create: { code: "CN", name: "China", flagEmoji: "🇨🇳", continent: "Asia" },
    }),
    prisma.country.upsert({
      where: { code: "IN" },
      update: {},
      create: { code: "IN", name: "India", flagEmoji: "🇮🇳", continent: "Asia" },
    }),
    prisma.country.upsert({
      where: { code: "JP" },
      update: {},
      create: { code: "JP", name: "Japan", flagEmoji: "🇯🇵", continent: "Asia" },
    }),
    prisma.country.upsert({
      where: { code: "FR" },
      update: {},
      create: { code: "FR", name: "France", flagEmoji: "🇫🇷", continent: "Europe" },
    }),
    prisma.country.upsert({
      where: { code: "GB" },
      update: {},
      create: { code: "GB", name: "United Kingdom", flagEmoji: "🇬🇧", continent: "Europe" },
    }),
    prisma.country.upsert({
      where: { code: "DE" },
      update: {},
      create: { code: "DE", name: "Germany", flagEmoji: "🇩🇪", continent: "Europe" },
    }),
    prisma.country.upsert({
      where: { code: "CA" },
      update: {},
      create: { code: "CA", name: "Canada", flagEmoji: "🇨🇦", continent: "North America" },
    }),
    prisma.country.upsert({
      where: { code: "BR" },
      update: {},
      create: { code: "BR", name: "Brazil", flagEmoji: "🇧🇷", continent: "South America" },
    }),
    prisma.country.upsert({
      where: { code: "AU" },
      update: {},
      create: { code: "AU", name: "Australia", flagEmoji: "🇦🇺", continent: "Oceania" },
    }),
    prisma.country.upsert({
      where: { code: "IT" },
      update: {},
      create: { code: "IT", name: "Italy", flagEmoji: "🇮🇹", continent: "Europe" },
    }),
    prisma.country.upsert({
      where: { code: "ES" },
      update: {},
      create: { code: "ES", name: "Spain", flagEmoji: "🇪🇸", continent: "Europe" },
    }),
    prisma.country.upsert({
      where: { code: "KR" },
      update: {},
      create: { code: "KR", name: "South Korea", flagEmoji: "🇰🇷", continent: "Asia" },
    }),
    prisma.country.upsert({
      where: { code: "IL" },
      update: {},
      create: { code: "IL", name: "Israel", flagEmoji: "🇮🇱", continent: "Asia" },
    }),
  ]);

  console.log(`  ✅ ${countries.length} countries seeded`);

  // ── Organizations ──────────────────────────
  const orgs = await Promise.all([
    prisma.organization.upsert({
      where: { id: "nasa" },
      update: {},
      create: { id: "nasa", name: "NASA", countryCode: "US", type: "Government" },
    }),
    prisma.organization.upsert({
      where: { id: "spacex" },
      update: {},
      create: { id: "spacex", name: "SpaceX", countryCode: "US", type: "Commercial" },
    }),
    prisma.organization.upsert({
      where: { id: "roscosmos" },
      update: {},
      create: { id: "roscosmos", name: "Roscosmos", countryCode: "RU", type: "Government" },
    }),
    prisma.organization.upsert({
      where: { id: "cnsa" },
      update: {},
      create: { id: "cnsa", name: "CNSA", countryCode: "CN", type: "Government" },
    }),
    prisma.organization.upsert({
      where: { id: "esa" },
      update: {},
      create: { id: "esa", name: "European Space Agency", countryCode: "FR", type: "Government" },
    }),
    prisma.organization.upsert({
      where: { id: "isro" },
      update: {},
      create: { id: "isro", name: "ISRO", countryCode: "IN", type: "Government" },
    }),
    prisma.organization.upsert({
      where: { id: "jaxa" },
      update: {},
      create: { id: "jaxa", name: "JAXA", countryCode: "JP", type: "Government" },
    }),
    prisma.organization.upsert({
      where: { id: "planet" },
      update: {},
      create: { id: "planet", name: "Planet Labs", countryCode: "US", type: "Commercial" },
    }),
    prisma.organization.upsert({
      where: { id: "oneweb" },
      update: {},
      create: { id: "oneweb", name: "OneWeb", countryCode: "GB", type: "Commercial" },
    }),
    prisma.organization.upsert({
      where: { id: "iridium" },
      update: {},
      create: { id: "iridium", name: "Iridium Communications", countryCode: "US", type: "Commercial" },
    }),
  ]);

  console.log(`  ✅ ${orgs.length} organizations seeded`);

  // ── Constellations ─────────────────────────
  const constellations = await Promise.all([
    prisma.constellation.upsert({
      where: { name: "Starlink" },
      update: {},
      create: { name: "Starlink", operator: "SpaceX", totalSats: 42000, purpose: "Broadband Internet" },
    }),
    prisma.constellation.upsert({
      where: { name: "OneWeb" },
      update: {},
      create: { name: "OneWeb", operator: "OneWeb", totalSats: 648, purpose: "Broadband Internet" },
    }),
    prisma.constellation.upsert({
      where: { name: "GPS" },
      update: {},
      create: { name: "GPS", operator: "US Space Force", totalSats: 31, purpose: "Navigation" },
    }),
    prisma.constellation.upsert({
      where: { name: "Iridium" },
      update: {},
      create: { name: "Iridium", operator: "Iridium Communications", totalSats: 66, purpose: "Communication" },
    }),
    prisma.constellation.upsert({
      where: { name: "PlanetScope" },
      update: {},
      create: { name: "PlanetScope", operator: "Planet Labs", totalSats: 200, purpose: "Earth Observation" },
    }),
  ]);

  console.log(`  ✅ ${constellations.length} constellations seeded`);

  // ── Launch Sites ────────────────────────────
  const sites = await Promise.all([
    prisma.launchSite.upsert({
      where: { name: "Cape Canaveral SLC-40" },
      update: {},
      create: { name: "Cape Canaveral SLC-40", countryCode: "US", latitude: 28.5621, longitude: -80.5772 },
    }),
    prisma.launchSite.upsert({
      where: { name: "Kennedy Space Center LC-39A" },
      update: {},
      create: { name: "Kennedy Space Center LC-39A", countryCode: "US", latitude: 28.6082, longitude: -80.6040 },
    }),
    prisma.launchSite.upsert({
      where: { name: "Vandenberg SLC-3E" },
      update: {},
      create: { name: "Vandenberg SLC-3E", countryCode: "US", latitude: 34.6440, longitude: -120.5895 },
    }),
    prisma.launchSite.upsert({
      where: { name: "Baikonur Cosmodrome" },
      update: {},
      create: { name: "Baikonur Cosmodrome", countryCode: "RU", latitude: 45.9646, longitude: 63.3051 },
    }),
    prisma.launchSite.upsert({
      where: { name: "Jiuquan Satellite Launch Center" },
      update: {},
      create: { name: "Jiuquan Satellite Launch Center", countryCode: "CN", latitude: 40.9580, longitude: 100.2910 },
    }),
    prisma.launchSite.upsert({
      where: { name: "Satish Dhawan Space Centre" },
      update: {},
      create: { name: "Satish Dhawan Space Centre", countryCode: "IN", latitude: 13.7200, longitude: 80.2300 },
    }),
    prisma.launchSite.upsert({
      where: { name: "Guiana Space Centre" },
      update: {},
      create: { name: "Guiana Space Centre", countryCode: "FR", latitude: 5.2371, longitude: -52.7607 },
    }),
  ]);

  console.log(`  ✅ ${sites.length} launch sites seeded`);

  // ── Sample Satellite ────────────────────────
  const landsat9 = await prisma.satellite.upsert({
    where: { noradId: 49260 },
    update: {},
    create: {
      noradId: 49260,
      name: "Landsat 9",
      intlDesignator: "2021-083A",
      objectType: "PAYLOAD",
      orbitalClass: "LEO",
      orbitalRegime: "SSO",
      dryMass: 2711,
      launchMass: 2870,
      power: 4300,
      missionType: "EARTH_OBSERVATION",
      missionDescription: "Earth observation satellite providing moderate-resolution imagery for land monitoring.",
      purpose: "Land surface monitoring, agriculture, forestry, water resource management",
      countryCode: "US",
      organizationId: "nasa",
      manufacturer: "Northrop Grumman",
      launchDate: new Date("2021-09-27T18:12:00Z"),
      launchVehicle: "Atlas V 401",
      launchSite: "Vandenberg SLC-3E",
      period: 98.8,
      inclination: 98.2,
      apogee: 708,
      perigee: 702,
      eccentricity: 0.0004,
      semiMajorAxis: 7076,
      isActive: true,
      funFacts: JSON.stringify([
        "Landsat 9 can detect 16,384 shades of color — far beyond what the human eye can see.",
        "The Landsat program is the longest-running continuous space-based Earth observation mission (since 1972).",
        "Each Landsat 9 image covers 185 × 185 km — about the size of Belgium.",
        "Landsat data is freely available and has been cited in over 100,000 scientific papers.",
        "Landsat 9 was launched on the same rocket model that sent the Curiosity rover to Mars.",
      ]),
    },
  });

  console.log(`  ✅ Sample satellite: ${landsat9.name} (NORAD ${landsat9.noradId})`);

  // ── Launch Events ────────────────────────────
  const events = await Promise.all([
    prisma.launchEvent.upsert({
      where: { id: "sputnik-1" },
      update: {},
      create: {
        id: "sputnik-1",
        name: "Sputnik 1",
        date: new Date("1957-10-04T19:28:34Z"),
        countryCode: "RU",
        vehicle: "Sputnik 8K71PS",
        site: "Baikonur Cosmodrome",
        success: true,
        description: "The first artificial Earth satellite. Marked the beginning of the Space Age.",
      },
    }),
    prisma.launchEvent.upsert({
      where: { id: "apollo-11" },
      update: {},
      create: {
        id: "apollo-11",
        name: "Apollo 11",
        date: new Date("1969-07-16T13:32:00Z"),
        countryCode: "US",
        vehicle: "Saturn V",
        site: "Kennedy Space Center LC-39A",
        success: true,
        description: "First crewed Moon landing mission. Neil Armstrong and Buzz Aldrin walked on the Moon.",
      },
    }),
    prisma.launchEvent.upsert({
      where: { id: "iss-zarya" },
      update: {},
      create: {
        id: "iss-zarya",
        name: "Zarya — First ISS Module",
        date: new Date("1998-11-20T00:00:00Z"),
        countryCode: "RU",
        vehicle: "Proton-K",
        site: "Baikonur Cosmodrome",
        success: true,
        description: "Launch of Zarya, the first module of the International Space Station.",
      },
    }),
    prisma.launchEvent.upsert({
      where: { id: "starlink-v1" },
      update: {},
      create: {
        id: "starlink-v1",
        name: "Starlink v1.0 Launch",
        date: new Date("2019-11-11T14:56:00Z"),
        countryCode: "US",
        vehicle: "Falcon 9",
        site: "Cape Canaveral SLC-40",
        success: true,
        description: "First operational Starlink mission. 60 satellites deployed for broadband internet.",
      },
    }),
  ]);

  console.log(`  ✅ ${events.length} launch events seeded`);

  console.log("\n🚀 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
