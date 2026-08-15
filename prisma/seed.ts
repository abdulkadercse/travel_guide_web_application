import { PrismaClient, UserRole, UserStatus, TransportType, ReservationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Travla BD database seed...");

  // 1. Password Hashing
  const defaultPasswordHash = await bcrypt.hash("Password123!", 10);

  // 2. Seed Users
  console.log("👤 Seeding Users...");
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@travla.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "superadmin@travla.com",
      phone: "+8801700000000",
      password: defaultPasswordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
      address: "Dhaka, Bangladesh",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@travla.com" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@travla.com",
      phone: "+8801711111111",
      password: defaultPasswordHash,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      isVerified: true,
      address: "Chittagong, Bangladesh",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
  });

  const userAyman = await prisma.user.upsert({
    where: { email: "ayman@travla.com" },
    update: {},
    create: {
      name: "Ayman Sadiq",
      email: "ayman@travla.com",
      phone: "+8801822222222",
      password: defaultPasswordHash,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      isVerified: true,
      address: "Mirpur, Dhaka",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
  });

  const userNabila = await prisma.user.upsert({
    where: { email: "nabila@travla.com" },
    update: {},
    create: {
      name: "Nabila Islam",
      email: "nabila@travla.com",
      phone: "+8801933333333",
      password: defaultPasswordHash,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      isVerified: true,
      address: "Dhanmondi, Dhaka",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    },
  });

  const userMahmud = await prisma.user.upsert({
    where: { email: "mahmud@travla.com" },
    update: {},
    create: {
      name: "Mahmud Hasan",
      email: "mahmud@travla.com",
      phone: "+8801644444444",
      password: defaultPasswordHash,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      isVerified: true,
      address: "Sylhet Sadar, Sylhet",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
    },
  });

  // Clean previous demo entries for destinations, hotels, restaurants, transportation
  await prisma.review.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.tripPlanItem.deleteMany();
  await prisma.tripPlan.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.transportation.deleteMany();

  // 3. Seed Destinations
  console.log("🏔️ Seeding Destinations...");
  const destCox = await prisma.destination.create({
    data: {
      title: "Cox's Bazar Sea Beach",
      description: "Experience the world's longest natural sandy sea beach with stunning sunrises and golden ocean horizons.",
      location: "Kolatoli Beach, Cox's Bazar",
      district: "Cox's Bazar",
      category: "Beach",
      coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
      ],
      rating: 4.9,
      price: 2500,
      isFeatured: true,
    },
  });

  const destBandarban = await prisma.destination.create({
    data: {
      title: "Nilgiri Mountain Peak",
      description: "Surround yourself above cloud level in the scenic hill tracts of Bandarban with panoramic cloudscapes.",
      location: "Thanchi Road, Bandarban",
      district: "Bandarban",
      category: "Mountain",
      coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=80",
      ],
      rating: 4.9,
      price: 3500,
      isFeatured: true,
    },
  });

  const destSylhet = await prisma.destination.create({
    data: {
      title: "Sreemangal Tea Gardens",
      description: "Explore lush green rolling tea estates, serene rainforest trails, and authentic seven-layer tea.",
      location: "Sreemangal, Moulvibazar",
      district: "Sylhet",
      category: "Nature",
      coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      ],
      rating: 4.8,
      price: 1800,
      isFeatured: true,
    },
  });

  const destSaintMartin = await prisma.destination.create({
    data: {
      title: "Saint Martin's Island",
      description: "The sole coral island of Bangladesh featuring crystal clear blue waters, coconut groves, and fresh seafood.",
      location: "Teknaf, Cox's Bazar",
      district: "Cox's Bazar",
      category: "Island",
      coverImage: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1200&q=80",
      ],
      rating: 4.9,
      price: 4500,
      isFeatured: true,
    },
  });

  const destSajek = await prisma.destination.create({
    data: {
      title: "Sajek Cloud Valley",
      description: "Witness sea of clouds right from your wooden eco-cottage balcony high in the Lushai hills.",
      location: "Sajek, Baghaichhari",
      district: "Rangamati",
      category: "Mountain",
      coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
      ],
      rating: 4.9,
      price: 3200,
      isFeatured: true,
    },
  });

  const destSundarban = await prisma.destination.create({
    data: {
      title: "Sundarbans Mangrove Forest",
      description: "UNESCO World Heritage mangrove forest home to the magnificent Royal Bengal Tiger and spotted deer.",
      location: "Mongla, Bagerhat",
      district: "Khulna",
      category: "Wildlife",
      coverImage: "https://images.unsplash.com/photo-1511497584788-876761c11969?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1511497584788-876761c11969?auto=format&fit=crop&w=1200&q=80",
      ],
      rating: 4.8,
      price: 6000,
      isFeatured: true,
    },
  });

  // 4. Seed Hotels
  console.log("🏨 Seeding Hotels...");
  const hotelSayeman = await prisma.hotel.create({
    data: {
      name: "Sayeman Beach Resort",
      location: "Marine Drive, Kolatoli, Cox's Bazar",
      description: "Luxury 5-star oceanfront resort offering infinity pool ocean views, fine dining, and private beach access.",
      pricePerNight: 8500,
      rating: 4.8,
      coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      ],
      amenities: ["Free WiFi", "Infinity Pool", "Ocean View", "Buffet Breakfast", "Spa"],
      contactPhone: "+8801755555555",
    },
  });

  const hotelNilgiri = await prisma.hotel.create({
    data: {
      name: "Nilgiri Hill Resort",
      location: "Thanchi Road, Bandarban",
      description: "Perched high in the clouds operated with top-tier security and serene mountain peak cottages.",
      pricePerNight: 5500,
      rating: 4.9,
      coverImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      ],
      amenities: ["Cloud View Balcony", "Restaurant", "24/7 Security", "Guided Tours"],
      contactPhone: "+8801766666666",
    },
  });

  const hotelGrandSultan = await prisma.hotel.create({
    data: {
      name: "Grand Sultan Tea Resort & Golf",
      location: "Sreemangal, Moulvibazar",
      description: "5-star luxury resort equipped with 9-hole golf course, heated pools, spa, and tea garden views.",
      pricePerNight: 12000,
      rating: 4.9,
      coverImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      ],
      amenities: ["Golf Course", "Heated Pool", "Spa & Wellness", "Fine Dining", "Airport Shuttle"],
      contactPhone: "+8801777777777",
    },
  });

  await prisma.hotel.create({
    data: {
      name: "Ocean Paradise Hotel & Resort",
      location: "Kolatoli Road, Cox's Bazar",
      description: "Premier beachfront resort featuring rooftop infinity pool, multi-cuisine restaurants, and sea-facing suites.",
      pricePerNight: 7500,
      rating: 4.7,
      coverImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      images: ["https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"],
      amenities: ["Free WiFi", "Rooftop Pool", "Ocean View", "Gym", "Breakfast Included"],
      contactPhone: "+8801788888888",
    },
  });

  await prisma.hotel.create({
    data: {
      name: "Royal Tulip Sea Pearl Beach Resort",
      location: "Inani Beach, Cox's Bazar",
      description: "Sprawling 15-acre luxury 5-star beachfront resort in Inani with private beach, water park, and 5 restaurants.",
      pricePerNight: 11000,
      rating: 4.9,
      coverImage: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
      images: ["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80"],
      amenities: ["Private Beach", "Water Park", "Spa", "Tennis Court", "5 Restaurants"],
      contactPhone: "+8801799999999",
    },
  });

  await prisma.hotel.create({
    data: {
      name: "DuSai Resort & Spa",
      location: "Giashnagar, Moulvibazar, Sylhet",
      description: "Boutique 5-star hill resort set inside a lush tea plantation with private villas, infinity pool, and lake.",
      pricePerNight: 9500,
      rating: 4.8,
      coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      images: ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"],
      amenities: ["Private Villa", "Infinity Pool", "Tea Garden Trail", "Spa", "Free WiFi"],
      contactPhone: "+8801811111111",
    },
  });

  await prisma.hotel.create({
    data: {
      name: "Sajek Megh Machang Eco Resort",
      location: "Ruilui Para, Sajek, Rangamati",
      description: "Charming bamboo eco-cottage on hill ridge offering unobstructed views of morning clouds and sunrise.",
      pricePerNight: 4200,
      rating: 4.9,
      coverImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
      images: ["https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80"],
      amenities: ["Balcony Cloud View", "Eco-friendly", "Campfire", "Traditional Meals"],
      contactPhone: "+8801822222222",
    },
  });

  await prisma.hotel.create({
    data: {
      name: "The Westin Dhaka",
      location: "Main Gulshan Avenue, Dhaka",
      description: "Luxury 5-star international hotel in Gulshan featuring Heavenly Spa, heated outdoor pool, and rooftop lounge.",
      pricePerNight: 14000,
      rating: 4.8,
      coverImage: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
      images: ["https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80"],
      amenities: ["Outdoor Pool", "Heavenly Spa", "Rooftop Lounge", "Airport Shuttle", "Free WiFi"],
      contactPhone: "+8801833333333",
    },
  });

  // 5. Seed Restaurants
  console.log("🍽️ Seeding Restaurants...");
  const restJhaoBon = await prisma.restaurant.create({
    data: {
      name: "Jhao Bon Seafood Restaurant",
      location: "Kolatoli Beach Road, Cox's Bazar",
      description: "Famous for authentic local fish fry, Rupchanda, crab fry, and traditional Bangladeshi thali.",
      cuisineType: "Seafood & Bangladeshi",
      priceRange: "৳৳ - ৳৳৳",
      rating: 4.8,
      coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      ],
    },
  });

  const restPanshi = await prisma.restaurant.create({
    data: {
      name: "Panshi Restaurant",
      location: "Jail Road, Sylhet",
      description: "Iconic Sylheti diner serving legendary Akhni Biryani, Duck Bhuna, and 30+ varieties of Vorta.",
      cuisineType: "Traditional Sylheti & Indian",
      priceRange: "৳৳",
      rating: 4.9,
      coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      images: [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      ],
    },
  });

  await prisma.restaurant.create({
    data: {
      name: "Handi Restaurant",
      location: "GEC Circle, Chittagong",
      description: "Celebrated destination for North Indian, Handi Mutton, Reshmi Kebab, and Garlic Naan.",
      cuisineType: "Biryani & Kebab",
      priceRange: "৳৳ - ৳৳৳",
      rating: 4.8,
      coverImage: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
      images: ["https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"],
    },
  });

  await prisma.restaurant.create({
    data: {
      name: "Star Kabab & Restaurant",
      location: "Dhanmondi 8/A, Dhaka",
      description: "Historic Dhaka eatery loved for tender Mutton Chaap, crispy Tikia, Kacchi Biryani, and Faluda.",
      cuisineType: "Traditional Bengali",
      priceRange: "৳৳",
      rating: 4.7,
      coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"],
    },
  });

  await prisma.restaurant.create({
    data: {
      name: "Kasturi Restaurant",
      location: "Purana Paltan, Dhaka",
      description: "Legendary heritage kitchen serving authentic Bengali Hilsa fish curry, Rui roast, and 20+ vortas.",
      cuisineType: "Traditional Bengali",
      priceRange: "৳৳",
      rating: 4.8,
      coverImage: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      images: ["https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80"],
    },
  });

  await prisma.restaurant.create({
    data: {
      name: "Sultan's Dine",
      location: "Gulshan 2 & Dhanmondi, Dhaka",
      description: "Dhaka's premier Kacchi feast featuring slow-cooked Basmati mutton biryani, Jali Kebab, and Borhani.",
      cuisineType: "Biryani & Kebab",
      priceRange: "৳৳৳",
      rating: 4.9,
      coverImage: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
      images: ["https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80"],
    },
  });

  await prisma.restaurant.create({
    data: {
      name: "Mermaid Beach Cafe & BBQ",
      location: "Marine Drive, Pechardwip, Cox's Bazar",
      description: "Oceanfront open-air dining with candlelit beach tables, wood-fired pizza, crab masala, and fresh seafood BBQ.",
      cuisineType: "Seafood",
      priceRange: "৳৳৳",
      rating: 4.9,
      coverImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"],
    },
  });

  await prisma.restaurant.create({
    data: {
      name: "Pach Bhai Restaurant",
      location: "Zinda Bazar, Sylhet",
      description: "Renowned traditional diner offering local delicacies, Beef with wild citrus (Shatkora), and Rui Mach.",
      cuisineType: "Traditional Bengali",
      priceRange: "৳৳",
      rating: 4.8,
      coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
      images: ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80"],
    },
  });

  // 6. Seed Transportation
  console.log("🚌 Seeding Transportation...");
  await prisma.transportation.createMany({
    data: [
      {
        type: TransportType.BUS,
        operatorName: "Green Line Paribahan (Scania Multi-Axle)",
        routeFrom: "Dhaka",
        routeTo: "Cox's Bazar",
        estimatedCost: 1800,
        duration: "8h 30m",
        scheduleTime: "10:30 PM",
      },
      {
        type: TransportType.TRAIN,
        operatorName: "Parabat Express (Snigdha AC)",
        routeFrom: "Dhaka",
        routeTo: "Sylhet",
        estimatedCost: 650,
        duration: "6h 15m",
        scheduleTime: "06:30 AM",
      },
      {
        type: TransportType.FLIGHT,
        operatorName: "Biman Bangladesh Airlines",
        routeFrom: "Dhaka",
        routeTo: "Cox's Bazar",
        estimatedCost: 4800,
        duration: "1h 00m",
        scheduleTime: "11:15 AM",
      },
      {
        type: TransportType.CAR_RENTAL,
        operatorName: "Chander Gari 4x4 SUV",
        routeFrom: "Bandarban",
        routeTo: "Nilgiri",
        estimatedCost: 3500,
        duration: "2h 00m",
        scheduleTime: "Flexible / On-Demand",
      },
    ],
  });

  // 7. Seed Reviews
  console.log("⭐ Seeding Reviews...");
  await prisma.review.create({
    data: {
      rating: 5,
      comment: "Travla made our family trip to Bandarban simple. The stay and transport were sorted in one evening!",
      userId: userAyman.id,
      destinationId: destBandarban.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: "I planned a five-day tea garden tour with the trip planner and the budget estimate was spot on.",
      userId: userNabila.id,
      destinationId: destSylhet.id,
    },
  });

  await prisma.review.create({
    data: {
      rating: 5,
      comment: "Sayeman resort ocean view balcony was unmatched. Top tier experience!",
      userId: userMahmud.id,
      hotelId: hotelSayeman.id,
    },
  });

  // 8. Seed Favorites & Reservations
  console.log("❤️ Seeding Favorites & Reservations...");
  await prisma.favorite.create({
    data: {
      userId: userAyman.id,
      destinationId: destCox.id,
    },
  });

  await prisma.reservation.create({
    data: {
      userId: userAyman.id,
      hotelId: hotelSayeman.id,
      startDate: new Date("2026-09-01"),
      endDate: new Date("2026-09-04"),
      totalCost: 25500,
      status: ReservationStatus.CONFIRMED,
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("==========================================");
  console.log("Demo Credentials:");
  console.log("Super Admin: superadmin@travla.com | Password123!");
  console.log("Admin:       admin@travla.com      | Password123!");
  console.log("User:        ayman@travla.com      | Password123!");
  console.log("==========================================");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
