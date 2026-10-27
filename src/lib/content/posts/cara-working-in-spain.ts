import type { Post } from "../blog";

/**
 * `cara-working-in-spain`, the blog's first real story.
 *
 * คาร่า's own words (Cara in English), quoted from the corrected captions of
 * the six clips cut from PunProfile's interview with her, with her permission
 * for a written article and photographs on this site (confirmed by Paul
 * 26/10/2026). Quotes are never reworded. Nothing her release excludes
 * appears: no surname, company, salary, visa detail or school, and nothing
 * from the interview's do-not-publish ranges. Photographs are stills from the
 * interview footage. Record: the coaching repo's
 * `work-content/blog/cara-working-in-spain/article.md`.
 */
export const CARA_WORKING_IN_SPAIN: Post = {
  slug: "cara-working-in-spain",
  topic: "real",
  published: "2026-10-26",
  related: "start-in-europe",

  title: {
    th: "สมัครงานพันที่ เสียเปล่า 800: 6 เรื่องที่คาร่าอยากให้รู้ก่อนย้ายมาทำงานยุโรป",
    en: "A thousand applications, 800 wasted: six things Cara wants you to know before you move to Europe for work",
  },

  seoTitle: {
    th: "เรื่องจริงคนไทยทำงานที่สเปน",
    en: "A real story of a Thai working in Spain",
  },

  summary: {
    th: "ไม่ต้องพูดภาษาที่ 3 ก็ทำงานในบริษัทได้ อายุไม่ใช่ปัญหาหลัก และรูปในเรซูเม่ไม่ได้ช่วยอย่างที่คิด คาร่าเล่า 6 เรื่องจากเส้นทางนักเรียนไทยสู่คนทำงานในสเปน",
    en: "You can work in a company without a third language, age is not the main problem, and a CV photo does not help the way you think. Cara on six things from her route from Thai student to working in Spain.",
  },

  person: {
    th: "คาร่า",
    en: "Cara",
  },

  image: {
    src: "/blog/cara-working-in-spain.jpg",
    alt: {
      th: "คาร่ายิ้มขณะนั่งคุยกับพอลที่โต๊ะคาเฟ่ใต้ซุ้มทางเดินในบาร์เซโลนา",
      en: "Cara smiling as she talks with Paul at a café table under an arcade in Barcelona",
    },
  },

  question: {
    th: "ใน 6 เรื่องนี้ เรื่องไหนที่คุณเคยเชื่อ?",
    en: "Of these six, which one did you believe?",
  },

  sections: [
    {
      heading: {
        th: "สรุปสั้น ๆ",
        en: "In short",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "จากประสบการณ์ของคาร่า ภาษาที่ 3 อายุ หรือการไม่รู้จักใคร ไม่ได้ตัดสินว่าคุณจะได้งานในยุโรป สิ่งที่ตัดสินคือใบสมัครที่ตรงกับตำแหน่ง และแผนที่เริ่มก่อนเรียนจบ",
            en: "In Cara's experience, a third language, your age or knowing nobody do not decide whether you get a job in Europe. What decides it is an application that matches the role, and a plan that starts before you graduate.",
          },
        },
      ],
    },
    {
      body: [
        {
          kind: "p",
          text: {
            th: "คาร่าเป็นคนไทยที่ย้ายมาเรียนต่อที่สเปน หลังเรียนจบเธอส่งใบสมัครไปราวพันที่ กว่าจะได้งานในบริษัทที่นั่น ตอนนี้เธอใช้ภาษาอังกฤษในการทำงานเป็นหลัก",
            en: "Cara is Thai and moved to Spain to study. After graduating she sent about a thousand applications before landing a job at a company there. Today she works mostly in English.",
          },
        },
        {
          kind: "p",
          text: {
            th: "เราคุยกับเธอถึงคำถามที่คนไทยถามเราบ่อยที่สุด และคำตอบของเธอหักล้างความเชื่อเดิมหลายข้อ ข้อความในกรอบคือคำพูดของเธอเอง",
            en: "We asked her the questions Thais ask us most, and several of her answers overturn what most people believe. The quotes are her own words.",
          },
        },
      ],
    },
    {
      heading: {
        th: "1. “ต้องพูดภาษาท้องถิ่นได้ก่อน” ไม่จริงเสมอไป",
        en: "1. “You have to speak the local language first” is not always true",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "ก่อนย้ายมา คาร่าก็คิดเหมือนคนส่วนใหญ่ ว่าถ้าจะทำงานที่สเปนต้องพูดภาษาสเปนได้",
            en: "Before she moved, Cara thought what most people think: that to work in Spain you have to speak Spanish.",
          },
        },
        {
          kind: "quote",
          text: {
            th: "จริงๆแล้วภาษาที่ 3 มันสำคัญต่อชีวิตประจำวันด้วย การที่ทำงานในบริษัทที่ Barcelona หรือว่าฝรั่งเศสหรือว่าเยอรมนีก็คือ ไม่จำเป็นเลยที่ต้องมีภาษาที่ 3 เพราะว่าเหมือนทั้งนี้ทั้งนั้นแล้วเราสื่อสารกันเป็นภาษาอังกฤษใน corporate world",
            en: "Actually, a third language matters for daily life too. But working in a company in Barcelona, or France, or Germany, you don't need a third language at all, because in the end we communicate in English in the corporate world.",
          },
        },
        {
          kind: "p",
          text: {
            th: "ข้อคิด: ภาษาท้องถิ่นช่วยชีวิตประจำวัน แต่ไม่ใช่ด่านแรกของงานในบริษัทที่ใช้ภาษาอังกฤษ",
            en: "Takeaway: the local language helps with daily life, but it is not the first hurdle for a job in a company that works in English.",
          },
        },
      ],
    },
    {
      heading: {
        th: "2. สมัครพันที่ เสียเปล่า 800",
        en: "2. A thousand applications, 800 wasted",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "คาร่าส่งใบสมัครไปราวพันที่ และเล่าว่า 800 ที่เสียเปล่า เพราะใช้เรซูเม่ใบเดิมกับทุกตำแหน่ง",
            en: "Cara sent about a thousand applications and says 800 were wasted, because she used the same CV for every role.",
          },
        },
        {
          kind: "quote",
          text: {
            th: "กดสมัคร ใช้ resume ใบเดิม ไม่มี portfolio เลย คือคนที่ screen CV หรือว่าแบบ คนที่เป็น recruiter เขารู้นะว่าเราตั้งใจสมัครหรือเปล่า",
            en: "Click apply, same CV, no portfolio at all. The people who screen CVs, the recruiters, they know whether you really meant to apply.",
          },
        },
        {
          kind: "quote",
          text: {
            th: "สมัยนี้อาจจะมี AI ช่วย แต่ว่าคือมันต้อง match กับ description เลย",
            en: "These days AI might help, but it has to match the job description.",
          },
        },
        {
          kind: "p",
          text: {
            th: "ข้อคิด: สมัครน้อยลง แต่ปรับให้ตรงกับประกาศทุกครั้ง",
            en: "Takeaway: apply less, but adjust every application to the advert.",
          },
        },
        {
          kind: "figure",
          src: "/blog/cara-working-in-spain-fig-1-explaining.jpg",
          alt: {
            th: "คาร่ากำลังเล่าประสบการณ์ ขณะนั่งคุยกันที่โต๊ะคาเฟ่ใต้ซุ้มทางเดินในบาร์เซโลนา",
            en: "Cara explaining her experience, at a café table under an arcade in Barcelona",
          },
        },
      ],
    },
    {
      heading: {
        th: "3. ฝึกงานคือประตูที่เปิดง่ายที่สุด",
        en: "3. An internship is the easiest door in",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "คาร่าถามโรงเรียนตั้งแต่เนิ่น ๆ ว่าการฝึกงานบังคับไหมและต้องทำอย่างไร เพราะไม่มีใครบอกเธอ",
            en: "Cara asked her school early whether an internship was required and how it worked, because nobody had told her.",
          },
        },
        {
          kind: "quote",
          text: {
            th: "เพราะมันเป็นการสมัครที่ง่ายมากๆ เราไม่จำเป็นต้องมีประสบการณ์ คือเอาเป็นว่าเรามี opportunity เท่าเทียมกับทุกๆคน",
            en: "Because it is a really easy application, you don't need experience. Basically you have the same opportunity as everyone else.",
          },
        },
        {
          kind: "p",
          text: {
            th: "ข้อคิด: ถามเรื่องฝึกงานตั้งแต่ก่อนเริ่มเรียน และเล็งบริษัทไว้ล่วงหน้า",
            en: "Takeaway: ask about internships before the course starts, and pick your target companies in advance.",
          },
        },
      ],
    },
    {
      heading: {
        th: "4. อายุไม่ใช่ปัญหา mindset ต่างหากที่สำคัญ",
        en: "4. Age is not the problem. Mindset is",
      },
      body: [
        {
          kind: "quote",
          text: {
            th: "การเริ่มใหม่หรือการเปลี่ยนแปลง พอเรายิ่งอายุมากขึ้น เหมือน window มันจะน้อยลง แต่จริงๆแล้วที่ยุโรปเขาไม่ได้ concern เรื่องอายุเลยนะ",
            en: "Starting over or changing, the older we get, the smaller the window feels. But actually, in Europe they are not concerned about age at all.",
          },
        },
        {
          kind: "p",
          text: {
            th: "เธอยกตัวอย่างเพื่อนร่วมงานตำแหน่ง Project Manager ระดับเดียวกับเธอ ซึ่งอายุ 50 แล้ว และยังทำงานได้ดี",
            en: "She gave the example of a colleague at the same Project Manager level as her, who is 50 and still performing well.",
          },
        },
        {
          kind: "quote",
          text: {
            th: "เรื่องอายุมันไม่ได้เป็นเรื่องที่เป็นปัญหาหลัก มันอยู่ที่ mindset ตัวเอง ว่าเราจะมีความ adaptive",
            en: "Age is not the main issue. It comes down to your own mindset, whether you can adapt.",
          },
        },
      ],
    },
    {
      heading: {
        th: "5. ไม่รู้จักใครเลยสักคน ก็เริ่มได้",
        en: "5. You can start without knowing a single person",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "ปีแรกกว่า ๆ ที่สเปน คาร่าอยู่ด้วยตัวเองมาตลอด",
            en: "For a little over her first year in Spain, Cara was on her own.",
          },
        },
        {
          kind: "quote",
          text: {
            th: "เอาจริงปะ มันไม่ใช่ปัญหาเลย",
            en: "Honestly? It is not a problem at all.",
          },
        },
        {
          kind: "quote",
          text: {
            th: "แต่ถ้าเกิดเรามีไว้มันจะเป็นตัวช่วย ที่ทำให้เราเข้าไปอยู่ในจุดๆ นึง ที่อาจจะทำให้ง่ายขึ้น แต่ว่ามันไม่ใช่ทั้งหมด",
            en: "But if you have contacts, they help get you to a point where things might be easier. But they are not everything.",
          },
        },
      ],
    },
    {
      heading: {
        th: "6. รูปในเรซูเม่ ไม่ได้ช่วยอย่างที่คิด",
        en: "6. A photo on your CV does not help the way you think",
      },
      body: [
        {
          kind: "quote",
          text: {
            th: "ที่นี่คนไม่ใส่รูปเยอะเลยนะ ประมาณ 90% เลย มัน considering เรื่อง Privacy",
            en: "Here a lot of people don't put a photo, about 90%. It's about privacy.",
          },
        },
        {
          kind: "p",
          text: {
            th: "ตัวเลขนี้คือสิ่งที่เธอเห็นรอบตัว ไม่ใช่สถิติ สิ่งที่ทำให้เรซูเม่โดดเด่นคือทักษะที่เรียงสำคัญที่สุดไว้บนสุด เพราะ recruiter มักอ่านไม่ถึงข้างล่าง",
            en: "That figure is what she sees around her, not a statistic. What makes a CV stand out is your skills, most important first, because recruiters rarely read to the bottom.",
          },
        },
        {
          kind: "figure",
          src: "/blog/cara-working-in-spain-fig-2-laughing.jpg",
          alt: {
            th: "คาร่ากับพอลหัวเราะด้วยกันตอนจบการสัมภาษณ์",
            en: "Cara and Paul laughing together at the end of the interview",
          },
        },
      ],
    },
    {
      heading: {
        th: "คำถามที่พบบ่อย",
        en: "Frequently asked questions",
      },
      body: [
        {
          kind: "qa",
          q: {
            th: "ไปทำงานยุโรปต้องพูดภาษาที่ 3 ได้ไหม",
            en: "Do I need a third language to work in Europe?",
          },
          a: [
            {
              th: "ไม่เสมอไป หลายตำแหน่งในบริษัทที่ใช้ภาษาอังกฤษไม่กำหนดภาษาท้องถิ่น แต่บางตำแหน่งกำหนด เช็กจากประกาศงานจริงในประเทศที่คุณเล็ง",
              en: "Not always. Many roles in companies that work in English do not require the local language, but some do. Check real adverts in the country you are aiming at.",
            },
          ],
        },
        {
          kind: "qa",
          q: {
            th: "เรซูเม่สำหรับงานในยุโรปต้องใส่รูปไหม",
            en: "Do I need a photo on a CV for a job in Europe?",
          },
          a: [
            {
              th: "ส่วนใหญ่ไม่จำเป็น และหลายคนไม่ใส่เพราะเรื่องความเป็นส่วนตัว แต่บางประเทศยังนิยม ดูธรรมเนียมของตลาดที่คุณสมัคร",
              en: "Mostly not, and many people leave it out for privacy, though some countries still expect one. Follow the custom of the market you apply to.",
            },
          ],
        },
        {
          kind: "qa",
          q: {
            th: "ถ้าไม่รู้จักใครในยุโรปเลย จะหางานได้ไหม",
            en: "Can I find a job in Europe if I know nobody there?",
          },
          a: [
            {
              th: "ได้ คนรู้จักช่วยให้ง่ายขึ้น แต่ไม่ใช่เงื่อนไข สิ่งที่สำคัญกว่าคือใบสมัครที่ตรงกับตำแหน่ง",
              en: "Yes. Contacts make it easier, but they are not a condition. What matters more is an application that matches the role.",
            },
          ],
        },
      ],
    },
  ],
};
