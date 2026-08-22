import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🍽️ Updating Restaurants in Database with rich descriptions, multiple gallery images, and menu packages...");

  const restaurants = await prisma.restaurant.findMany();
  console.log(`Found ${restaurants.length} restaurants in database:`);
  restaurants.forEach(r => console.log(`- ${r.name} (${r.id})`));

  for (const rest of restaurants) {
    let images: string[] = [];
    let detailedDescription = "";
    let priceRange = rest.priceRange;

    const name = rest.name.toLowerCase();

    if (name.includes("jhao") || name.includes("seafood") || name.includes("cox")) {
      images = [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
      ];
      detailedDescription = `${rest.name} is the premier seafood dining landmark situated right by Kolatoli Beach in Cox's Bazar. Famous across Bangladesh for fresh catches brought directly from local fishing trawlers every morning, cooked with aromatic regional spices.\n\nIndulge in signature sizzling Rupchanda fish fry, spicy butter garlic crab masala, jumbo sea prawns, and steaming hot steamed rice served with 10+ varieties of coastal dry fish (Chepa, Loitta, Chhuri) vortas. Our open-air beachside dining and family AC halls offer a scenic backdrop with sea breeze and ambient seaside views.\n\nWhether dropping by after a swim in the Bay of Bengal or celebrating a special family feast, our experienced coastal chefs prepare every dish fresh to order.`;
      priceRange = "৳450 - ৳1,800";
    } else if (name.includes("panshi") || name.includes("sylhet") || name.includes("paan shi")) {
      images = [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80",
      ];
      detailedDescription = `${rest.name} is the legendary culinary heart of Sylhet, celebrated by food lovers across Bangladesh. Renowned for its aromatic Akhni Biryani, rich spicy Duck Bhuna (Haash Bhuna), and an unmatched assortment of 30+ freshly prepared traditional Bengali & Sylheti vortas.\n\nEvery morning and evening, the kitchen buzzes with traditional woodfire cooking, freshly caught Surma river fish, country chicken bhuna, and aromatic Kalo Jeera rice. The warm, vibrant hospitality and prompt service make it a must-visit destination for travelers touring the tea capital.\n\nOpen 24/7 with spacious family floors and VIP executive cabins to accommodate tour groups, families, and solo food explorers.`;
      priceRange = "৳300 - ৳1,200";
    } else if (name.includes("handi") || name.includes("kabab") || name.includes("biryani") || name.includes("star") || name.includes("dhaka") || name.includes("chittagong")) {
      images = [
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80",
      ];
      detailedDescription = `${rest.name} is an iconic destination renowned for authentic clay-pot dum biryani, melt-in-the-mouth mutton chaap, sizzling reshmi kebabs, and traditional Mughlai gourmet recipes.\n\nPrepared using heritage family recipes with slow-cooked marinated tender meats, ghee-infused basmati grains, saffron, and fresh hand-ground spices. Accompanied by crispy tandoori naans, spicy borhani, and traditional sweet Shahi Firni or Faluda for a complete royal dining experience.\n\nFeaturing elegant Mughal-inspired interiors, private dining cabins, and exceptional hospitality tailored for family dinners and celebratory banquets.`;
      priceRange = "৳400 - ৳1,600";
    } else {
      images = [
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80",
      ];
      detailedDescription = `${rest.name} is an esteemed dining establishment in ${rest.location}, offering a rich selection of authentic regional delicacies, fresh grills, and multi-cuisine favorites.\n\nEvery dish is crafted by skilled culinary chefs using locally sourced fresh produce, premium cuts, and traditional secret spices. With cozy welcoming ambiance, quick table service, and dedicated family seating, it provides an exquisite culinary experience for residents and tourists alike.`;
      priceRange = "৳350 - ৳1,400";
    }

    await prisma.restaurant.update({
      where: { id: rest.id },
      data: {
        coverImage: images[0],
        images,
        description: detailedDescription,
        priceRange,
      },
    });

    console.log(`Updated restaurant: ${rest.name} (${rest.id})`);
  }

  console.log("All restaurants successfully updated in database!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
