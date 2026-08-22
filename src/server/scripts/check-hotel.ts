import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hotel = await prisma.hotel.findFirst({
    where: {
      OR: [
        { id: "cmsucycvl000eyqdw0r5v449h" },
        { name: { contains: "Ocean", mode: "insensitive" } }
      ]
    }
  });

  console.log("HOTEL IN DB:", JSON.stringify(hotel, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
