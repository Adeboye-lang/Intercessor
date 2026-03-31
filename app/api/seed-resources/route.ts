import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Clear existing books and podcasts to ensure a clean slate based on the new final list
    await prisma.book.deleteMany();
    await prisma.podcast.deleteMany();

    // 2. Insert Books
    const books = [
      {
        title: "Hallowed Be Thy Names: The Revelation of God Through His Names",
        author: "David Wilkerson",
        description: "",
        category: "Theology",
        purchaseLink: "https://www.amazon.co.uk/Hallowed-Be-Thy-Names-Essential/dp/1905044305",
        isPublished: true,
      },
      {
        title: "The Purpose and Power of the Holy Spirit",
        author: "Myles Munroe",
        description: "",
        category: "Theology",
        purchaseLink: "https://www.amazon.co.uk/Purpose-Power-Holy-Spirit-Government/dp/1641231351",
        isPublished: true,
      },
      {
        title: "Hungry for More of Jesus: The Way of Intimacy with Christ",
        author: "David Wilkerson",
        description: "",
        category: "Spiritual Growth",
        purchaseLink: "https://www.amazon.co.uk/Hungry-More-Jesus-Intimacy-Christ/dp/1905044313",
        isPublished: true,
      },
      {
        title: "The Fight: A Practical Handbook to Christian Living",
        author: "John White",
        description: "",
        category: "Spiritual Growth",
        purchaseLink: "https://www.amazon.co.uk/Fight-John-White/dp/0877847770",
        isPublished: true,
      },
      {
        title: "Gentle and Lowly",
        author: "Dane Ortlund",
        description: "",
        category: "Spiritual Growth",
        purchaseLink: "https://www.amazon.co.uk/Gentle-Lowly-Christ-Sinners-Sufferers/dp/1433566133",
        isPublished: true,
      },
      {
        title: "Good Morning, Holy Spirit",
        author: "Benny Hinn",
        description: "",
        category: "Devotional",
        purchaseLink: "https://www.amazon.co.uk/Good-Morning-Holy-Spirit-Benny/dp/0785261265",
        isPublished: true,
      },
      {
        title: "Unraveled: A Love Letter to Those Finding Their Way",
        author: "Deanna Lorea",
        description: "",
        category: "Devotional",
        purchaseLink: "https://www.amazon.co.uk/UNRAVELED-letter-those-finding-Undoing/dp/1662870779",
        isPublished: true,
      },
      {
        title: "It's Not Supposed to Be This Way",
        author: "Lysa TerKeurst",
        description: "",
        category: "Relationships",
        purchaseLink: "https://www.amazon.co.uk/Its-Not-Supposed-This-Disappointments/dp/0718039858",
        isPublished: true,
      }
    ];

    await prisma.book.createMany({ data: books });

    // 3. Insert Podcasts
    const podcasts = [
      {
        name: "The Way UK",
        host: "The Way UK",
        description: "A podcast focused on understanding God more deeply through Scripture and teaching, helping listeners build a solid foundation in truth while growing in their personal walk with Him.",
        category: "Theology",
        link: "https://www.youtube.com/@thewayuk_",
        isPublished: true,
      },
      {
        name: "Plug Pod with Stephanie Ike",
        host: "Stephanie Ike",
        description: "A teaching-driven podcast that unpacks spiritual truths and identity in Christ, helping listeners grow in understanding, purpose, and spiritual authority.",
        category: "Theology",
        link: "https://www.youtube.com/@StephanieIkeOkafor",
        isPublished: true,
      },
      {
        name: "With the Perry's",
        host: "The Perry's",
        description: "A Christ-centred conversation on faith, marriage, and everyday life. This podcast explores what it means to follow Jesus practically, especially within relationships and family.",
        category: "Spiritual Growth",
        link: "https://www.youtube.com/@WithThePerrys",
        isPublished: true,
      },
      {
        name: "Jerry Flowers Podcast",
        host: "Jerry Flowers",
        description: "Real and honest discussions about relationships, healing, and personal growth through a Christian lens. It meets people in life’s complexities while pointing them toward God’s wisdom.",
        category: "Spiritual Growth, Relationships",
        link: "https://www.youtube.com/@officialjerryflowersjr",
        isPublished: true,
      },
      {
        name: "In Totality with Megan Ashley",
        host: "Megan Ashley",
        description: "A reflective and thoughtful podcast about wholeness, healing, and identity in God, encouraging listeners to pursue a deeper, more authentic relationship with Him.",
        category: "Spiritual Growth",
        link: "https://www.youtube.com/@Immeganashley",
        isPublished: true,
      },
      {
        name: "Girls Gone Bible",
        host: "Girls Gone Bible",
        description: "A relatable and engaging podcast where faith meets real life, creating a space for honest conversations about God, identity, and navigating life as a young believer.",
        category: "Devotional",
        link: "https://www.youtube.com/@GirlsGoneBible",
        isPublished: true,
      },
      {
        name: "Saved Not Soft",
        host: "Saved Not Soft",
        description: "Bold, honest, and unfiltered conversations about living out your faith. This podcast challenges cultural norms while encouraging a deeper, uncompromising walk with Christ.",
        category: "Devotional",
        link: "https://www.youtube.com/@savednotsoft",
        isPublished: true,
      }
    ];

    await prisma.podcast.createMany({ data: podcasts });

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${books.length} books and ${podcasts.length} podcasts!`
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
