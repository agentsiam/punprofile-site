import type { Post } from "../blog";

/**
 * `language-learning-apps`: free and paid language apps for Thai learners of
 * European languages, compared on three questions. Thai approved by Paul
 * 03/11/2026. Record: the coaching repo's
 * `work-content/blog/language-learning-apps/article.md`.
 */
export const LANGUAGE_LEARNING_APPS: Post = {
  slug: "language-learning-apps",
  topic: "how-to",
  published: "2026-11-04",
  related: "start-in-europe",

  title: {
    th: "แอปเรียนภาษายุโรปสำหรับคนไทย: ตัวไหนเรียนจากภาษาไทยได้ ตัวไหนฝึกพูด ตัวไหนพาไปถึงงาน",
    en: "Language apps for Thai learners of European languages: which teach from Thai, which train speaking, which get you to work",
  },
  seoTitle: {
    th: "แอปเรียนภาษาเยอรมัน ฝรั่งเศส สเปน สำหรับคนไทย ฟรีและเสียเงิน",
    en: "Apps to learn German, French and Spanish for Thai speakers, free and paid",
  },
  summary: {
    th: "แอปเรียนภาษาส่วนใหญ่ไม่มีเมนูภาษาไทย เน้นทักษะต่างกัน และมีไม่กี่ตัวที่พาไปถึงระดับที่งานในยุโรปต้องการ เราเทียบให้ทีละข้อ",
    en: "Most language apps have no Thai menu, they train different skills, and few get you to the level work in Europe asks for. We compare them point by point.",
  },
  image: {
    src: "/blog/language-learning-apps.jpg",
    alt: {
      th: "ชายไทยนั่งริมหน้าต่างรถไฟ ถือโทรศัพท์ และชี้เลือกหนึ่งในไอคอนแอปเรียนภาษาสามตัวที่ลอยอยู่ข้าง ๆ",
      en: "A young Thai man in a train window seat holds his phone and points to one of three language-app icons floating beside him",
    },
  },
  question: {
    th: "ตอนนี้คุณเรียนภาษายุโรปด้วยวิธีไหน และวิธีนั้นพาคุณไปถึงระดับที่งานที่คุณเล็งต้องการหรือยัง?",
    en: "How are you learning a European language right now, and is it getting you to the level the job you are aiming for asks for?",
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
            th: "ถ้าจะเรียนภาษายุโรปเพื่อไปทำงาน อย่าเลือกแอปจากความดัง ให้เลือกจาก 3 ข้อ คือเรียนจากภาษาไทยได้ไหม เน้นพูดหรือเน้นไวยากรณ์ และพาไปถึงระดับที่งานต้องการหรือเปล่า แอปฟรีช่วยเริ่มต้นได้ดี แต่ใบรับรองที่นายจ้างและสถานทูตยอมรับมาจากการสอบจริง เช่น Goethe-Zertifikat หรือ DELF",
            en: "If you are learning a European language to work there, do not pick an app because it is popular. Pick it on three questions: can you learn from Thai, does it train speaking or grammar, and does it get you to the level the work asks for. Free apps are a good start, but the certificates employers and embassies accept come from real exams such as the Goethe-Zertifikat or DELF.",
          },
        },
      ],
    },
    {
      heading: {
        th: "1. ทำไมเรียนในแอปทุกวัน อาจยังไม่พอสำหรับงาน",
        en: "1. Why studying in an app every day may not be enough for work",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "งานและวีซ่าในยุโรปวัดภาษาเป็นระดับ ไม่ได้วัดจากจำนวนวันที่เรียนต่อเนื่อง ตัวอย่างจากเยอรมนี วีซ่าเรียนสายอาชีพ (Ausbildung) โดยทั่วไปต้องมีภาษาเยอรมันระดับ B1 ส่วน Chancenkarte สำหรับผู้สมัครผ่านระบบคะแนนต้องมีภาษาเยอรมันอย่างน้อย A1 หรือภาษาอังกฤษอย่างน้อย B2 ตามข้อมูลของ Make it in Germany",
            en: "Jobs and visas in Europe measure language as a level, not as a streak of days. In Germany, for example, the vocational training (Ausbildung) visa normally needs German at B1, and the Chancenkarte, for applicants on the points route, needs at least A1 German or at least B2 English, according to Make it in Germany.",
          },
          cite: { label: "Make it in Germany", href: "https://www.make-it-in-germany.com/en/visa/kinds-of-visa/training/" },
        },
        {
          kind: "p",
          text: {
            th: "ภาษายังสัมพันธ์กับการมีงานทำด้วย ข้อมูล Eurostat ปี 2022 พบว่าคนวัยทำงานใน EU ที่มีงานทำ 78.5% รู้ภาษาต่างประเทศอย่างน้อยหนึ่งภาษา เทียบกับ 65.0% ในกลุ่มคนว่างงาน",
            en: "Language also goes with having work. Eurostat's 2022 data found that 78.5% of working-age people in the EU who have a job know at least one foreign language, against 65.0% of the unemployed.",
          },
          cite: { label: "Eurostat", href: "https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/44913.pdf" },
        },
        {
          kind: "p",
          text: {
            th: "ข้อคิด: ตั้งเป้าเป็นระดับ เช่น B1 ภายในกี่เดือน แล้วค่อยเลือกเครื่องมือที่พาไปถึง",
            en: "Takeaway: set your goal as a level, such as B1 within so many months, then choose the tools that get you there.",
          },
        },
      ],
    },
    {
      heading: {
        th: "2. แอปพาไปได้ไกลแค่ไหน งานวิจัยบอกอะไร",
        en: "2. How far can an app take you? What the research says",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "งานวิจัยชี้ว่าแอปช่วยด้านการอ่านและการฟังได้จริง แต่การพูดยังตามหลัง และระดับที่ได้ส่วนใหญ่ยังต่ำกว่าที่งานต้องการ",
            en: "Research shows apps genuinely help with reading and listening, but speaking lags behind, and the levels reached are mostly still below what work asks for.",
          },
        },
        {
          kind: "p",
          text: {
            th: "การอ่านและการฟัง: งานวิจัยในวารสาร Foreign Language Annals ปี 2021 พบว่าผู้เรียน 225 คนที่เรียนภาษาสเปนหรือฝรั่งเศสด้วย Duolingo อย่างเดียวจนจบระดับเริ่มต้น อ่านและฟังได้ใกล้เคียงนักศึกษามหาวิทยาลัยที่เรียนมา 4 เทอม",
            en: "Reading and listening: a 2021 study in the journal Foreign Language Annals found that 225 people who learned Spanish or French with Duolingo alone, to the end of the beginner level, read and listened about as well as university students after 4 semesters.",
          },
          cite: { label: "Foreign Language Annals, 2021", href: "https://doi.org/10.1111/flan.12600" },
        },
        {
          kind: "p",
          text: {
            th: "การพูด: งานวิจัยในวารสาร Language Learning & Technology ปี 2024 ติดตามผู้เรียนภาษาสเปนด้วยตนเอง 48 คนเป็นเวลา 3 เดือน หลังใช้ Duolingo เฉลี่ยประมาณ 27 ชั่วโมง คะแนนด้านการอ่าน ฟัง เขียน และพูดดีขึ้น",
            en: "Speaking: a 2024 study in the journal Language Learning & Technology followed 48 self-study learners of Spanish for 3 months. After about 27 hours on Duolingo on average, their reading, listening, writing and speaking scores all improved.",
          },
          cite: { label: "Language Learning & Technology, 2024", href: "https://www.lltjournal.org/item-detail/1152/" },
        },
        {
          kind: "p",
          text: {
            th: "ผลการศึกษาที่ Duolingo เผยแพร่: ผู้เรียนที่จบช่วงระดับ A2 ของคอร์ส พูดได้ถึง A2 ขึ้นไปราว 66% ในภาษาสเปน และ 53% ในภาษาฝรั่งเศส",
            en: "Duolingo's own published study: of learners who finished the A2 part of the course, about 66% in Spanish and 53% in French spoke at A2 or above.",
          },
          cite: { label: "Duolingo, 2021", href: "https://blog.duolingo.com/how-well-does-duolingo-teach-speaking-skills/" },
        },
        {
          kind: "p",
          text: {
            th: "งานที่ยกมาศึกษาผู้เรียน Duolingo ในคอร์สและกลุ่มตัวอย่างที่กำหนด ผลจึงไม่ได้บอกว่าทุกคนจะเรียนถึง A2 หรือว่า A2 เป็นระดับสูงสุดที่เรียนด้วยแอปได้ ถ้าเป้าหมายคือ B1 ให้ประเมินการพูดแยกจากความคืบหน้าในแอป แล้วเสริมการฝึกสนทนาและทบทวนไวยากรณ์ในจุดที่ยังติดขัด",
            en: "These studies looked at Duolingo learners in particular courses and samples, so they do not say that everyone will reach A2, or that A2 is the highest level an app can take you. If your goal is B1, assess your speaking separately from your progress in the app, then add conversation practice and grammar review where you still get stuck.",
          },
        },
        {
          kind: "p",
          text: {
            th: "ข้อคิด: ใช้แอปเป็นช่วงแรกของแผน ไม่ใช่ทั้งแผน",
            en: "Takeaway: use the app as the first stage of the plan, not the whole plan.",
          },
        },
        {
          kind: "figure",
          src: "/blog/language-learning-apps-fig-1-level-ladder.jpg",
          alt: {
            th: "บันไดระดับภาษา A1 ถึง B2 แสดงผลการฝึกพูดจากงานวิจัยและตัวอย่างเกณฑ์ภาษาของวีซ่าเยอรมนี",
            en: "A ladder of language levels from A1 to B2, showing speaking results from the research and examples of the language requirements for German visas",
          },
          caption: {
            th: "ผู้เรียนบางส่วนในงานศึกษาของ Duolingo พูดได้ถึง A2 หรือสูงกว่า ส่วนวีซ่าเรียนสายอาชีพในเยอรมนีโดยทั่วไปกำหนดภาษาเยอรมันระดับ B1 ตัวเลขทั้งสองมาจากคนละบริบท ใช้เทียบเพื่อวางเป้าหมายได้ แต่ไม่ใช่การวัดว่าผู้เรียนแอปทุกคนขาดอีกหนึ่งระดับ",
            en: "Some learners in Duolingo's study spoke at A2 or higher, while Germany's vocational training visa normally sets German at B1. The two figures come from different contexts: compare them to set a goal, not as a measure that every app learner is one level short.",
          },
        },
      ],
    },
    {
      heading: {
        th: "3. ข้อแรก: เรียนจากภาษาไทยได้ไหม",
        en: "3. First question: can you learn from Thai?",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "แอปส่วนใหญ่สอนภาษายุโรปผ่านภาษาอังกฤษ ถ้าภาษาอังกฤษของคุณยังไม่แน่น การเรียนจากภาษาไทยจะช่วยให้ไม่หลุดตั้งแต่บทแรก",
            en: "Most apps teach European languages through English. If your English is not yet solid, learning from Thai keeps you from losing the thread in the very first lesson.",
          },
        },
        {
          kind: "list",
          items: [
            {
              th: "Duolingo ประกาศเมื่อเมษายน 2025 ว่าคนไทยเรียนภาษาสเปน ฝรั่งเศส เยอรมัน และอิตาลี จากภาษาไทยได้แล้ว จากเดิมที่ส่วนใหญ่มีแค่ภาษาอังกฤษ",
              en: "Duolingo announced in April 2025 that Thai speakers can now learn Spanish, French, German and Italian from Thai, where before most could only learn English.",
            },
            {
              th: "Mondly ระบุว่าภาษาไทยเป็นหนึ่งในภาษาแม่ที่ใช้เรียนภาษาอื่นได้",
              en: "Mondly lists Thai as one of the native languages you can learn other languages from.",
            },
            {
              th: "LingoDeer, italki และ Preply มีเมนูภาษาไทยในแอป",
              en: "LingoDeer, italki and Preply have a Thai menu in the app.",
            },
            {
              th: "Babbel, Busuu, Memrise, Drops, Pimsleur, Rosetta Stone และ Lingoda ยังไม่มีเมนูภาษาไทย ต้องเรียนผ่านภาษาอังกฤษ",
              en: "Babbel, Busuu, Memrise, Drops, Pimsleur, Rosetta Stone and Lingoda have no Thai menu yet, so you learn through English.",
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: "ข้อคิด: ถ้าภาษาอังกฤษยังไม่ถึง B1 เริ่มจากแอปที่สอนจากภาษาไทยก่อน แล้วค่อยเปลี่ยนไปเรียนผ่านภาษาอังกฤษ ซึ่งได้ฝึกสองภาษาไปพร้อมกัน",
            en: "Takeaway: if your English is below B1, start with an app that teaches from Thai, then move to learning through English, which trains two languages at once.",
          },
        },
      ],
    },
    {
      heading: {
        th: "4. ข้อสอง: เน้นพูด หรือเน้นไวยากรณ์",
        en: "4. Second question: speaking or grammar?",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "แต่ละแอปเก่งคนละด้าน ปัญหาที่พบบ่อยคือเรียนต่อเนื่องมาหลายร้อยวันแต่ยังพูดประโยคง่าย ๆ ไม่ออก เพราะเลือกแอปที่ไม่ได้ฝึกพูด",
            en: "Each app is good at something different. A common problem is studying for hundreds of days in a row and still not being able to say a simple sentence, because the app chosen does not train speaking.",
          },
        },
        {
          kind: "sub",
          text: {
            th: "ถ้าอยากพูดได้",
            en: "If you want to speak",
          },
        },
        {
          kind: "list",
          items: [
            {
              th: "Pimsleur สอนผ่านเสียงล้วน เน้นการพูดและการออกเสียง",
              en: "Pimsleur teaches through audio only, with the focus on speaking and pronunciation.",
            },
            {
              th: "italki และ Preply คือเรียนตัวต่อตัวกับครูผ่านวิดีโอ ครูตั้งราคาเอง",
              en: "italki and Preply are one-to-one video lessons with a teacher, who sets their own price.",
            },
            {
              th: "Busuu ให้คนที่เป็นเจ้าของภาษาช่วยแก้แบบฝึกพูดและเขียนของคุณ",
              en: "Busuu has native speakers correct your speaking and writing exercises.",
            },
          ],
        },
        {
          kind: "sub",
          text: {
            th: "ถ้าอยากแน่นไวยากรณ์และการเขียน",
            en: "If you want solid grammar and writing",
          },
        },
        {
          kind: "list",
          items: [
            {
              th: "LingoDeer เรียงบทเรียนตามไวยากรณ์อย่างเป็นระบบ",
              en: "LingoDeer orders its lessons systematically by grammar.",
            },
            {
              th: "Deutsch für dich ของ Goethe-Institut มีแบบฝึกไวยากรณ์ คำศัพท์ การอ่าน และการฟัง ตั้งแต่ A1 ถึง C2 ฟรี",
              en: "The Goethe-Institut's Deutsch für dich has grammar, vocabulary, reading and listening exercises from A1 to C2, free.",
            },
          ],
        },
        {
          kind: "sub",
          text: {
            th: "ถ้าแค่อยากเพิ่มคำศัพท์",
            en: "If you only want more vocabulary",
          },
        },
        {
          kind: "list",
          items: [
            {
              th: "Drops เน้นคำศัพท์ด้วยภาพและเสียง เล่นฟรีวันละ 5 นาที",
              en: "Drops focuses on vocabulary with pictures and sound, free for 5 minutes a day.",
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: "ข้อคิด: ใช้แอปหนึ่งตัวสำหรับไวยากรณ์ และอีกช่องทางหนึ่งสำหรับพูดกับคนจริง แอปเดียวแทบไม่เคยพอ",
            en: "Takeaway: use one app for grammar and another channel for speaking with real people. One app is almost never enough.",
          },
        },
        {
          kind: "figure",
          src: "/blog/language-learning-apps-fig-2-top-three.jpg",
          alt: {
            th: "ตารางเปรียบเทียบ Duolingo, Mondly และ italki ด้านการรองรับภาษาไทย รูปแบบการฝึก และค่าใช้จ่าย",
            en: "A table comparing Duolingo, Mondly and italki on Thai support, how you practise, and cost",
          },
          caption: {
            th: "Duolingo และ Mondly มีบทเรียนที่เริ่มจากภาษาไทยได้ ส่วน italki มีเมนูภาษาไทยและให้คุณเลือกครูเพื่อฝึกสนทนาแบบตัวต่อตัว โดยครูแต่ละคนกำหนดค่าเรียนเอง",
            en: "Duolingo and Mondly have lessons that start from Thai, while italki has a Thai menu and lets you choose a teacher for one-to-one conversation practice, with each teacher setting their own fee.",
          },
        },
      ],
    },
    {
      heading: {
        th: "5. ข้อสาม: พาไปถึงงานได้หรือเปล่า",
        en: "5. Third question: does it get you to work?",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "ถ้าเป้าหมายคือทำงาน ให้มองหาเนื้อหาภาษาที่ใช้ในที่ทำงาน และระดับที่ไปได้ไกลกว่า A2",
            en: "If your goal is work, look for content in the language of the workplace, and for levels that go further than A2.",
          },
        },
        {
          kind: "list",
          items: [
            {
              th: "Busuu มี Business English ระดับ A2 ถึง C1 เรื่องสมัครงาน สัมภาษณ์ อีเมล และการประชุม และมีภาษาฝรั่งเศสกับดัตช์สำหรับธุรกิจ",
              en: "Busuu has Business English from A2 to C1, covering job applications, interviews, emails and meetings, plus French and Dutch for business.",
            },
            {
              th: "Mondly มีบทเรียนเนื้อหาธุรกิจกว่า 300 บท",
              en: "Mondly has more than 300 lessons with business content.",
            },
            {
              th: "vhs-Lernportal ของเยอรมนีมีคอร์ส Berufssprache Deutsch หรือภาษาเยอรมันสำหรับการทำงาน ระดับ A2 ถึง B1 และ B2 ฟรี มีเรื่องการสมัครงาน การสัมภาษณ์ และการคุยกับลูกค้า",
              en: "Germany's vhs-Lernportal has Berufssprache Deutsch, German for work, at A2 to B1 and B2, free, covering job applications, interviews and talking to customers.",
            },
            {
              th: "Lingoda เรียนสดเป็นกลุ่มเล็ก ไม่เกิน 5 คน มี Business English และให้ใบรับรองตามระดับ CEFR เมื่อเรียนจบแต่ละระดับ",
              en: "Lingoda runs live classes in small groups of up to 5, offers Business English, and gives a CEFR-level certificate when you finish each level.",
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: "อีกเรื่องที่ควรรู้: ใบรับรองจากแอปส่วนใหญ่ไม่ใช่ใบรับรองทางการ Babbel เองก็ระบุว่าใบรับรองคอร์สของตนไม่ได้รับการรับรองอย่างเป็นทางการ ถ้าต้องยื่นวีซ่าหรือสมัครงาน ให้วางแผนสอบจริง เช่น Goethe-Zertifikat สำหรับภาษาเยอรมัน DELF หรือ DALF สำหรับภาษาฝรั่งเศส และ DELE สำหรับภาษาสเปน",
            en: "One more thing to know: most app certificates are not official certificates. Babbel itself says its course certificates are not formally recognised. If you need one for a visa or a job application, plan for a real exam, such as the Goethe-Zertifikat for German, DELF or DALF for French, and DELE for Spanish.",
          },
          cite: { label: "Babbel", href: "https://support.babbel.com/hc/en-us/articles/19086073375890-Course-certificates" },
        },
        {
          kind: "p",
          text: {
            th: "ข้อคิด: ใช้แอปพาไปถึงระดับ แล้วใช้การสอบจริงพิสูจน์ระดับนั้น",
            en: "Takeaway: use apps to reach the level, then use a real exam to prove it.",
          },
        },
      ],
    },
    {
      heading: {
        th: "6. ของฟรีจากหน่วยงานทางการ ที่หลายคนมองข้าม",
        en: "6. Free courses from official bodies that many people overlook",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "ก่อนจ่ายค่าแอป ลองเริ่มจากของฟรีที่ทำโดยหน่วยงานของประเทศนั้นเอง เนื้อหาตรงกับระดับ CEFR และไม่มีโฆษณา",
            en: "Before you pay for an app, try the free courses made by bodies in the country itself. They follow CEFR levels and carry no ads.",
          },
        },
        {
          kind: "list",
          items: [
            {
              th: "เยอรมัน: Nicos Weg ของ Deutsche Welle เป็นคอร์สวิดีโอระดับ A1 ถึง B1, Deutsch für dich ของ Goethe-Institut ระดับ A1 ถึง C2 และ vhs-Lernportal ระดับ A1 ถึง B2",
              en: "German: Deutsche Welle's Nicos Weg, a video course from A1 to B1; the Goethe-Institut's Deutsch für dich, A1 to C2; and vhs-Lernportal, A1 to B2.",
            },
            {
              th: "ฝรั่งเศส: TV5MONDE Apprendre le français ระดับ A1 ถึง B2 ใช้ฟรีไม่ต้องสมัคร และช่วยเตรียมสอบ TCF",
              en: "French: TV5MONDE Apprendre le français, A1 to B2, free with no sign-up, and it helps you prepare for the TCF.",
            },
            {
              th: "สเปน: AVE Global ของ Instituto Cervantes เป็นคอร์สออนไลน์เสียเงิน ระดับ A1 ถึง C1",
              en: "Spanish: the Instituto Cervantes' AVE Global, a paid online course from A1 to C1.",
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: "ข้อคิด: ของฟรีเหล่านี้ส่วนใหญ่สอนผ่านภาษาอังกฤษหรือภาษาเป้าหมาย จึงเหมาะกับคนที่ผ่านระดับเริ่มต้นมาแล้ว",
            en: "Takeaway: most of these free courses teach through English or the target language, so they suit people who are already past the beginner stage.",
          },
        },
      ],
    },
    {
      heading: {
        th: "7. เรียนกับครูในกรุงเทพฯ",
        en: "7. Learning with a teacher in Bangkok",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "ถ้าต้องการโครงสร้างและครูที่ตรวจงานให้ ทั้งสองสถาบันนี้สอนตามระดับ CEFR และเป็นศูนย์สอบด้วย",
            en: "If you want structure and a teacher who checks your work, both of these institutes teach to CEFR levels and are exam centres too.",
          },
        },
        {
          kind: "list",
          items: [
            {
              th: "Goethe-Institut Thailand สอนระดับ A1 ถึง B2 ในห้องเรียน ค่าเรียนคอร์สละ 5,500 ถึง 10,900 บาท และสอนเป็นภาษาเยอรมันตั้งแต่ชั่วโมงแรก",
              en: "Goethe-Institut Thailand teaches A1 to B2 in the classroom, at 5,500 to 10,900 baht a course, and teaches in German from the very first hour.",
            },
            {
              th: "Alliance Française Bangkok สอนระดับ A1 ถึง C2 เริ่มต้นชั่วโมงละ 192 บาท คอร์ส 24 ชั่วโมง 5,190 บาท และมีสอบ DELF และ DALF ปีละสามรอบ คือมีนาคม มิถุนายน และพฤศจิกายน",
              en: "Alliance Française Bangkok teaches A1 to C2 from 192 baht an hour, with a 24-hour course at 5,190 baht, and holds DELF and DALF exams three times a year, in March, June and November.",
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: "ข้อคิด: ห้องเรียนแพงกว่าแอป แต่ได้ครูแก้การพูดและการเขียนให้ ซึ่งเป็นสิ่งที่แอปทำได้น้อยที่สุด",
            en: "Takeaway: a classroom costs more than an app, but a teacher corrects your speaking and writing, which is what apps do least.",
          },
        },
      ],
    },
    {
      heading: {
        th: "8. สูตรผสมตามเป้าหมาย",
        en: "8. Combinations by goal",
      },
      body: [
        {
          kind: "list",
          items: [
            {
              th: "อยากไปเรียนสายอาชีพที่เยอรมนี (ต้องการ B1): เริ่ม Duolingo หรือ Mondly จากภาษาไทย ต่อด้วย Nicos Weg และ vhs-Lernportal ฝึกพูดกับครูบน italki แล้วสอบ Goethe-Zertifikat B1",
              en: "Vocational training in Germany (B1 needed): start Duolingo or Mondly from Thai, move on to Nicos Weg and vhs-Lernportal, practise speaking with a teacher on italki, then sit the Goethe-Zertifikat B1.",
            },
            {
              th: "อยากทำงานบริษัทที่ใช้ภาษาอังกฤษ: Business English บน Busuu หรือ Lingoda และฝึกสัมภาษณ์กับครู ส่วนภาษาท้องถิ่นเรียนไว้สำหรับชีวิตประจำวัน",
              en: "A job at a company that works in English: Business English on Busuu or Lingoda and interview practice with a teacher, with the local language learned for everyday life.",
            },
            {
              th: "อยากย้ายไปฝรั่งเศส: TV5MONDE ฟรีควบคู่กับคลาสที่ Alliance Française Bangkok แล้วสอบ DELF",
              en: "Moving to France: free TV5MONDE alongside classes at Alliance Française Bangkok, then sit the DELF.",
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: "ถ้ายังไม่แน่ใจว่าจะเริ่มจากประเทศไหน อ่าน “อยากไปทำงานยุโรป เริ่มจากตรงไหน” แล้วตั้งเป้าระดับภาษาของประเทศนั้นเป็นข้อแรกของแผน 30 วัน",
            en: "If you are not yet sure which country to start with, read “Want to work in Europe? Where to start”, then make that country's language level the first item of your 30-day plan.",
          },
        },
        {
          kind: "figure",
          src: "/blog/language-learning-apps-fig-3-goal-plans.jpg",
          alt: {
            th: "การ์ดสามเป้าหมาย เรียนสายอาชีพที่เยอรมนี ทำงานบริษัทที่ใช้ภาษาอังกฤษ และย้ายไปฝรั่งเศส พร้อมขั้นตอนของแต่ละเป้าหมาย",
            en: "Three goal cards, vocational training in Germany, a company job in English, and moving to France, each with its steps",
          },
          caption: {
            th: "สามตัวอย่างการจัดแผนเรียนภาษาให้ตรงเป้าหมาย ตั้งแต่เตรียมเรียนสายอาชีพ ฝึกภาษาอังกฤษสำหรับงาน ไปจนถึงเตรียมตัวก่อนย้ายไปฝรั่งเศส",
            en: "Three examples of a language plan matched to a goal, from preparing for vocational training, to English for work, to getting ready to move to France.",
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
            th: "แอปเรียนภาษาเยอรมันที่สอนเป็นภาษาไทยมีไหม",
            en: "Is there a German-learning app that teaches in Thai?",
          },
          a: [
            {
              th: "มี Duolingo ประกาศเมื่อปี 2025 ว่าคนไทยเรียนภาษาเยอรมันจากภาษาไทยได้แล้ว และ Mondly ก็รองรับภาษาไทยเป็นภาษาแม่ ส่วนของฟรีจากหน่วยงานทางการส่วนใหญ่สอนผ่านภาษาอังกฤษ",
              en: "Yes. Duolingo announced in 2025 that Thai speakers can now learn German from Thai, and Mondly supports Thai as a native language. The free courses from official bodies mostly teach through English.",
            },
          ],
        },
        {
          kind: "qa",
          q: {
            th: "ใบรับรองจากแอปใช้ยื่นวีซ่าหรือสมัครงานได้ไหม",
            en: "Can I use an app certificate for a visa or a job application?",
          },
          a: [
            {
              th: "ส่วนใหญ่ไม่ได้ ใบรับรองที่ยอมรับกันมาจากการสอบมาตรฐาน เช่น Goethe-Zertifikat, DELF หรือ DELE ใช้แอปเพื่อเตรียมตัว แล้วสอบจริงเพื่อยืนยันระดับ",
              en: "Mostly not. The certificates that are accepted come from standard exams such as the Goethe-Zertifikat, DELF or DELE. Use apps to prepare, then sit the real exam to confirm your level.",
            },
          ],
        },
        {
          kind: "qa",
          q: {
            th: "ไปทำงานยุโรปต้องใช้ภาษาท้องถิ่นระดับไหน",
            en: "What level of the local language do I need to work in Europe?",
          },
          a: [
            {
              th: "ขึ้นกับเส้นทาง ตัวอย่างในเยอรมนี วีซ่าเรียนสายอาชีพโดยทั่วไปต้องการ B1 ส่วน Chancenkarte ในเส้นทางระบบคะแนนกำหนดภาษาเยอรมันอย่างน้อย A1 หรือภาษาอังกฤษอย่างน้อย B2 เช็กเงื่อนไขของประเทศและตำแหน่งที่คุณเล็งก่อนวางแผนเสมอ",
              en: "It depends on the route. In Germany, for example, the vocational training visa normally needs B1, and the Chancenkarte on the points route sets at least A1 German or at least B2 English. Always check the conditions for the country and the role you are aiming for before you plan.",
            },
          ],
        },
      ],
    },
  ],
};
