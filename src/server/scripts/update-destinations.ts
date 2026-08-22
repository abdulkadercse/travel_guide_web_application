import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🗺️ Updating Destinations with rich descriptions, multiple gallery images, and full details...");

  const destinations = await prisma.destination.findMany();
  console.log(`Found ${destinations.length} destinations in database.`);

  for (const dest of destinations) {
    let images: string[] = [];
    let detailedDescription = "";

    const title = dest.title.toLowerCase();

    if (title.includes("cox") || title.includes("sea beach") || title.includes("inani") || title.includes("saint")) {
      images = [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      ];
      detailedDescription = `${dest.title} is world-famous as the longest unbroken natural sand beach on earth, stretching over 120 uninterrupted kilometers along the Bay of Bengal in southeastern Bangladesh.\n\nThe coastline is renowned for its dramatic sunsets, gentle sea waves, coral reef formations, and vibrant seaside night markets. Visitors can indulge in thrilling beach activities such as speed boating, parasailing, beach buggy riding, and exploring scenic Marine Drive with coastal cliffs on one side and the roaring ocean on the other.\n\nEnjoy authentic coastal dried fish (shutki), fresh grilled lobster, and live seaside music while relaxing under tropical beach umbrella loungers.`;
    } else if (title.includes("sajek") || title.includes("nilgiri") || title.includes("bandarban") || title.includes("keokradong")) {
      images = [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      ];
      detailedDescription = `${dest.title} is an ethereal mountain paradise nestled high above sea level in the Chittagong Hill Tracts. Known affectionately as the 'Kingdom of Clouds', where rolling mist blankets the emerald green hill peaks in endless waves.\n\nExperience dramatic sunrises above cloud seas from wooden cottage balconies, explore indigenous tribal villages, and trek through pristine mountain trails surrounded by dense forests. Evening campfires, indigenous bamboo-cooked cuisine, and breathtaking stargazing under unpolluted night skies make it a must-visit mountain destination.`;
    } else if (title.includes("sreemangal") || title.includes("sylhet") || title.includes("ratargul") || title.includes("jaflong") || title.includes("bichanakandi")) {
      images = [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      ];
      detailedDescription = `${dest.title} is situated in Greater Sylhet, known as the lush green tea capital and freshwater swamp capital of Bangladesh. Characterized by endless rolling tea plantations, crystal-clear mountain streams flowing from the Meghalaya hills, and dense tropical rainforest reserves.\n\nVisitors can take traditional wooden boat rides through the mystical flooded swamp forests of Ratargul, taste the famous multi-layered seven-color tea in Nilkantha Tea Cabin, and explore scenic stone quarries along turquoise riverbeds.`;
    } else {
      images = [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      ];
      detailedDescription = `${dest.title} is a premier travel highlight located in ${dest.location}, ${dest.district}. Offering extraordinary scenery, rich cultural heritage, and memorable experiences for solo explorers, families, and travel enthusiasts.\n\nDiscover scenic photography viewpoints, guided local tours, regional culinary delicacies, and historic landmarks with complete travel comfort.`;
    }

    await prisma.destination.update({
      where: { id: dest.id },
      data: {
        coverImage: images[0],
        images,
        description: detailedDescription,
      },
    });

    console.log(`Updated destination: ${dest.title} (${dest.id})`);
  }

  console.log("All destinations successfully updated in database!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
