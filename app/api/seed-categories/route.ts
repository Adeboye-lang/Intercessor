import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const bookUpdates = [
      { title: 'Hallowed Be Thy Names', category: 'Theology' },
      { title: 'The Purpose and Power of the Holy Spirit', category: 'Theology' },
      { title: 'Hungry for More of Jesus', category: 'Spiritual Growth' },
      { title: 'The Fight', category: 'Spiritual Growth' },
      { title: 'Gentle and Lowly', category: 'Spiritual Growth' },
      { title: 'Good Morning, Holy Spirit', category: 'Devotional' },
      { title: 'Unraveled', category: 'Devotional' },
      { title: 'It’s Not Supposed to Be This Way', category: 'Relationships' },
    ];

    let booksUpdated = 0;
    for (const b of bookUpdates) {
      const books = await prisma.book.findMany({
        where: { title: { contains: b.title, mode: 'insensitive' } }
      });
      for (const book of books) {
        await prisma.book.update({
          where: { id: book.id },
          data: { category: b.category }
        });
        booksUpdated++;
      }
    }

    const podcastUpdates = [
      {
        name: 'The Way UK',
        category: 'Theology',
        desc: 'A podcast focused on understanding God more deeply through Scripture and teaching, helping listeners build a solid foundation in truth while growing in their personal walk with Him.'
      },
      {
        name: 'Plug Pod',
        category: 'Theology',
        desc: 'A teaching-driven podcast that unpacks spiritual truths and identity in Christ, helping listeners grow in understanding, purpose, and spiritual authority.'
      },
      {
        name: 'With the Perry',
        category: 'Spiritual Growth',
        desc: 'A Christ-centred conversation on faith, marriage, and everyday life. This podcast explores what it means to follow Jesus practically, especially within relationships and family.'
      },
      {
        name: 'Jerry Flowers',
        category: 'Relationships',
        desc: 'Real and honest discussions about relationships, healing, and personal growth through a Christian lens. It meets people in life’s complexities while pointing them toward God’s wisdom.'
      },
      {
        name: 'In Totality',
        category: 'Spiritual Growth',
        desc: 'A reflective and thoughtful podcast about wholeness, healing, and identity in God, encouraging listeners to pursue a deeper, more authentic relationship with Him.'
      },
      {
        name: 'Girls Gone Bible',
        category: 'Devotional',
        desc: 'A relatable and engaging podcast where faith meets real life, creating a space for honest conversations about God, identity, and navigating life as a young believer.'
      },
      {
        name: 'Saved Not Soft',
        category: 'Devotional',
        desc: 'Bold, honest, and unfiltered conversations about living out your faith. This podcast challenges cultural norms while encouraging a deeper, uncompromising walk with Christ.'
      }
    ];

    let podcastsUpdated = 0;
    for (const p of podcastUpdates) {
      const pods = await prisma.podcast.findMany({
        where: { name: { contains: p.name, mode: 'insensitive' } }
      });
      for (const pod of pods) {
        await prisma.podcast.update({
          where: { id: pod.id },
          data: { category: p.category, description: p.desc }
        });
        podcastsUpdated++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Database seeding complete! Updated ${booksUpdated} books and ${podcastsUpdated} podcasts.`
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
