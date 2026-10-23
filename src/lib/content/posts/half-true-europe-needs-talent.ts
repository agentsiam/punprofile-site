import type { Post } from "../blog";

/**
 * `half-true-europe-needs-talent`, the blog's second article. Published 23/10/2026.
 *
 * Paul's Thai, from `thai-europe-job-guide.md` in the coaching repo's
 * `golden-th/other/` (Newsletter 2), queued in `blog-queue.md` on 16/08/2026
 * with its slug, pillar, citation map and English. Publishing it was
 * transcription, not a second round of decisions.
 *
 * The queue's three edits are applied: the subject and preheader lines are gone,
 * the preheader is the card summary, the bracketed CTA placeholder is gone
 * because `cta.ts` owns every action, and the closing label is
 * `คำถามสำหรับคุณ`. The source's one `#` heading on the last section is read as
 * a section heading like the others; it is the article's fourth `##`, not a
 * second title.
 *
 * Thai is the source and the English is a translation of it. Where the two
 * disagree the Thai is right. **Paul has not read the English back.**
 *
 * Citations sit on the paragraph whose claim they support. The ELA report
 * carries two claims in two paragraphs, the 98% and the named shortage
 * occupations, so it is cited on both rather than borrowed by one.
 *
 * The illustration is the series' clay figure on a cobbled street, holding a
 * star-headed key up to three front doors, only one of which has a star: the
 * article's claim that skills fit some countries and not others. Made from the
 * prompt in the queue entry, saved in the coaching repo's brand inbox, cut to
 * 1200 x 900 here and to a 1200 x 630 sharing card with the 15% upward bias.
 */
export const HALF_TRUE_EUROPE_NEEDS_TALENT: Post = {
  slug: "half-true-europe-needs-talent",
  topic: "market",
  published: "2026-10-23",

  image: {
    src: "/blog/half-true-europe-needs-talent.jpg",
    // Describes the scene, not the article, like the first article's alt.
    alt: {
      th: "ตัวการ์ตูนดินปั้นถือกุญแจหัวรูปดาว ยืนอยู่หน้าประตูสามบานบนถนนปูหิน สีส้ม สีเหลือง และสีน้ำเงิน มีเพียงบานสีน้ำเงินที่มีรูปดาวเจาะไว้",
      en: "A clay figure holding a key with a star-shaped head, standing in front of three doors on a cobbled street, coral, yellow and dark blue, and only the blue one has a star cut into it",
    },
  },

  title: {
    th: "“ยุโรปต้องการคนเก่ง” เป็นความจริงเพียงครึ่งเดียว",
    en: "“Europe needs skilled people” is only half true",
  },

  summary: {
    th: "โอกาสมีอยู่จริง แต่ต้องเลือกประเทศและเตรียมตัวให้ตรงกับตลาด",
    en: "The opportunity is real, but you have to pick the country and prepare in a way that matches its market.",
  },

  question: {
    th: "ตอนนี้อุปสรรคหลักอยู่ที่ทักษะ ตลาดงาน เอกสาร หรือการเลือกประเทศเป้าหมาย?",
    en: "Right now, is the main obstacle your skills, the job market, the paperwork, or choosing a target country?",
  },

  sections: [
    {
      body: [
        {
          kind: "p",
          text: {
            th: "หลายประเทศในยุโรปกำลังเผชิญกับการเติบโตที่ช้าลงของประชากรวัยทำงาน ขณะที่บางอุตสาหกรรมยังต้องการแรงงานเพิ่ม คนที่ย้ายเข้ามาทำงานจึงมีบทบาทต่อเศรษฐกิจของภูมิภาคมากขึ้น",
            en: "Many European countries are facing slower growth in their working-age population, while some industries still need more workers. People who move there for work therefore play a growing part in the region's economy.",
          },
        },
        {
          kind: "p",
          text: {
            th: "งานศึกษาของคณะกรรมาธิการยุโรประบุว่า สัดส่วนประชากรวัยทำงานในสหภาพยุโรปที่เกิดนอก EU เพิ่มจากประมาณ 8% ในปี 2014 เป็นมากกว่า 12% ในปี 2024 และแรงงานกลุ่มนี้มีส่วนช่วยบรรเทาปัญหาการขาดแคลนแรงงาน",
            en: "A European Commission study states that the share of the EU working-age population born outside the EU rose from around 8% in 2014 to more than 12% in 2024, and that this group has helped ease labour shortages.",
          },
          cite: { label: "European Commission", href: "https://economy-finance.ec.europa.eu/publications/migration-mobility-and-eu-labour-market-recent-developments_en" },
        },
        {
          kind: "p",
          text: {
            th: "อย่างไรก็ตาม การขาดแรงงานในภาพรวมไม่ได้แปลว่าผู้สมัครทุกสายอาชีพจะหางานได้ง่าย",
            en: "A shortage in the aggregate does not mean applicants in every field will find work easily.",
          },
        },
      ],
    },
    {
      heading: {
        th: "งานเดียวกันอาจขาดคนในประเทศหนึ่ง แต่มีคนล้นในอีกประเทศ",
        en: "The same job can be short of people in one country and oversupplied in the next",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "ตลาดงานยุโรปแตกต่างกันตามประเทศ เมือง อุตสาหกรรม และภาษา การดูตัวเลขระดับภูมิภาคอย่างเดียวจึงอาจทำให้เข้าใจโอกาสของตัวเองคลาดเคลื่อนได้",
            en: "The European job market differs by country, city, industry and language. Reading only region-wide figures can therefore leave you with a distorted picture of your own chances.",
          },
        },
        {
          kind: "p",
          text: {
            th: "ข้อมูลจาก European Labour Authority พบว่า ในบรรดาอาชีพที่ถูกจัดว่าขาดแคลนในอย่างน้อยหนึ่งประเทศ มีถึง 98% ที่ถูกจัดว่ามีแรงงานเกินความต้องการในประเทศอื่นด้วย",
            en: "Data from the European Labour Authority finds that of the occupations classed as in shortage in at least one country, 98% are also classed as in surplus in another.",
          },
          cite: { label: "European Labour Authority", href: "https://www.ela.europa.eu/en/publications/labour-shortages-and-surpluses-europe-2024" },
        },
        {
          kind: "p",
          text: {
            th: "อาชีพที่ขาดแคลนอย่างแพร่หลายมีทั้งพยาบาล ช่างเชื่อม ช่างไฟ พ่อครัว ตลอดจนงานด้านสุขภาพ วิศวกรรม และการก่อสร้าง",
            en: "Widely reported shortage occupations include nurses, welders, electricians and cooks, as well as work in health, engineering and construction.",
          },
          cite: { label: "European Labour Authority", href: "https://www.ela.europa.eu/en/publications/labour-shortages-and-surpluses-europe-2024" },
        },
        {
          kind: "p",
          text: {
            th: "แทนที่จะถามกว้าง ๆ ว่า “ยุโรปต้องการอาชีพของฉันไหม” คำถามที่ช่วยให้วางแผนได้มากกว่าคือ",
            en: "So instead of asking broadly whether Europe needs your profession, the question that helps you plan is this.",
          },
        },
        {
          kind: "p",
          text: {
            th: "ประเทศใดกำลังต้องการทักษะของฉัน และฉันผ่านเงื่อนไขการทำงานของประเทศนั้นหรือไม่?",
            en: "Which country needs my skills, and do I meet that country's conditions for working there?",
          },
        },
      ],
    },
    {
      heading: {
        th: "มีทักษะตรงตลาด ยังต้องผ่านเงื่อนไขอื่นด้วย",
        en: "Having the skills the market wants is not the only condition",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "แม้ประสบการณ์ของคุณจะสอดคล้องกับความต้องการของตลาด นายจ้างยังต้องพิจารณาอีกหลายเรื่อง เช่น",
            en: "Even where your experience matches what the market needs, an employer still has several other things to weigh, for example:",
          },
        },
        {
          kind: "list",
          items: [
            {
              th: "คุณวุฒิหรือใบประกอบวิชาชีพได้รับการยอมรับหรือไม่",
              en: "Whether your qualification or professional licence is recognised",
            },
            {
              th: "ตำแหน่งนั้นต้องใช้ภาษาท้องถิ่นระดับใด",
              en: "What level of the local language the role requires",
            },
            {
              th: "บริษัทสามารถจ้างผู้สมัครจากต่างประเทศได้หรือไม่",
              en: "Whether the company is able to hire an applicant from abroad",
            },
            {
              th: "ต้องขอใบอนุญาตทำงานประเภทไหน",
              en: "Which type of work permit would have to be applied for",
            },
            {
              th: "คุณเริ่มงานและย้ายประเทศได้เมื่อไร",
              en: "When you could start and move",
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: "อาชีพที่เกี่ยวข้องกับสุขภาพ กฎหมาย การศึกษา หรือความปลอดภัยมักมีข้อกำหนดเพิ่มเติม คุณอาจต้องผ่านกระบวนการรับรองคุณวุฒิก่อนจึงจะสมัครหรือเริ่มงานได้",
            en: "Professions connected to health, law, education or safety often carry extra requirements. You may have to go through a recognition process before you can apply or start.",
          },
        },
        {
          kind: "p",
          text: {
            th: "นี่เป็นเหตุผลว่าทำไมคนที่มีฝีมือจึงอาจยังไม่ได้รับการตอบรับ ปัญหาอาจไม่ได้อยู่ที่คุณค่าของประสบการณ์ แต่อยู่ที่นายจ้างยังมองไม่เห็นว่ากระบวนการจ้างและย้ายประเทศจะเกิดขึ้นได้จริงอย่างไร",
            en: "This is why capable people can still go unanswered. The problem may not be the worth of your experience, but that the employer cannot yet see how the hiring and the move would actually happen.",
          },
        },
      ],
    },
    {
      heading: {
        th: "EU Talent Pool กำลังเพิ่มช่องทางเชื่อมผู้สมัครกับนายจ้าง",
        en: "The EU Talent Pool is adding a route between applicants and employers",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "ในเดือนมีนาคม 2026 สภาแห่งสหภาพยุโรปให้ความเห็นชอบขั้นสุดท้ายแก่ EU Talent Pool แพลตฟอร์มนี้จะช่วยเชื่อมผู้สมัครจากนอก EU กับนายจ้างในประเทศสมาชิกที่สมัครใจเข้าร่วม และคาดว่าจะเปิดใช้งานเต็มรูปแบบในปี 2027",
            en: "In March 2026 the Council of the EU gave its final approval to the EU Talent Pool. The platform will connect applicants from outside the EU with employers in member states that opt in, and is expected to be fully in use in 2027.",
          },
        },
        {
          kind: "p",
          text: {
            th: "การได้รับข้อเสนองานผ่านแพลตฟอร์มไม่ได้ทดแทนขั้นตอนตรวจคนเข้าเมือง ผู้สมัครยังต้องขอสิทธิพำนักและใบอนุญาตทำงานตามกฎของแต่ละประเทศ",
            en: "Receiving a job offer through the platform does not replace immigration procedure. Applicants still have to obtain residence rights and a work permit under each country's own rules.",
          },
          cite: { label: "Council of the EU", href: "https://www.consilium.europa.eu/en/press/press-releases/2026/03/30/council-gives-final-go-ahead-to-eu-talent-platform-for-non-eu-jobseekers/pdf/" },
        },
        {
          kind: "p",
          text: {
            th: "พัฒนาการนี้แสดงให้เห็นว่ายุโรปกำลังสร้างช่องทางดึงดูดแรงงานที่มีทักษะมากขึ้น แต่ความสำเร็จของผู้สมัครยังขึ้นอยู่กับการเตรียมตัวให้ตรงกับตลาดและกติกาของประเทศเป้าหมาย",
            en: "The development shows that Europe is building more routes to attract skilled workers. But an applicant's success still depends on preparing in a way that matches the market and the rules of the target country.",
          },
        },
      ],
    },
    {
      heading: {
        th: "ทำอย่างไรให้ทักษะของคุณพร้อมย้ายประเทศ",
        en: "How to make your skills ready to move country",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "แทนที่จะส่งใบสมัครกระจายไปทั่วยุโรป ลองเลือกประเทศเป้าหมายหนึ่งถึงสามประเทศ แล้วตรวจสอบสี่เรื่องต่อไปนี้",
            en: "Rather than scattering applications across Europe, pick one to three target countries and check these four things.",
          },
        },
        {
          kind: "list",
          ordered: true,
          items: [
            {
              th: "อาชีพของคุณขาดแคลนในประเทศนั้นจริงหรือไม่",
              en: "Whether your occupation is genuinely in shortage in that country",
            },
            {
              th: "คุณวุฒิหรือใบประกอบวิชาชีพต้องผ่านการรับรองหรือไม่",
              en: "Whether your qualification or professional licence has to be recognised",
            },
            {
              th: "นายจ้างต้องการภาษาและประสบการณ์ระดับใด",
              en: "What level of language and experience employers there want",
            },
            {
              th: "ใบอนุญาตทำงานเส้นทางไหนตรงกับสถานการณ์ของคุณ",
              en: "Which work-permit route matches your situation",
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: "เมื่อได้ข้อมูลแล้ว ค่อยปรับเรซูเม่ให้เล่ามากกว่ารายการหน้าที่ ระบุว่าคุณเคยแก้ปัญหาอะไร มีความเชี่ยวชาญด้านไหน และสร้างผลลัพธ์แบบใด เพื่อให้นายจ้างเห็นได้เร็วว่าประสบการณ์ของคุณตอบโจทย์ที่เขากำลังเผชิญอย่างไร",
            en: "Once you have that, revise your CV so it tells more than a list of duties. Say what problems you solved, what you specialise in, and what results you produced, so an employer can see quickly how your experience answers the problem in front of them.",
          },
        },
        {
          kind: "p",
          text: {
            th: "การที่ตลาดต้องการคนเป็นเพียงส่วนหนึ่ง โอกาสย้ายประเทศจะเกิดขึ้นได้เมื่อทักษะของคุณตรงกับประเทศ นายจ้าง และเส้นทางการย้ายถิ่นที่เหมาะสมในเวลาเดียวกัน",
            en: "Market demand is only one part of it. The chance to move comes when your skills, the country, the employer and a suitable migration route line up at the same time.",
          },
        },
      ],
    },
  ],
};
