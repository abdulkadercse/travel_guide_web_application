import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏨 Updating Hotels with rich descriptions, multiple gallery images, and full amenities...");

  const hotels = await prisma.hotel.findMany();
  console.log(`Found ${hotels.length} hotels in database.`);

  for (const hotel of hotels) {
    let images: string[] = [];
    let detailedDescription = "";
    let amenities: string[] = [];

    const name = hotel.name.toLowerCase();

    if (name.includes("sayeman") || name.includes("sea pearl") || name.includes("ocean") || name.includes("cox")) {
      images = [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
      ];
      detailedDescription = `${hotel.name} is a premier luxury beachfront destination situated directly along the world's longest natural sea beach in Cox's Bazar. Offering panoramic views of the Bay of Bengal, the property seamlessly blends contemporary elegance with legendary Bangladeshi hospitality.\n\nGuests can unwind at the signature rooftop infinity pool overlooking crashing waves, indulge in international and coastal seafood specialties at the oceanfront restaurant, or rejuvenate with therapeutic body treatments at the wellness spa. Each master suite features plush king bedding, private sea-facing balconies, soundproof glass architecture, smart entertainment systems, and luxurious marble bathrooms.\n\nWhether you are visiting for a romantic retreat, family beach holiday, or business retreat, our 24/7 dedicated concierge and certified security ensure an unforgettable coastal getaway.`;
      amenities = [
        "Ocean View Balcony",
        "Infinity Swimming Pool",
        "Free High-Speed WiFi",
        "Complimentary Buffet Breakfast",
        "24/7 Room Service & Dining",
        "Luxury Spa & Wellness Center",
        "Airport Pickup & Drop Shuttle",
        "Private Beach Access",
        "Fitness Gym & Sauna",
        "Smart 4K TV & Mini Bar",
      ];
    } else if (name.includes("nilgiri") || name.includes("sajek") || name.includes("bandarban") || name.includes("cloud")) {
      images = [
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      ];
      detailedDescription = `${hotel.name} is nestled high above the Lushai & Bandarban mountain ridges, offering an extraordinary hilltop sanctuary where clouds drift right through your private wooden balcony.\n\nConstructed with eco-friendly natural wood and indigenous bamboo architecture, the resort provides peaceful solace from urban commotion. Wake up to unobstructed 360-degree vistas of morning cloud seas and sunrises illuminating emerald green hill tracks. Evening campfires, traditional tribal barbecue dinners, and stargazing sessions are held under clear night skies.\n\nEvery cottage is equipped with cozy warm bedding, modern clean washroom facilities, solar power backups, and private decks crafted for relaxing with a warm cup of mountain tea.`;
      amenities = [
        "360° Cloud & Mountain Balcony",
        "Eco-Friendly Wooden Cottages",
        "Traditional Meals & BBQ Dinner",
        "Guided Hill Trekking Trails",
        "Campfire & Stargazing Deck",
        "24/7 Security & Caretakers",
        "Hot Water & Solar Backup",
        "Free Breakfast Included",
        "Chander Gari / 4x4 Tour Desk",
      ];
    } else if (name.includes("sultan") || name.includes("dusai") || name.includes("sylhet") || name.includes("sreemangal")) {
      images = [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      ];
      detailedDescription = `${hotel.name} is a world-class luxury resort destination sprawled across acres of lush green tea plantation hills in Greater Sylhet. Surrounded by rolling tea gardens, natural lakes, and diverse tropical wildlife, it offers the ultimate high-end eco-luxury escape.\n\nFeaturing heated outdoor swimming pools, international 9-hole golf greens, world-class Ayurvedic spa treatments, and five distinct fine dining restaurants serving authentic Sylheti Akhni, Bengali gourmet, and Continental cuisines. The private duplex villas and suites provide five-star luxury with panoramic views over the misty tea garden slopes.\n\nEnjoy guided tea tasting sessions, bird watching excursions, and tranquil cycling trails right within the resort estate.`;
      amenities = [
        "Tea Plantation & Lake Views",
        "Heated Outdoor Pools",
        "9-Hole Golf Course & Tennis",
        "Ayurvedic Spa & Wellness",
        "5 Multi-Cuisine Fine Dining",
        "High-Speed Fiber WiFi",
        "Airport & Railway Shuttle",
        "24/7 In-Room Dining Service",
        "Kids Play Zone & Game Lounge",
      ];
    } else {
      images = [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      ];
      detailedDescription = `${hotel.name} is a premier hospitality destination in ${hotel.location}, providing luxury accommodations, modern executive amenities, and personalized guest services. Designed for both leisure travelers and business guests, each room offers comfortable bedding, soundproof city/nature views, high-speed connectivity, and gourmet on-site dining.\n\nEnjoy convenient access to city shopping hubs, cultural landmarks, and transportation centers, backed by our 24-hour reception desk and dedicated hospitality staff.`;
      amenities = [
        "High-Speed Fiber WiFi",
        "Complimentary Buffet Breakfast",
        "24/7 Room Service & Dining",
        "Fitness Center & Sauna",
        "Airport Shuttle Service",
        "Executive Business Lounge",
        "Free Valet Parking",
      ];
    }

    await prisma.hotel.update({
      where: { id: hotel.id },
      data: {
        coverImage: images[0],
        images,
        description: detailedDescription,
        amenities,
      },
    });

    console.log(`Updated hotel: ${hotel.name} (${hotel.id})`);
  }

  console.log("All hotels successfully updated!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
