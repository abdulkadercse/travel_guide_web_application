import path from "path";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { PrismaClient, TransportType, UserRole, UserStatus } from "@prisma/client";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const prisma = new PrismaClient();
const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || "12");

/** Images that ship with the repo, so seeded data renders without any external host. */
const IMAGES = [
  "/images/coxs-bazar.jpg",
  "/images/bandarban.jpg",
  "/images/sylhet.jpg",
  "/images/paharpur.jpg",
  "/images/bg-travel.jpg",
];

const image = (i: number): string => IMAGES[i % IMAGES.length];

const users = [
  {
    name: "Super Admin",
    email: "superadmin@travla.com",
    phone: "01700000001",
    password: "SuperAdmin123",
    address: "Dhaka, Bangladesh",
    role: UserRole.SUPER_ADMIN,
  },
  {
    name: "Site Admin",
    email: "admin@travla.com",
    phone: "01700000002",
    password: "Admin123",
    address: "Dhaka, Bangladesh",
    role: UserRole.ADMIN,
  },
  {
    name: "Abdul Kader",
    email: "kader@travla.com",
    phone: "01700000003",
    password: "User123",
    address: "Chattogram, Bangladesh",
    role: UserRole.USER,
  },
  {
    name: "Nusrat Jahan",
    email: "nusrat@travla.com",
    phone: "01700000004",
    password: "User123",
    address: "Sylhet, Bangladesh",
    role: UserRole.USER,
  },
  {
    name: "Rakib Hasan",
    email: "rakib@travla.com",
    phone: "01700000005",
    password: "User123",
    address: "Khulna, Bangladesh",
    role: UserRole.USER,
  },
];

const destinations = [
  {
    title: "Cox's Bazar Sea Beach",
    description:
      "The longest natural sea beach in the world, stretching 120 km along the Bay of Bengal with golden sand, gentle waves and unforgettable sunsets.",
    location: "Cox's Bazar Sadar",
    district: "Cox's Bazar",
    category: "Beach",
    price: 2500,
    isFeatured: true,
  },
  {
    title: "Nilgiri Hills",
    description:
      "One of the highest peaks in Bangladesh, where clouds drift below the resort cottages and the sunrise over the hill ranges is unmatched.",
    location: "Thanchi Road",
    district: "Bandarban",
    category: "Hill",
    price: 3200,
    isFeatured: true,
  },
  {
    title: "Ratargul Swamp Forest",
    description:
      "The only freshwater swamp forest in Bangladesh. Paddle a wooden boat through submerged trees during the monsoon season.",
    location: "Gowainghat",
    district: "Sylhet",
    category: "Forest",
    price: 1800,
    isFeatured: true,
  },
  {
    title: "Somapura Mahavihara, Paharpur",
    description:
      "A UNESCO World Heritage Site and one of the largest Buddhist monasteries south of the Himalayas, dating back to the 8th century.",
    location: "Paharpur",
    district: "Naogaon",
    category: "Historical",
    price: 1200,
    isFeatured: true,
  },
  {
    title: "Sajek Valley",
    description:
      "Known as the queen of hills, Sajek sits above the clouds with panoramic views of the Kasalong range and traditional tribal villages.",
    location: "Baghaichhari",
    district: "Rangamati",
    category: "Hill",
    price: 3500,
    isFeatured: true,
  },
  {
    title: "The Sundarbans",
    description:
      "The largest mangrove forest on earth and home of the Royal Bengal Tiger, explored by launch through a maze of tidal rivers.",
    location: "Mongla",
    district: "Khulna",
    category: "Wildlife",
    price: 6500,
    isFeatured: true,
  },
  {
    title: "Srimangal Tea Gardens",
    description:
      "The tea capital of Bangladesh, with rolling green estates, the famous seven-layer tea and the Lawachara rainforest nearby.",
    location: "Srimangal",
    district: "Moulvibazar",
    category: "Nature",
    price: 2200,
    isFeatured: false,
  },
  {
    title: "Kuakata Sea Beach",
    description:
      "The panoramic sea beach where both sunrise and sunset can be watched from the same shoreline.",
    location: "Kalapara",
    district: "Patuakhali",
    category: "Beach",
    price: 2000,
    isFeatured: false,
  },
];

const hotels = [
  {
    name: "Sayeman Beach Resort",
    location: "Cox's Bazar",
    description:
      "Beachfront resort with sea-view rooms, an outdoor pool and direct access to the Cox's Bazar shoreline.",
    pricePerNight: 8500,
    amenities: ["Free WiFi", "Swimming Pool", "Sea View", "Breakfast", "Parking"],
    contactPhone: "01810000001",
  },
  {
    name: "Hotel Hillview Bandarban",
    location: "Bandarban",
    description:
      "Quiet hillside hotel a short drive from Nilgiri, with balcony rooms overlooking the Sangu river valley.",
    pricePerNight: 4200,
    amenities: ["Free WiFi", "Hill View", "Restaurant", "Parking"],
    contactPhone: "01810000002",
  },
  {
    name: "Grand Sylhet Hotel",
    location: "Sylhet",
    description:
      "Business-class hotel in the city centre, convenient for Ratargul, Jaflong and the tea estates.",
    pricePerNight: 6000,
    amenities: ["Free WiFi", "Gym", "Restaurant", "Airport Shuttle", "Breakfast"],
    contactPhone: "01810000003",
  },
  {
    name: "Sajek Resort House",
    location: "Rangamati",
    description:
      "Wooden cottages above the clouds in Sajek valley with a shared bonfire deck and sunrise viewpoint.",
    pricePerNight: 5000,
    amenities: ["Bonfire", "Valley View", "Breakfast", "Guide Service"],
    contactPhone: "01810000004",
  },
];

const restaurants = [
  {
    name: "Poushee Restaurant",
    location: "Cox's Bazar",
    cuisineType: "Bangladeshi",
    description:
      "Long-running seafood kitchen famous for coral fish barbecue and traditional Bengali thali.",
    priceRange: "500-1200 BDT",
  },
  {
    name: "Panshi Restaurant",
    location: "Sylhet",
    cuisineType: "Bangladeshi",
    description:
      "Sylhet institution serving over sixty items daily, best known for satkora beef and hilsa curry.",
    priceRange: "300-900 BDT",
  },
  {
    name: "Cafe Aroma",
    location: "Bandarban",
    cuisineType: "Continental",
    description:
      "Hillside cafe with strong coffee, sandwiches and a terrace facing the Sangu river.",
    priceRange: "250-700 BDT",
  },
  {
    name: "Nilkantha Tea Cabin",
    location: "Srimangal",
    cuisineType: "Cafe",
    description:
      "Home of the original seven-layer tea, tucked between the tea estates of Srimangal.",
    priceRange: "100-400 BDT",
  },
];

const transportations = [
  {
    type: TransportType.BUS,
    operatorName: "Green Line Paribahan",
    routeFrom: "Dhaka",
    routeTo: "Cox's Bazar",
    estimatedCost: 2000,
    duration: "10h 30m",
    scheduleTime: "08:00 PM",
  },
  {
    type: TransportType.BUS,
    operatorName: "Shyamoli Paribahan",
    routeFrom: "Dhaka",
    routeTo: "Bandarban",
    estimatedCost: 1100,
    duration: "9h 00m",
    scheduleTime: "09:30 PM",
  },
  {
    type: TransportType.TRAIN,
    operatorName: "Parabat Express",
    routeFrom: "Dhaka",
    routeTo: "Sylhet",
    estimatedCost: 650,
    duration: "6h 30m",
    scheduleTime: "06:30 AM",
  },
  {
    type: TransportType.TRAIN,
    operatorName: "Sundarban Express",
    routeFrom: "Dhaka",
    routeTo: "Khulna",
    estimatedCost: 700,
    duration: "8h 15m",
    scheduleTime: "08:15 AM",
  },
  {
    type: TransportType.FLIGHT,
    operatorName: "Biman Bangladesh Airlines",
    routeFrom: "Dhaka",
    routeTo: "Cox's Bazar",
    estimatedCost: 5500,
    duration: "1h 05m",
    scheduleTime: "10:45 AM",
  },
  {
    type: TransportType.CAR_RENTAL,
    operatorName: "Travla Car Rental",
    routeFrom: "Sylhet",
    routeTo: "Srimangal",
    estimatedCost: 3500,
    duration: "2h 00m",
    scheduleTime: "On demand",
  },
];

async function seedUsers(): Promise<void> {
  for (const user of users) {
    const hashed = await bcrypt.hash(user.password, saltRounds);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        status: UserStatus.ACTIVE,
        isVerified: true,
      },
      create: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        password: hashed,
        address: user.address,
        role: user.role,
        status: UserStatus.ACTIVE,
        isVerified: true,
      },
    });
  }
  console.info(`Seeded ${users.length} users`);
}

async function seedDestinations(): Promise<void> {
  for (const [index, destination] of destinations.entries()) {
    const existing = await prisma.destination.findFirst({
      where: { title: destination.title },
    });

    const data = {
      ...destination,
      coverImage: image(index),
      images: [image(index), image(index + 1), image(index + 2)],
    };

    if (existing) {
      await prisma.destination.update({ where: { id: existing.id }, data });
    } else {
      await prisma.destination.create({ data });
    }
  }
  console.info(`Seeded ${destinations.length} destinations`);
}

async function seedHotels(): Promise<void> {
  for (const [index, hotel] of hotels.entries()) {
    const existing = await prisma.hotel.findFirst({ where: { name: hotel.name } });

    const data = {
      ...hotel,
      coverImage: image(index + 1),
      images: [image(index + 1), image(index + 3)],
    };

    if (existing) {
      await prisma.hotel.update({ where: { id: existing.id }, data });
    } else {
      await prisma.hotel.create({ data });
    }
  }
  console.info(`Seeded ${hotels.length} hotels`);
}

async function seedRestaurants(): Promise<void> {
  for (const [index, restaurant] of restaurants.entries()) {
    const existing = await prisma.restaurant.findFirst({ where: { name: restaurant.name } });

    const data = {
      ...restaurant,
      coverImage: image(index + 2),
      images: [image(index + 2), image(index + 4)],
    };

    if (existing) {
      await prisma.restaurant.update({ where: { id: existing.id }, data });
    } else {
      await prisma.restaurant.create({ data });
    }
  }
  console.info(`Seeded ${restaurants.length} restaurants`);
}

async function seedTransportations(): Promise<void> {
  for (const transportation of transportations) {
    const existing = await prisma.transportation.findFirst({
      where: {
        operatorName: transportation.operatorName,
        routeFrom: transportation.routeFrom,
        routeTo: transportation.routeTo,
      },
    });

    if (existing) {
      await prisma.transportation.update({
        where: { id: existing.id },
        data: transportation,
      });
    } else {
      await prisma.transportation.create({ data: transportation });
    }
  }
  console.info(`Seeded ${transportations.length} transportations`);
}

async function seedReviews(): Promise<void> {
  const reviewers = await prisma.user.findMany({
    where: { role: UserRole.USER },
    orderBy: { createdAt: "asc" },
  });
  const targets = await prisma.destination.findMany({
    orderBy: { createdAt: "asc" },
    take: 3,
  });

  if (reviewers.length === 0 || targets.length === 0) return;

  const samples = [
    { rating: 5, comment: "Absolutely worth the trip. Well organised and beautiful." },
    { rating: 4, comment: "Great experience overall, though it gets crowded in season." },
    { rating: 5, comment: "The views were unreal. Would happily go back next year." },
  ];

  let created = 0;

  for (const [index, target] of targets.entries()) {
    const reviewer = reviewers[index % reviewers.length];
    const sample = samples[index % samples.length];

    const existing = await prisma.review.findFirst({
      where: { userId: reviewer.id, destinationId: target.id },
    });
    if (existing) continue;

    await prisma.review.create({
      data: {
        rating: sample.rating,
        comment: sample.comment,
        userId: reviewer.id,
        destinationId: target.id,
      },
    });
    created += 1;
  }

  // Keep the denormalised rating column in step with the seeded reviews.
  for (const target of targets) {
    const aggregate = await prisma.review.aggregate({
      where: { destinationId: target.id },
      _avg: { rating: true },
    });
    await prisma.destination.update({
      where: { id: target.id },
      data: { rating: Number((aggregate._avg.rating ?? 0).toFixed(1)) },
    });
  }

  console.info(`Seeded ${created} reviews`);
}

async function main(): Promise<void> {
  console.info("Seeding the Travel Guide database...\n");

  await seedUsers();
  await seedDestinations();
  await seedHotels();
  await seedRestaurants();
  await seedTransportations();
  await seedReviews();

  console.info("\nSeeding complete. Demo accounts:");
  console.table(
    users.map((user) => ({
      role: user.role,
      email: user.email,
      password: user.password,
    }))
  );
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
