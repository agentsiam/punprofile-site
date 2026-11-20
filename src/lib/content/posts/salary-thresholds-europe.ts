import type { Post } from "../blog";

/**
 * `salary-thresholds-europe`: the minimum salary a work visa asks for in ten European
 * countries, in EUR and THB, from the government pages in the coaching repo's
 * `ctxt-research/country-facts.md` (the file the EU Fit Check country page reads).
 * English written first and approved 20/11/2026; Thai by Codex from the brief,
 * amended and approved by Paul 20/11/2026. Figures are 2026 and are swapped for 2027
 * before go-live. Record: `work-content/blog/salary-thresholds-europe/article.md`.
 */
export const SALARY_THRESHOLDS_EUROPE: Post = {
  slug: "salary-thresholds-europe",
  topic: "market",
  playbook: true,
  published: "2027-01-05",
  related: "start-in-europe",

  title: {
    th: "วีซ่าทำงานในยุโรปปี 2027: แต่ละประเทศกำหนดรายได้ขั้นต่ำเท่าไหร่",
    en: "Minimum salary for a work visa in Europe, 2027: how much each country requires",
  },
  seoTitle: {
    th: "เงินเดือนขั้นต่ำสำหรับวีซ่าทำงานยุโรป 2027 เทียบ 10 ประเทศ",
    en: "Work visa minimum salary in Europe 2027, 10 countries",
  },
  summary: {
    th: "เทียบเงินเดือนขั้นต่ำที่ใช้ขอวีซ่าทำงานใน 10 ประเทศยุโรป ทั้งยูโรและบาท ตามข้อมูลจากหน่วยงานรัฐ และเกณฑ์ที่ต่ำลงสำหรับคนอายุต่ำกว่า 30 ปีและผู้สำเร็จการศึกษาใหม่",
    en: "Minimum salary for a work visa in 10 European countries, in EUR and THB, from official sources, with lower bars for under-30s and recent graduates.",
  },
  image: {
    src: "/blog/salary-thresholds-europe.jpg",
    alt: {
      th: "ประติมากรรมดินเหนียวรูปหญิงไทยคุกเข่าข้างวงกบประตู กำลังวางเหรียญเพิ่มอีกเหรียญบนกองที่เพิ่งสูงถึงขีดสีฟ้าบนวงกบ",
      en: "A clay Thai woman kneels by a doorframe, placing one more coin on a stack that has just reached a cyan line marked on the frame.",
    },
  },
  question: {
    th: "เงินเดือนปัจจุบันของคุณต่างจากเกณฑ์ของประเทศที่อยากย้ายไปเท่าไหร่ แล้วมีเกณฑ์ไหนที่ต่ำกว่านั้นที่คุณอาจมีสิทธิ์ใช้บ้าง",
    en: "How far is your current salary from the bar of the country you want to move to, and which of the lower bars might you qualify for?",
  },
  sections: [
    {
      heading: {
        th: "สรุปสั้น ๆ",
        en: "Short answer",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "วีซ่าทำงานสำหรับตำแหน่งงานที่ต้องใช้ทักษะสูงในยุโรปส่วนใหญ่กำหนดว่านายจ้างต้องจ่ายเงินเดือนขั้นต่ำเท่าไหร่ ถ้าเงินเดือนที่เสนอให้คุณต่ำกว่าเกณฑ์ ต่อให้คุณมีประสบการณ์ดีแค่ไหนก็ขอวีซ่าไม่ผ่าน",
            en: "Most work visas for skilled jobs in Europe set a minimum salary the employer must pay. If the offer is below it, the visa is refused, however good your experience is.",
          },
        },
        {
          kind: "p",
          text: {
            th: "ในปี 2026 สำหรับเส้นทางวีซ่าทำงานหลักของแต่ละประเทศ เงินเดือนก่อนหักภาษีเริ่มต้นที่ประมาณ 114,000 บาทต่อเดือนในโปแลนด์และสาธารณรัฐเช็ก และสูงสุดที่ประมาณ 231,000 บาทต่อเดือนในเดนมาร์ก บางประเทศลดเกณฑ์ให้คนอายุต่ำกว่า 30 ปี คนที่เพิ่งเรียนจบ และคนที่ทำงานในอาชีพขาดแคลน",
            en: "In 2026 the main routes run from about 114,000 THB a month in Poland and the Czech Republic to about 231,000 THB a month in Denmark, before tax. Some countries set a lower bar for under-30s, recent graduates and jobs in short supply.",
          },
        },
      ],
    },
    {
      heading: {
        th: "รายได้ขั้นต่ำสำหรับการขอวีซ่าทำงานคืออะไร",
        en: "What is a visa's minimum salary?",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "คือระดับรายได้ก่อนหักภาษีขั้นต่ำที่นายจ้างต้องจ่ายให้คุณ เพื่อให้คุณมีสิทธิ์ยื่นขอวีซ่าทำงานประเภทนั้น เจ้าหน้าที่ตรวจคนเข้าเมืองจะดูยอดในสัญญาจ้าง ถ้าต่ำกว่าเกณฑ์ คุณจะขอวีซ่าไม่ผ่าน",
            en: "It is the lowest gross salary an employer must pay for you to get that type of work visa. The immigration authority checks the figure in your contract, and if it falls short, the application fails.",
          },
        },
        {
          kind: "p",
          text: {
            th: "เวลาหางานในยุโรป เงินเดือนจึงเป็นเรื่องแรกที่ต้องเช็ก ก่อนดูว่าภาษาหรือประสบการณ์ของคุณตรงแค่ไหน ถ้าตำแหน่งงานนั้นจ่ายต่ำกว่าเกณฑ์ ต่อให้นายจ้างอยากรับคุณเข้าทำงาน ก็สปอนเซอร์วีซ่าให้คุณไม่ได้",
            en: "That makes it the first gate in a European job search, before language or experience. If the role pays below the bar, the employer cannot sponsor your visa, even if they want to hire you.",
          },
        },
      ],
    },
    {
      heading: {
        th: "เทียบเงินเดือนขั้นต่ำใน 10 ประเทศ ทั้งยูโรและบาท",
        en: "10 countries compared, in EUR and THB",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "ตารางนี้เปรียบเทียบเส้นทางวีซ่าทำงานหลักสำหรับผู้สำเร็จการศึกษาระดับมหาวิทยาลัย โดยใช้เกณฑ์ปี 2026 ที่รัฐบาลแต่ละประเทศประกาศ เราแปลงเป็นเงินบาทที่อัตรา 37.49 บาทต่อยูโร ตามอัตราอ้างอิงของธนาคารกลางยุโรป ณ วันที่ 11/11/2026",
            en: "This table shows the main work route for graduates in each country, with the bar its government publishes. 2026 figures, converted at 37.49 THB to the euro, the European Central Bank reference rate on 11 November 2026.",
          },
          cite: { label: "Banca d'Italia, ECB reference rates", href: "https://www.bancaditalia.it/compiti/operazioni-cambi/cambio/cambi_rif_20261111" },
        },
        {
          kind: "table",
          head: [
            {
              th: "ประเทศ",
              en: "Country",
            },
            {
              th: "เส้นทางวีซ่าหรือใบอนุญาต",
              en: "Route",
            },
            {
              th: "เกณฑ์รายได้ขั้นต่ำ",
              en: "The rule",
            },
            {
              th: "ต่อปี (EUR)",
              en: "Per year (EUR)",
            },
            {
              th: "เฉลี่ยต่อเดือน (THB)",
              en: "Average per month (THB)",
            },
          ],
          rows: [
            [
              {
                th: "เดนมาร์ก",
                en: "Denmark",
              },
              {
                th: "Pay Limit Scheme (เส้นทางวีซ่าตามเกณฑ์รายได้)",
                en: "Pay Limit Scheme",
              },
              {
                th: "DKK 552,000 ต่อปี",
                en: "DKK 552,000 a year",
              },
              {
                th: "73,800",
                en: "73,800",
              },
              {
                th: "231,000",
                en: "231,000",
              },
            ],
            [
              {
                th: "เนเธอร์แลนด์",
                en: "Netherlands",
              },
              {
                th: "Highly Skilled Migrant (ใบอนุญาตสำหรับผู้มีทักษะสูง) อายุ 30 ปีขึ้นไป",
                en: "Highly Skilled Migrant, age 30 and over",
              },
              {
                th: "€5,942 ต่อเดือน ไม่รวมเงินค่าวันหยุดประจำปี (holiday allowance)",
                en: "€5,942 a month, excluding holiday pay",
              },
              {
                th: "71,300",
                en: "71,300",
              },
              {
                th: "223,000",
                en: "223,000",
              },
            ],
            [
              {
                th: "นอร์เวย์",
                en: "Norway",
              },
              {
                th: "ใบอนุญาตสำหรับผู้มีทักษะ สำหรับตำแหน่งงานที่ต้องใช้วุฒิระดับปริญญาตรี",
                en: "Skilled worker, bachelor's-level job",
              },
              {
                th: "NOK 545,400 ต่อปี หากมีข้อตกลงการจ้างงานร่วม (collective agreement) ให้ใช้อัตราค่าจ้างตามข้อตกลง",
                en: "NOK 545,400 a year, or the collective agreement rate where one applies",
              },
              {
                th: "51,400",
                en: "51,400",
              },
              {
                th: "161,000",
                en: "161,000",
              },
            ],
            [
              {
                th: "เยอรมนี",
                en: "Germany",
              },
              {
                th: "EU Blue Card (ใบอนุญาตพำนักและทำงานสำหรับงานทักษะสูง)",
                en: "EU Blue Card",
              },
              {
                th: "€50,700 ต่อปี",
                en: "€50,700 a year",
              },
              {
                th: "50,700",
                en: "50,700",
              },
              {
                th: "158,000",
                en: "158,000",
              },
            ],
            [
              {
                th: "สหราชอาณาจักร",
                en: "United Kingdom",
              },
              {
                th: "Skilled Worker (วีซ่าทำงานสำหรับผู้มีทักษะ)",
                en: "Skilled Worker",
              },
              {
                th: "£41,700 ต่อปี หรืออัตราค่าจ้างประจำอาชีพ หากอัตรานั้นสูงกว่า",
                en: "£41,700 a year, or the occupation's going rate if higher",
              },
              {
                th: "49,900",
                en: "49,900",
              },
              {
                th: "156,000",
                en: "156,000",
              },
            ],
            [
              {
                th: "ฟินแลนด์",
                en: "Finland",
              },
              {
                th: "ใบอนุญาตสำหรับผู้เชี่ยวชาญ (Specialist permit) และ EU Blue Card",
                en: "Specialist permit and EU Blue Card",
              },
              {
                th: "€3,937 ต่อเดือน",
                en: "€3,937 a month",
              },
              {
                th: "47,200",
                en: "47,200",
              },
              {
                th: "148,000",
                en: "148,000",
              },
            ],
            [
              {
                th: "ไอร์แลนด์",
                en: "Ireland",
              },
              {
                th: "Critical Skills Employment Permit (ใบอนุญาตทำงานสำหรับอาชีพที่อยู่ในรายการทักษะสำคัญ)",
                en: "Critical Skills Employment Permit",
              },
              {
                th: "€40,904 ต่อปี สำหรับผู้มีคุณวุฒิที่เกี่ยวข้องกับตำแหน่งงาน",
                en: "€40,904 a year with a relevant degree",
              },
              {
                th: "40,900",
                en: "40,900",
              },
              {
                th: "128,000",
                en: "128,000",
              },
            ],
            [
              {
                th: "สวีเดน",
                en: "Sweden",
              },
              {
                th: "ใบอนุญาตทำงาน",
                en: "Work permit",
              },
              {
                th: "SEK 34,470 ต่อเดือน",
                en: "SEK 34,470 a month",
              },
              {
                th: "37,400",
                en: "37,400",
              },
              {
                th: "117,000",
                en: "117,000",
              },
            ],
            [
              {
                th: "โปแลนด์",
                en: "Poland",
              },
              {
                th: "EU Blue Card",
                en: "EU Blue Card",
              },
              {
                th: "PLN 160,264 ต่อปี",
                en: "PLN 160,264 a year",
              },
              {
                th: "36,400",
                en: "36,400",
              },
              {
                th: "114,000",
                en: "114,000",
              },
            ],
            [
              {
                th: "สาธารณรัฐเช็ก",
                en: "Czech Republic",
              },
              {
                th: "EU Blue Card",
                en: "EU Blue Card",
              },
              {
                th: "CZK 73,823 ต่อเดือน",
                en: "CZK 73,823 a month",
              },
              {
                th: "36,300",
                en: "36,300",
              },
              {
                th: "114,000",
                en: "114,000",
              },
            ],
          ],
        },
        {
          kind: "list",
          bare: true,
          items: [
            {
              th: "บางประเทศมีเส้นทางใบอนุญาตอื่นที่ใช้เกณฑ์รายได้ต่างกัน ถ้าจะขอ EU Blue Card ในสวีเดน คุณต้องได้เงินเดือน SEK 53,625 ต่อเดือน (ประมาณ 182,000 บาท) ในนอร์เวย์ ถ้าตำแหน่งงานกำหนดวุฒิปริญญาโท เกณฑ์อยู่ที่ NOK 624,700 ต่อปี (ประมาณ 184,000 บาทต่อเดือน) ส่วนไอร์แลนด์ ถ้าคุณไม่มีคุณวุฒิที่เกี่ยวข้องกับตำแหน่งงานแต่จะขอ Critical Skills Employment Permit ต้องได้ €68,911 ต่อปี (ประมาณ 215,000 บาทต่อเดือน)",
              en: "Some countries have a second route with a different bar. Sweden's EU Blue Card needs SEK 53,625 a month (about 182,000 THB), and Norway asks NOK 624,700 a year (about 184,000 THB a month) for a job that needs a master's. Ireland's Critical Skills permit without a relevant degree needs €68,911 a year (about 215,000 THB a month).",
            },
          ],
          cites: [
            { label: "SIRI (nyidanmark.dk)", href: "https://www.nyidanmark.dk/uk-UA/Words-and-concepts/SIRI/Minimum-amounts/Pay-Limit-Scheme%27s-minimum-amount" },
            { label: "IND", href: "https://ind.nl/en/news/fees-and-required-amounts-for-2026-known" },
            { label: "UDI", href: "https://www.udiregelverk.no/en/documents/udi-guidelines/udi-2010-129/udi-2010-129v/" },
            { label: "Make it in Germany", href: "https://www.make-it-in-germany.com/fileadmin/1_Rebrush_2022/a_Fachkraefte/PDF-Dateien/3_Visum_u_Aufenthalt/Visagrafik_EN/Lebensunterhaltssicherung_Uebersicht_EN.pdf" },
            { label: "GOV.UK", href: "https://www.gov.uk/skilled-worker-visa/your-job" },
            { label: "Migri", href: "https://migri.fi/working-in-finland/income-requirement" },
            { label: "Department of Enterprise (Ireland)", href: "https://enterprise.gov.ie/en/news-and-events/department-news/2025/december/20251202.html" },
            { label: "Migrationsverket", href: "https://migrationsverket.se/en/word-explanations/salary-requirements-for-a-work-permit.html" },
            { label: "Migrationsverket, EU Blue Card", href: "https://www.migrationsverket.se/en/newsarchive/newrulesforworkpermitsfrom1june2026.5.4d7d222919d2a911cf74cf.html" },
            { label: "Urząd do Spraw Cudzoziemców", href: "https://mos.cudzoziemcy.gov.pl/baza-pytan-i-odpowiedzi/zezwolenia-pobyt-i-praca/niebieska-karta-ue/" },
            { label: "Ministerstvo průmyslu a obchodu", href: "https://mpo.gov.cz/cz/zahranicni-obchod/ekonomicka-migrace/navyseni-mzdy-pro-modre-karty-a-nove-formulare-cestneho-prohlaseni-_-program-klicovy-a-vedecky-personal-a-program-vysoce-kvalifikovany-zamestnanec--292547/" },
          ],
        },
        {
          kind: "figure",
          src: {
            th: "/blog/salary-thresholds-europe-fig-1-by-country.jpg",
            en: "/blog/salary-thresholds-europe-fig-1-by-country-en.jpg",
          },
          alt: {
            th: "กราฟแท่งแสดงเงินเดือนขั้นต่ำต่อเดือนสำหรับวีซ่าทำงานใน 10 ประเทศยุโรป ปี 2026 ตั้งแต่ประมาณ 114,000 บาท ในโปแลนด์และสาธารณรัฐเช็ก ไปจนถึง 231,000 บาท ในเดนมาร์ก",
            en: "Bar chart of the minimum monthly salary for a work visa in 10 European countries in 2026, in THB, from about 114,000 in Poland and the Czech Republic to 231,000 in Denmark.",
          },
          caption: {
            th: "เงินเดือนก่อนหักภาษีตามเกณฑ์ของวีซ่าทำงานประเภทหลักในแต่ละประเทศ ปี 2026 คิดที่ 37.49 บาทต่อยูโร",
            en: "The main work route in each country, 2026, before tax, converted at 37.49 THB to the euro.",
          },
        },
      ],
    },
    {
      heading: {
        th: "อายุต่ำกว่า 30 ปี เพิ่งเรียนจบ หรือทำงานในอาชีพขาดแคลน ใช้เกณฑ์ที่ต่ำกว่าได้ไหม",
        en: "Under 30, a recent graduate or in a shortage job? The bar may be lower",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "บางประเทศลดเกณฑ์รายได้ขั้นต่ำให้คนอายุน้อย คนที่เพิ่งเรียนจบ หรือคนที่ทำงานในอาชีพที่ขาดแคลนแรงงาน ถ้าคุณอยู่ในกลุ่มเหล่านี้ เงินเดือนของคุณอาจถึงเกณฑ์ของประเทศที่ตอนแรกคิดว่าสูงเกินไป",
            en: "Some countries lower the bar for younger people, recent graduates or jobs they cannot fill. If you fit one of these groups, a country that looks out of reach may be within it.",
          },
        },
        {
          kind: "list",
          items: [
            {
              th: "เนเธอร์แลนด์ ถ้าคุณอายุต่ำกว่า 30 ปี เกณฑ์อยู่ที่ €4,357 ต่อเดือน (ประมาณ 163,000 บาท) ส่วนคนที่มีสิทธิ์ใช้เกณฑ์รายได้ขั้นต่ำที่ต่ำกว่า เช่น คนที่เพิ่งเรียนจบและมีคุณสมบัติครบ ใช้เกณฑ์ €3,122 ต่อเดือน (ประมาณ 117,000 บาท)",
              en: "Netherlands: under 30, €4,357 a month (about 163,000 THB); under the reduced criteria, for example a recent graduate who qualifies, €3,122 a month (about 117,000 THB).",
            },
            {
              th: "เยอรมนี เกณฑ์ €45,934.20 ต่อปี (ประมาณ 143,000 บาทต่อเดือน) ใช้กับคนทำงานในอาชีพขาดแคลน คนที่เพิ่งเรียนจบ และผู้เชี่ยวชาญด้านไอทีที่ไม่มีวุฒิปริญญาแต่มีประสบการณ์ทำงานด้านไอที 3 ปีในช่วง 7 ปีที่ผ่านมา",
              en: "Germany: shortage occupations, recent graduates, and IT specialists without a degree who have three years of IT experience in the last seven, €45,934.20 a year (about 143,000 THB a month).",
            },
            {
              th: "ไอร์แลนด์ ถ้าอาชีพของคุณอยู่นอกรายชื่ออาชีพที่ต้องใช้ทักษะสำคัญ General Employment Permit (ใบอนุญาตทำงานทั่วไป) ใช้เกณฑ์ €36,605 ต่อปี (ประมาณ 114,000 บาทต่อเดือน) โดยปกตินายจ้างต้องดำเนินการทดสอบตลาดแรงงานเพื่อแสดงว่าไม่สามารถหาผู้สมัครในประเทศได้",
              en: "Ireland: the General Employment Permit, for jobs outside the critical skills list, €36,605 a year (about 114,000 THB a month). It usually needs a labour market test.",
            },
          ],
          cites: [
            { label: "IND", href: "https://ind.nl/en/news/fees-and-required-amounts-for-2026-known" },
            { label: "Make it in Germany", href: "https://www.make-it-in-germany.com/fileadmin/1_Rebrush_2022/a_Fachkraefte/PDF-Dateien/3_Visum_u_Aufenthalt/Visagrafik_EN/Lebensunterhaltssicherung_Uebersicht_EN.pdf" },
            { label: "Department of Enterprise (Ireland)", href: "https://enterprise.gov.ie/en/news-and-events/department-news/2025/december/20251202.html" },
          ],
        },
        {
          kind: "figure",
          src: {
            th: "/blog/salary-thresholds-europe-fig-2-lower-tiers.jpg",
            en: "/blog/salary-thresholds-europe-fig-2-lower-tiers-en.jpg",
          },
          alt: {
            th: "กราฟแท่งเปรียบเทียบเงินเดือนขั้นต่ำตามเกณฑ์ปกติกับเกณฑ์ที่ต่ำกว่าในเนเธอร์แลนด์ เยอรมนี และไอร์แลนด์ ปี 2026 หน่วยเป็นบาทต่อเดือน",
            en: "Bars comparing the standard and the lower minimum salary in the Netherlands, Germany and Ireland in 2026, in THB a month.",
          },
          caption: {
            th: "คุณใช้เกณฑ์ที่ต่ำกว่าได้เฉพาะเมื่อมีคุณสมบัติตรงตามเงื่อนไขของประเทศนั้น",
            en: "The lower bar applies only if you meet that country's conditions.",
          },
        },
      ],
    },
    {
      heading: {
        th: "เงินเดือนถึงเกณฑ์แล้ว วีซ่าก็ยังอาจไม่ผ่าน",
        en: "Meeting the minimum does not guarantee the visa",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "ตัวเลขในตารางเป็นเพียงระดับขั้นต่ำ ไม่ใช่ระดับเงินเดือนที่ควรคาดหวัง หลายประเทศยังตรวจด้วยว่านายจ้างจ่ายให้คุณเท่ากับคนในประเทศที่ทำงานเดียวกันหรือเปล่า",
            en: "The figures in the table are a floor, not the salary to expect. Several countries also check that you are paid what local staff earn for the same job.",
          },
        },
        {
          kind: "p",
          text: {
            th: "ในเยอรมนี หากต้องการใช้เกณฑ์รายได้ที่ต่ำกว่า คุณต้องได้รับอนุมัติจากสำนักงานแรงงานของรัฐบาลกลางก่อน และสำนักงานอาจกำหนดเงินเดือนสูงกว่าขั้นต่ำ",
            en: "In Germany, the reduced bar needs approval from the Federal Employment Agency, which may require more than the minimum.",
          },
          cite: { label: "Bundesagentur für Arbeit", href: "https://www.arbeitsagentur.de/vor-ort/zav/working-and-living-in-germany/iss-en/issue-03-2026/blue-card" },
        },
        {
          kind: "p",
          text: {
            th: "ในสหราชอาณาจักร เงินเดือนต้องถึงทั้งเกณฑ์ทั่วไปและอัตราค่าจ้างประจำอาชีพ จึงต้องยึดตัวที่สูงกว่า",
            en: "In the UK, the salary must meet both the general threshold and the going rate for the occupation, whichever is higher.",
          },
          cite: { label: "GOV.UK", href: "https://www.gov.uk/skilled-worker-visa/your-job" },
        },
        {
          kind: "p",
          text: {
            th: "ในนอร์เวย์ ถ้าตำแหน่งงานนั้นอยู่ภายใต้ข้อตกลงการจ้างงานร่วม ให้ใช้อัตราค่าจ้างตามข้อตกลง",
            en: "In Norway, a collective agreement's wage rate applies where there is one.",
          },
          cite: { label: "UDI", href: "https://www.udiregelverk.no/en/documents/udi-guidelines/udi-2010-129/udi-2010-129v/" },
        },
        {
          kind: "p",
          text: {
            th: "ตัวเลขทั้งหมดเป็นยอดก่อนหักภาษีและเงินสมทบประกันสังคม เงินที่เข้าบัญชีคุณจริงแต่ละเดือนจึงน้อยกว่านี้พอสมควร",
            en: "Every figure is before tax and social security. What reaches your bank account each month is noticeably less.",
          },
        },
      ],
    },
    {
      heading: {
        th: "ประเทศใดที่ยังไม่รวมอยู่ในตาราง",
        en: "Countries not in this table yet",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "เรายังเว้นฝรั่งเศส สเปน ออสเตรีย เบลเยียม สวิตเซอร์แลนด์ อิตาลี และโปรตุเกสไว้ เพราะเราจะระบุตัวเลขเมื่อได้อ่านจากเว็บไซต์ทางการของประเทศนั้นแล้ว และเรายังไม่ได้ตรวจตัวเลขของประเทศเหล่านี้ ถ้าคุณเล็งประเทศใดประเทศหนึ่งไว้ ลองถามนายจ้างหรือสถานทูตว่าตำแหน่งงานของคุณต้องได้เงินเดือนอย่างน้อยเท่าไหร่",
            en: "France, Spain, Austria, Belgium, Switzerland, Italy and Portugal are missing on purpose. We print a figure only once we have read it on the government's own page, and for these we have not yet. If one of them is your target, ask the employer or the embassy what your role must pay.",
          },
        },
      ],
    },
    {
      heading: {
        th: "ตั้งแต่วันที่ 1 มกราคม 2027 มีอะไรเปลี่ยนแปลงบ้าง",
        en: "What changes on 1 January 2027",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "เกณฑ์รายได้ขั้นต่ำส่วนใหญ่เปลี่ยนทุกปี ให้ดูเกณฑ์ที่มีผลในวันที่คุณยื่นคำขอ แม้วันที่ได้รับข้อเสนองานจะยังใช้เกณฑ์เดิม",
            en: "Most bars change every year. What counts is the figure in force on the day you apply, not the day you receive the offer.",
          },
        },
        {
          kind: "list",
          items: [
            {
              th: "เนเธอร์แลนด์ปรับเกณฑ์รายได้ขั้นต่ำและค่าธรรมเนียมตั้งแต่ 01/01/2027",
              en: "The Netherlands changes its salary thresholds and fees from 1 January 2027.",
            },
            {
              th: "เยอรมนีกำหนดเกณฑ์รายได้ขั้นต่ำสำหรับ EU Blue Card ใหม่ทุกปี",
              en: "Germany sets a new EU Blue Card figure every year.",
            },
            {
              th: "ไอร์แลนด์มีแผนปรับเกณฑ์ขึ้นอีกตั้งแต่ปี 2027",
              en: "Ireland plans further increases from 2027.",
            },
            {
              th: "โปแลนด์ใช้ตัวเลขนี้กับคำขอที่ยื่นในปี 2026 ส่วนสาธารณรัฐเช็กใช้ตัวเลขนี้กับคำขอที่หน่วยงานตัดสินภายในวันที่ 30/04/2027",
              en: "Poland's figure is for applications filed in 2026, and the Czech figure applies to decisions until 30 April 2027.",
            },
          ],
          cites: [
            { label: "EIG Law", href: "https://eiglaw.com/netherlands-changes-skilled-migrant-salary-scales-and-application-fees-for-2027/" },
            { label: "Make it in Germany", href: "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card" },
            { label: "Vialto Partners", href: "https://vialtopartners.com/regional-alerts/ireland-immigration-changes-to-employment-permit-salary-thresholds-from-1-march-2026" },
            { label: "Urząd do Spraw Cudzoziemców", href: "https://mos.cudzoziemcy.gov.pl/baza-pytan-i-odpowiedzi/zezwolenia-pobyt-i-praca/niebieska-karta-ue/" },
            { label: "Ministerstvo průmyslu a obchodu", href: "https://mpo.gov.cz/cz/zahranicni-obchod/ekonomicka-migrace/navyseni-mzdy-pro-modre-karty-a-nove-formulare-cestneho-prohlaseni-_-program-klicovy-a-vedecky-personal-a-program-vysoce-kvalifikovany-zamestnanec--292547/" },
          ],
        },
      ],
    },
    {
      heading: {
        th: "วิธีตรวจสอบข้อเสนองานกับตารางใน 4 ขั้นตอน",
        en: "How to use this table: 4 steps",
      },
      body: [
        {
          kind: "list",
          ordered: true,
          items: [
            {
              th: "ตรวจสอบก่อนว่าตำแหน่งงานนี้ใช้ EU Blue Card หรือใบอนุญาตทำงานของประเทศนั้น เพราะเกณฑ์รายได้ขั้นต่ำต่างกัน",
              en: "Find out which route the job uses, an EU Blue Card or the country's own permit, because the bars differ.",
            },
            {
              th: "ดูว่าอายุ ปีที่เรียนจบ หรืออาชีพของคุณ ทำให้คุณมีสิทธิ์ใช้เกณฑ์ที่ต่ำกว่าหรือเปล่า",
              en: "Check whether you qualify for a lower bar, by age, graduation year or occupation.",
            },
            {
              th: "เทียบเกณฑ์กับเงินเดือนที่นายจ้างเสนอ โดยคิดเป็นยอดต่อปีก่อนหักภาษี แล้วเช็กว่าประเทศนั้นนับเงินส่วนอื่น เช่น เงินวันหยุดพักร้อน รวมด้วยไหม",
              en: "Compare it with the offer as a gross yearly figure, and check whether that country counts extras such as holiday pay.",
            },
            {
              th: "สอบถามนายจ้างโดยตรงว่าตำแหน่งงานนี้สปอนเซอร์วีซ่าให้หรือไม่ และจะยื่นขอวีซ่าหรือใบอนุญาตประเภทไหนให้คุณ",
              en: "Ask the employer directly whether the role sponsors a visa, and which route they will apply for.",
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: "ถ้ายังไม่แน่ใจว่าจะเริ่มตรงไหน ลองอ่าน “อยากไปทำงานยุโรป เริ่มจากตรงไหน” แล้วเลือกไว้สองประเทศที่เงินเดือนของคุณถึงเกณฑ์ จากนั้นลองทำ “EU Fit Check” เพื่อดูว่าคุณพร้อมแค่ไหนสำหรับประเทศที่เลือก",
            en: "If you are not yet sure where to start, read “Want to work in Europe? Where to start”, then pick two countries your salary can reach. Then take the “EU Fit Check” to see how ready you are for the one you choose.",
          },
        },
      ],
    },
    {
      heading: {
        th: "คำถามที่พบบ่อยเกี่ยวกับวีซ่า",
        en: "Frequently asked questions",
      },
      body: [
        {
          kind: "qa",
          q: {
            th: "ขอ EU Blue Card ในเยอรมนีปี 2026 ต้องได้เงินเดือนเท่าไหร่",
            en: "What salary does a German EU Blue Card need in 2026?",
          },
          a: [
            {
              th: "€50,700 ต่อปีก่อนหักภาษี หรือ €45,934.20 สำหรับผู้ทำงานในอาชีพที่ขาดแคลน คนที่เพิ่งเรียนจบ และผู้เชี่ยวชาญด้านไอทีบางกลุ่ม ตัวเลขนี้เปลี่ยนทุกปี",
              en: "€50,700 a year before tax, or €45,934.20 for shortage occupations, recent graduates and some IT specialists. The figure changes every year.",
            },
          ],
        },
        {
          kind: "qa",
          q: {
            th: "เกณฑ์รายได้ขั้นต่ำสำหรับวีซ่าคิดก่อนหรือหลังหักภาษี",
            en: "Is a visa's minimum salary before or after tax?",
          },
          a: [
            {
              th: "ทุกประเทศในตารางใช้ยอดก่อนหักภาษีและเงินสมทบประกันสังคม",
              en: "Before tax and social security, in every country in this table.",
            },
          ],
        },
        {
          kind: "qa",
          q: {
            th: "ประเทศไหนในยุโรปกำหนดเงินเดือนขั้นต่ำไว้ต่ำที่สุด",
            en: "Which European country has the lowest salary bar?",
          },
          a: [
            {
              th: "ในตารางของเรา โปแลนด์และสาธารณรัฐเช็กมีเกณฑ์ประมาณ 114,000 บาทต่อเดือนเท่ากันสำหรับ EU Blue Card ส่วน General Employment Permit ของไอร์แลนด์ก็ใช้เกณฑ์ใกล้เคียงกัน",
              en: "In our table, Poland and the Czech Republic, both about 114,000 THB a month on their EU Blue Card. Ireland's General Employment Permit is about the same.",
            },
          ],
        },
      ],
    },
  ],
};
