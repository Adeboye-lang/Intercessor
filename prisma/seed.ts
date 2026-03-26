import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  DEFAULT_PUBLIC_DISCLAIMER,
  FOOTER_DISCLAIMER_KEY,
  LEGACY_PUBLIC_DISCLAIMER,
} from '../lib/public-site-content';

const prisma = new PrismaClient();

const booksData = [
  {
    title: "Hungry for more of Jesus: The way of intimacy with Christ",
    author: "David Wilkerson",
    description: "",
    purchaseLink:
      "https://www.amazon.co.uk/Hungry-More-Jesus-Intimacy-Christ/dp/1905044313/ref=pd_lpo_d_sccl_1/520-1980280-0273469?pd_rd_w=lDI43&content-id=amzn1.sym.bb13d3fc-af40-4fff-a822-e0e4c415da96&pf_rd_p=bb13d3fc-af40-4fff-a822-e0e4c415da96&pf_rd_r=GMHB6J2ZAAQNPE12XP3J&pd_rd_wg=tbhb1&pd_rd_r=d63a72de-5544-4144-89a9-85c8c54407e4&pd_rd_i=1905044313&psc=1",
    isPublished: true,
  },
  {
    title: "The fight: A Practical Handbook to Christian Living",
    author: "John White",
    description: "",
    purchaseLink: "https://www.amazon.co.uk/Fight-John-White/dp/0877847770",
    isPublished: true,
  },
  {
    title: "Unraveled: A love letter to those finding their way",
    author: "Undoing",
    description: "",
    purchaseLink:
      "https://www.amazon.co.uk/UNRAVELED-letter-those-finding-Undoing/dp/1662870779/ref=sr_1_1?crid=2T9H9MZYFLHH2&dib=eyJ2IjoiMSJ9.y1l5Bg2EgVQX9eI_Ii-S2C02n_WAO4EbATbwEwr-3UQ.tBaIaTbEBG5NRsUtC4SpDeMNmUnjNtWLfn-_7lkJlP4&dib_tag=se&keywords=%E2%80%A2+Unraveled%3A+A+love+letter+to+those+finding+their+way&qid=1773849455&s=books&sprefix=unraveled+a+love+letter+to+those+finding+their+way+%2Cstripbooks%2C215&sr=1-1",
    isPublished: true,
  },
  {
    title: "Hallowed be thy names: The revelation of God through his names",
    author: "Unknown",
    description: "",
    purchaseLink:
      "https://www.amazon.co.uk/Hallowed-Be-Thy-Names-Essential/dp/1905044305/ref=sr_1_1?crid=278H84TJBRP2X&dib=eyJ2IjoiMSJ9.P5lIUnWHXEicWGQpA77SehAq85xVHJjyYI_aKWshnjA.Vihkx62rkCM2eLtrWh3QzIO0339tMldvxXaV6XRbglU&dib_tag=se&keywords=%E2%80%A2+Hallowed+be+thy+names%3A+The+revelation+of+God+through+his+names&qid=1773849490&sprefix=hallowed+be+thy+names+the+revelation+of+god+through+his+names%2Caps%2C307&sr=8-1",
    isPublished: true,
  },
  {
    title: "Good morning Holy Spirit",
    author: "Benny Hinn",
    description: "",
    purchaseLink: "https://www.amazon.co.uk/Good-Morning-Holy-Spirit-Benny/dp/0785261265",
    isPublished: true,
  },
  {
    title: "The purpose and power of the holy spirit",
    author: "Miles Munroe",
    description: "",
    purchaseLink: "https://www.amazon.co.uk/Purpose-Power-Holy-Spirit-Government/dp/1641231351",
    isPublished: true,
  },
  {
    title: "Gentle Lowly",
    author: "Dane Ortlund",
    description: "",
    purchaseLink: "https://www.amazon.co.uk/Gentle-Lowly-Christ-Sinners-Sufferers/dp/1433566133",
    isPublished: true,
  },
  {
    title: "It's not supposed to be this way",
    author: "Lysa Terkeurst",
    description: "",
    purchaseLink: "https://www.amazon.co.uk/Its-Not-Supposed-This-Disappointments/dp/0718039858",
    isPublished: true,
  },
];

const podcastsData = [
  {
    name: "The way UK",
    host: "The Way UK",
    description: "",
    link: "https://www.youtube.com/@thewayuk_",
    isPublished: true,
  },
  {
    name: "With the Perry's",
    host: "Jackie & Preston Perry",
    description: "",
    link: "https://www.youtube.com/@WithThePerrys",
    isPublished: true,
  },
  {
    name: "Jerry Flowers podcast",
    host: "Jerry Flowers Jr",
    description: "",
    link: "https://www.youtube.com/@officialjerryflowersjr",
    isPublished: true,
  },
  {
    name: "Girls gone bible",
    host: "Girls Gone Bible",
    description: "",
    link: "https://www.youtube.com/@GirlsGoneBible",
    isPublished: true,
  },
  {
    name: "Saved not soft",
    host: "Saved Not Soft",
    description: "",
    link: "https://www.youtube.com/@savednotsoft",
    isPublished: true,
  },
  {
    name: "Plug pod with Stephanie Ike",
    host: "Stephanie Ike",
    description: "",
    link: "https://www.youtube.com/@StephanieIkeOkafor",
    isPublished: true,
  },
  {
    name: "In totality with Megan Ashley",
    host: "Megan Ashley",
    description: "",
    link: "https://www.youtube.com/@Immeganashley",
    isPublished: true,
  },
];

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: 'admin@intercessor.com' },
    update: {},
    create: { email: 'admin@intercessor.com', name: 'Site Admin', password: hashedPassword },
  });

  console.log('Seeding Shared Disclaimer...');
  const existingFooterDisclaimer = await prisma.siteSetting.findUnique({
    where: { key: FOOTER_DISCLAIMER_KEY },
    select: { value: true, description: true },
  });

  if (!existingFooterDisclaimer) {
    await prisma.siteSetting.create({
      data: {
        key: FOOTER_DISCLAIMER_KEY,
        value: DEFAULT_PUBLIC_DISCLAIMER,
        description: 'Shared public disclaimer displayed in the footer and resources page',
      },
    });
  } else if (
    !existingFooterDisclaimer.value.trim() ||
    existingFooterDisclaimer.value.trim() === LEGACY_PUBLIC_DISCLAIMER
  ) {
    await prisma.siteSetting.update({
      where: { key: FOOTER_DISCLAIMER_KEY },
      data: {
        value: DEFAULT_PUBLIC_DISCLAIMER,
        description:
          existingFooterDisclaimer.description ||
          'Shared public disclaimer displayed in the footer and resources page',
      },
    });
  }

  console.log('Seeding Books...');
  for (const book of booksData) {
    const existingBook = await prisma.book.findFirst({
      where: { title: book.title },
      select: { id: true },
    });
    if (!existingBook) {
      await prisma.book.create({ data: book });
    }
  }

  console.log('Seeding Podcasts...');
  for (const podcast of podcastsData) {
    const existingPodcast = await prisma.podcast.findFirst({
      where: { name: podcast.name },
      select: { id: true },
    });
    if (!existingPodcast) {
      await prisma.podcast.create({ data: podcast });
    }
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
