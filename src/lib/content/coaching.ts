import type { Copy } from "./copy";

/**
 * The 1-1 coaching page. TASK-089, rewritten 14/08/2026 from Paul's own Thai.
 *
 * The structure came from a competitor's landing page (Careersu, ANZ tech
 * coaching), whose insight is that the founder section is not a page but the
 * LAST section of a sales page, reached by a reader already persuaded. The
 * words are now Paul's, supplied in Thai; the English is a translation of his
 * Thai rather than the reverse, which is the right direction for a Thai-first
 * product.
 *
 * Order: name the mechanism the reader is losing to, show they are not alone in
 * it, show the machine, say who it is and is not for, then say who is behind it.
 *
 * The founder section carried a `COACHING_REVIEWED` draft gate until Paul
 * supplied his own words on 14/08/2026. The gate and its banner are gone rather
 * than left switched on: a flag nothing reads is a flag that will be wrong one
 * day without anyone noticing. It existed because no biography lived anywhere
 * in the coaching repo to build one from, and inventing it was the one thing
 * that would have made every other honest claim on this site worthless.
 *
 * **The proof numbers are never written here.** Every figure on this page comes
 * from `convex/stats.ts` at render, each one disappears on its own if its
 * sample is too thin, and none is hard-coded. That is the only reason a page
 * whose competitor fills these slots with client logos and placement rates can
 * make a stronger claim than they do: the reader is one of the people counted.
 */

// ------------------------------------------------------------------- the hook

export const HOOK_EYEBROW: Copy = {
  en: "1-1 career coaching for Thai professionals heading to Europe",
  // Read back 25/08/2026. `Career Coaching` for `แคเรียร์โค้ชชิ่ง`.
  th: "Career Coaching แบบตัวต่อตัว สำหรับคนไทยที่ตั้งเป้าไปทำงานในยุโรป",
};

/**
 * Two lines, the second in Teal.
 *
 * `design.md` reserves Terracotta for the single primary action on a screen so
 * it keeps its persuasive weight, and a headline in the button colour spends
 * exactly that. Teal is the colour the brand is known by and carries emphasis
 * everywhere that is not a button.
 */
export const HOOK_LINE_1: Copy = {
  en: "It is rarely that your experience is not enough.",
  th: "ปัญหามักไม่ใช่ว่าคุณมีประสบการณ์ไม่พอ",
};

export const HOOK_LINE_2: Copy = {
  en: "It is that nobody in Europe can see what that experience is worth.",
  th: "แต่คือคนในยุโรปยังไม่เห็นว่าประสบการณ์นั้นมีค่าอย่างไร",
};

export const HOOK_BODY: readonly Copy[] = [
  {
    en: "A hiring manager in Amsterdam opens your CV. They do not know your last company, they cannot tell how big the job you were responsible for actually was, and the visa question has no answer yet. They are not deciding that you are not good. They simply have not been given enough reason to keep reading.",
    th: "ลองนึกภาพว่าผู้จัดการฝ่ายสรรหาในอัมสเตอร์ดัมเปิด CV ของคุณขึ้นมา เขาไม่รู้จักบริษัทเดิมของคุณ ไม่รู้ว่างานล่าสุดที่คุณรับผิดชอบใหญ่หรือซับซ้อนแค่ไหน และยังไม่รู้ว่าคุณมีสิทธิ์ทำงานอยู่แล้วหรือต้องขอวีซ่า เขาอาจไม่ได้คิดว่าคุณไม่เก่ง เพียงแต่ยังไม่เห็นเหตุผลมากพอที่จะอ่านต่อ",
  },
  {
    en: "The problem is getting your experience across to another market, not your ability, and sending more applications does not solve it.",
    th: "ปัญหาอยู่ที่การถ่ายทอดประสบการณ์ให้คนในอีกตลาดเข้าใจ ไม่ใช่ความสามารถของคุณ และการส่งใบสมัครเพิ่มขึ้นก็ไม่ได้แก้ปัญหานี้เสมอไป",
  },
];

export const HOOK_CTA_SUB: Copy = {
  en: "The three ways of working together, and what each one does for you.",
  th: "ดูบริการทั้ง 3 รูปแบบ และแต่ละแบบจะช่วยคุณได้อย่างไร",
};

// --------------------------------------------------------- does this sound like you

export const PAIN_HEADING: Copy = {
  en: "Does any of this sound like you?",
  th: "มีข้อไหนตรงกับคุณบ้าง?",
};

export const PAINS: readonly Copy[] = [
  {
    en: "You have sent applications to Europe several times and heard nothing back from anyone.",
    th: "ส่งใบสมัครไปยุโรปหลายครั้ง แต่เงียบ ไม่มีใครตอบกลับมาเลย",
  },
  {
    en: "You know you are good at your job in Thailand, but you have no idea what the same experience is worth in Berlin or Rotterdam.",
    th: "คุณรู้ว่าตัวเองทำงานเก่งในไทย แต่ไม่รู้ว่าประสบการณ์แบบเดียวกันมีค่าแค่ไหนในเบอร์ลินหรือรอตเทอร์ดาม",
  },
  {
    en: "Most advice on the internet is written for people who already have the right to work in the EU.",
    th: "คำแนะนำบนอินเทอร์เน็ตส่วนใหญ่เขียนมาสำหรับคนที่มีสิทธิ์ทำงานใน EU อยู่แล้ว",
  },
  {
    en: "You have revised your CV several times and still cannot say which version is genuinely better.",
    th: "แก้ CV มาหลายรอบ แต่ยังบอกไม่ได้ว่าเวอร์ชันไหนดีกว่ากันจริง",
  },
  {
    en: "You are not sure whether the visa is a real obstacle or an excuse you are using to hold yourself back.",
    th: "ไม่แน่ใจว่าวีซ่าเป็นอุปสรรคจริง ๆ หรือเป็นข้ออ้างที่คุณใช้รั้งตัวเองไว้",
  },
  {
    en: "If you could move tomorrow you would go, but you still cannot say which country, or which role.",
    th: "ถ้าย้ายได้พรุ่งนี้ คุณก็พร้อมไป แต่ยังตอบไม่ได้ว่าจะไปประเทศไหนหรือสมัครตำแหน่งอะไร",
  },
];

// --------------------------------------------------------------- the proof panel

export const PROOF_HEADING: Copy = {
  en: "It is not that people are not trying.",
  th: "ปัญหาไม่ใช่ว่าคุณพยายามไม่พอ",
};

export interface ProofLine {
  /** Key in the `shares` object returned by `stats.community`. */
  share: string;
  label: Copy;
}

export const PROOF_LINES: readonly ProofLine[] = [
  {
    // "Started" rather than "five or more", 14/08/2026. See the note on
    // `appliedAny` in `convex/stats.ts`: the volume figure came out at 22% and
    // argued against the heading above it. The claim this panel is making is
    // that these people are already in motion, which is what this measures.
    share: "appliedAny",
    label: {
      en: "have already started applying to roles in Europe",
      th: "เริ่มสมัครงานในยุโรปไปแล้ว",
    },
  },
  {
    share: "englishB2",
    label: {
      en: "already have English at the level European job adverts ask for",
      th: "มีทักษะภาษาอังกฤษอยู่ในระดับที่ประกาศงานในยุโรปต้องการ",
    },
  },
  {
    share: "cvNotForEurope",
    label: {
      en: "are still applying with a CV that was never adapted to the European market",
      th: "ยังสมัครงานด้วย CV ที่ไม่เคยปรับให้เข้ากับตลาดยุโรป",
    },
  },
];

export const PROOF_FOOT: Copy = {
  // No sample size. See the note on the return value in `convex/stats.ts`: how
  // many people have taken the check is PunProfile's own information, so the
  // footnote says who was counted and not how many.
  en: "From people who have taken the EU Fit Check, calculated from those who answered each question. The figures update as more people take it.",
  th: "ข้อมูลจากผู้ทำ EU Fit Check โดยคำนวณจากผู้ที่ตอบคำถามข้อนั้น ๆ ตัวเลขจะอัปเดตเมื่อมีผู้ทำแบบประเมินเพิ่มขึ้น",
};

export const PROOF_CONCLUSION: Copy = {
  en: "So the gap is not effort, and it is not English. It is getting experience from the Thai market across to a European employer. That takes specific expertise, and it is the work I do.",
  th: "ช่องว่างจึงไม่ได้อยู่ที่ความพยายามหรือภาษาอังกฤษ แต่อยู่ที่การถ่ายทอดประสบการณ์จากตลาดไทยให้นายจ้างยุโรปเข้าใจ งานนี้ต้องใช้ความเชี่ยวชาญเฉพาะ และนี่คืองานที่ผมทำ",
};

// ------------------------------------------------------------------ the machine

export const METHOD_HEADING: Copy = {
  en: "Before I give you advice, I show you what the assessment is based on.",
  th: "ก่อนให้คำแนะนำ ผมอยากให้คุณเห็นว่าเราใช้เกณฑ์อะไรในการประเมิน",
};

export const METHOD_INTRO: Copy = {
  en: "Advice whose source you cannot check is no different from one person's opinion delivered confidently. So I am opening up the whole framework behind it, including its limits and the things it cannot assess.",
  th: "คำแนะนำที่ตรวจสอบที่มาไม่ได้ก็ไม่ต่างจากความเห็นของใครสักคนที่พูดอย่างมั่นใจ ผมจึงเปิดกรอบการประเมินที่อยู่เบื้องหลังทั้งหมด รวมถึงข้อจำกัดและสิ่งที่กรอบนี้ประเมินไม่ได้",
};

export interface MethodStep {
  n: string;
  heading: Copy;
  /** Paragraphs, in order. Two of the four steps need a second one. */
  body: readonly Copy[];
}

export const METHOD: readonly MethodStep[] = [
  {
    n: "01",
    heading: { en: "Thirty-four assessed items", th: "กรอบประเมิน 34 ข้อ" },
    body: [
      {
        en: "Hiring decisions in Europe come from a number of factors that can be named and assessed. The framework behind the EU Fit Check divides them into thirty-four items, covering professional capability, readiness to apply, readiness to move country, and fit with the European market you are aiming at.",
        th: "การตัดสินใจจ้างงานในยุโรปขึ้นอยู่กับหลายปัจจัยที่สามารถระบุและประเมินได้ กรอบเบื้องหลัง EU Fit Check แบ่งออกเป็น 34 ข้อ ครอบคลุมทั้งทักษะในสายงาน การสมัครงาน ความพร้อมในการย้ายประเทศ และความเหมาะสมกับตลาดยุโรปที่คุณตั้งเป้าไว้",
      },
    ],
  },
  {
    n: "02",
    heading: { en: "Five a form can really assess", th: "มีแค่ 5 ข้อที่แบบประเมินวัดได้จริง" },
    body: [
      {
        en: "Of those thirty-four, only five can be assessed reliably from answers on a form. So we score those five, and show the rest as a hollow circle meaning “not assessed yet”, not a score of zero.",
        th: "ใน 34 ข้อนี้ มีเพียง 5 ข้อที่ประเมินจากคำตอบในแบบฟอร์มได้อย่างน่าเชื่อถือ เราจึงให้คะแนนเฉพาะ 5 ข้อนั้น ส่วนข้อที่เหลือจะแสดงเป็นวงกลมโปร่งเพื่อบอกว่า “ยังไม่ได้ประเมิน” ไม่ใช่คะแนนศูนย์",
      },
      {
        en: "Most tools fill in all thirty-four and then let you plan around numbers nobody can stand behind.",
        th: "เราไม่เติมคะแนนให้ครบเพียงเพื่อให้กราฟดูสมบูรณ์ เพราะตัวเลขที่ยืนยันไม่ได้ไม่ควรถูกนำไปใช้วางแผนชีวิตของคุณ",
      },
    ],
  },
  {
    n: "03",
    heading: { en: "A person really reads your answers", th: "มีคนอ่านคำตอบของคุณจริง ๆ" },
    body: [
      {
        en: "Before anyone contacts you, a person actually reads your answers. The things a form cannot answer are what the first conversation is for: the CV you are using, the roles you are applying to, and the reason your last application went unanswered.",
        th: "ก่อนติดต่อกลับ เราจะอ่านคำตอบของคุณจริง ๆ ส่วนที่แบบฟอร์มประเมินไม่ได้ เราจะคุยกันในการพูดคุยครั้งแรก ไม่ว่าจะเป็น CV ที่คุณใช้อยู่ ตำแหน่งที่กำลังสมัคร หรือเหตุผลที่ใบสมัครล่าสุดไม่ได้รับการตอบกลับ",
      },
    ],
  },
  {
    n: "04",
    heading: {
      en: "Measurable again, so you can see it change",
      th: "ทำซ้ำได้ และเห็นความเปลี่ยนแปลงจริง",
    },
    body: [
      {
        en: "We keep your answers as evidence, not just a score, so you can take the assessment again later and compare the charts.",
        th: "เราเก็บคำตอบของคุณไว้ ไม่ได้เก็บเพียงคะแนน คุณจึงกลับมาทำแบบประเมินอีกครั้งในภายหลังและเปรียบเทียบกราฟได้",
      },
      {
        en: "Work you cannot measure means taking it on faith that it is getting better, and in this market you have been asked to take enough on faith without evidence already.",
        th: "งานที่วัดผลไม่ได้ทำให้คุณต้องเชื่อไปก่อนว่าทุกอย่างกำลังดีขึ้น และในตลาดนี้ คุณถูกขอให้เชื่อคำพูดที่ไม่มีหลักฐานมามากพอแล้ว",
      },
    ],
  },
];

// -------------------------------------------------------------- who this is for

export const PERSONA_HEADING: Copy = {
  en: "Who this is for",
  th: "บริการนี้เหมาะกับใคร",
};

export const PERSONAS: readonly Copy[] = [
  {
    en: "Working Thai professionals with real experience, in any field, who have never had to explain that experience to a European reader.",
    th: "คนไทยวัยทำงานที่มีประสบการณ์จริง ไม่ว่าจะอยู่สายไหน แต่ยังไม่เคยต้องเล่าประสบการณ์นั้นให้คนยุโรปเข้าใจ",
  },
  {
    en: "People who have applied many times and got silence back instead of a rejection they could learn something from.",
    th: "คนที่สมัครมาหลายครั้ง แต่ได้รับความเงียบกลับมาแทนคำปฏิเสธที่พอจะนำไปปรับปรุงได้",
  },
  {
    en: "People weighing up whether to move at all, who want to decide on real information rather than on the mood of a good week or a bad one.",
    th: "คนที่กำลังชั่งใจว่าจะย้ายดีไหม และอยากตัดสินใจจากข้อมูลจริง ไม่ใช่อารมณ์ในวันที่รู้สึกมีหวังหรือหมดหวัง",
  },
  {
    en: "People planning to move with a partner or children, because this decision has never been only about a job.",
    th: "คนที่วางแผนย้ายพร้อมคู่ครองหรือลูก เพราะการตัดสินใจนี้ไม่เคยมีแค่เรื่องงาน",
  },
];

export const NOT_FOR_HEADING: Copy = {
  en: "And who it is not for",
  th: "และอาจไม่เหมาะกับคุณ ถ้า…",
};

export const NOT_FOR: readonly Copy[] = [
  {
    en: "People looking for a recruitment agency. PunProfile is paid by you, not by an employer, so there is no vacancy anyone has to push you towards.",
    th: "คนที่กำลังมองหาบริษัทจัดหางาน PunProfile รับค่าบริการจากคุณ ไม่ใช่นายจ้าง เราจึงไม่มีตำแหน่งที่ต้องพยายามผลักให้คุณสมัคร",
  },
  {
    en: "People who want a guarantee of a job or a visa. Nobody can guarantee that honestly, and anyone who makes you feel they can is selling you something else.",
    th: "คนที่ต้องการคำรับประกันว่าจะได้งานหรือวีซ่า ไม่มีใครรับประกันเรื่องนี้ได้อย่างซื่อสัตย์ ใครที่ทำให้คุณรู้สึกว่ารับประกันได้ อาจกำลังขายความหวังมากกว่าความจริง",
  },
  {
    en: "People who want it all done for them. The CV goes out under your name, and when the interview comes, the person sitting there is you.",
    th: "คนที่อยากให้เราทำทุกอย่างแทน CV ต้องส่งออกไปในชื่อของคุณ และเมื่อถึงเวลาสัมภาษณ์ คนที่ต้องนั่งอยู่ตรงนั้นก็คือคุณ",
  },
];

// ------------------------------------------------------------------ the coaches

/**
 * The two coaches, Paul and Tatiya (Dew), 30/10/2026. One record per person
 * feeds both places they appear: the two cards on the home page (name, role,
 * summary, pills, link) and their row on /coaching (pill, heading, pull line,
 * story). Copy from `founder-copy.md` in the coaching repo, Paul's review.
 *
 * **Tatiya's facts are not yet confirmed by her**: the name she uses, the
 * co-founder title, the years, 2017, Chulalongkorn by name and having job-hunted
 * abroad. Do not take this live until she has answered the questions at the
 * end of `founder-copy.md`.
 *
 * `id` is the anchor the home card links to on /coaching.
 */
export interface Coach {
  id: string;
  name: Copy;
  role: Copy;
  summary: Copy;
  pills: readonly Copy[];
  link: Copy;
  pill: Copy;
  heading: Copy;
  pull: Copy;
  story: readonly Copy[];
  alt: Copy;
}

export const COACHES: readonly Coach[] = [
  {
    id: "paul",
    name: { en: "Paul", th: "พอล" },
    role: { en: "Marketing Director in Europe · Founder of PunProfile", th: "Marketing Director ในยุโรป · ผู้ก่อตั้ง PunProfile" },
    summary: { en: "Once a Thai applicant sending CVs into Europe, now the person who reads the CVs that pass the screen and selects people for his team.", th: "เคยเป็นผู้สมัครชาวไทยที่ส่ง CV หางานในยุโรป วันนี้เป็นคนอ่าน CV ที่ผ่านการคัดกรองมาแล้ว และเลือกคนเข้าทีม" },
    pills: [
      { en: "Working in Europe since 2016", th: "ทำงานในยุโรปตั้งแต่ปี 2016" },
      { en: "Marketing and MarTech hiring", th: "คัดเลือกคนด้าน Marketing และ MarTech" },
    ],
    link: { en: "Read Paul's story", th: "อ่านเรื่องราวของพอล" },
    pill: { en: "Founder · Marketing Director", th: "ผู้ก่อตั้ง · Marketing Director" },
    heading: { en: "Hi, I'm Paul", th: "สวัสดีครับ ผมพอล" },
    pull: { en: "I have sat on both sides of the interview table.", th: "ผมเคยนั่งอยู่ทั้งสองฝั่งของโต๊ะสัมภาษณ์" },
    story: [
      { en: "I moved to Spain to work in 2016 and work with clients in countries across Europe, especially the UK. I have sent thousands of job applications and sat hundreds of interviews, so I know what it is like to send a CV and receive no reply.", th: "ผมย้ายมาทำงานที่สเปนในปี 2016 และทำงานกับลูกค้าในหลายประเทศทั่วยุโรป โดยเฉพาะใน UK ที่ผ่านมาผมสมัครงานไปหลายพันตำแหน่ง และสัมภาษณ์งานมาหลายร้อยครั้ง ผมจึงเข้าใจดีว่าการส่ง CV ไปแล้วไม่ได้รับคำตอบเป็นอย่างไร" },
      { en: "Today I am a Marketing Director. The CVs that reach me have already passed the AI screen and the Talent Acquisition Manager, and I have read hundreds of them, so I have seen not just good CVs but the ones that actually get the job. I also hire remote workers and freelancers in Marketing and MarTech for several employers.", th: "วันนี้ผมเป็น Marketing Director CV ที่มาถึงผมผ่านการคัดกรองจาก AI และ Talent Acquisition Manager มาแล้ว ผมอ่าน CV ระดับนี้มาหลายร้อยฉบับ จึงได้เห็นไม่ใช่แค่ CV ที่ดี แต่เป็น CV ที่ได้งานจริง นอกจากนี้ผมยังคัดเลือก remote worker และ freelancer ด้าน Marketing และ MarTech ให้กับหลายบริษัท" },
      { en: "I work in marketing, so when I look at a candidate’s profile, I ask similar questions to those I ask about a brand: what makes it stand out, what it wants to be known for, and whether the story is consistent. I also run the “Jobs at companies in Europe” group, where many people first get to know me.", th: "ผมทำงานด้านการตลาด เวลาดูโปรไฟล์ผู้สมัคร ผมจึงดูคล้ายกับเวลาดูแบรนด์ว่า จุดเด่นคืออะไร อยากให้คนจดจำในเรื่องไหน และสิ่งที่เล่ามาสอดคล้องกันหรือเปล่า ผมยังดูแลกลุ่ม “งานบริษัทในยุโรป” ด้วย หลายคนรู้จักผมครั้งแรกผ่านกลุ่มนี้" },
      { en: "A company name every Thai person knows may be a name a European hiring manager has never heard. Work we know was large and difficult can become one unremarkable line on a CV. And years of accumulated experience can be passed over, not because it has no value, but because the person reading it does not have enough context to see that value.", th: "ชื่อบริษัทที่คนไทยรู้จักดี อาจเป็นเพียงชื่อที่ผู้จัดการฝ่ายสรรหาในยุโรปไม่เคยได้ยิน งานที่เรารู้ว่าใหญ่และยาก อาจกลายเป็นเพียงหนึ่งบรรทัดธรรมดาใน CV และประสบการณ์ที่สั่งสมมาหลายปีอาจถูกมองข้าม ไม่ใช่เพราะมันไม่มีค่า แต่เพราะคนอ่านยังไม่มีบริบทมากพอที่จะเห็นคุณค่านั้น" },
      { en: "I have watched this happen again and again to Thai people in the group. When applications go unanswered, many of them try harder: send more, revise the CV again, read more advice. But in a cross-border job market, effort does not automatically turn into opportunity. If the market still cannot read you, applying more is just sending the same unclear story out over and over.", th: "ผมเห็นเรื่องนี้เกิดขึ้นซ้ำ ๆ กับคนไทยในกลุ่ม เมื่อสมัครงานแล้วไม่ได้รับคำตอบ หลายคนจึงพยายามมากขึ้น สมัครมากขึ้น แก้ CV อีกรอบ และอ่านคำแนะนำเพิ่มอีก แต่ในตลาดงานข้ามประเทศ ความพยายามไม่ได้กลายเป็นโอกาสโดยอัตโนมัติ ถ้าตลาดยังอ่านเราไม่ออก การสมัครเพิ่มก็เป็นเพียงการส่งเรื่องเดิมที่ยังไม่ชัดออกไปซ้ำ ๆ" },
    ],
    alt: { en: "Portrait of Paul Bussabong, coach and founder of PunProfile", th: "พอล บุษบง โค้ชและผู้ก่อตั้ง PunProfile" },
  },
  {
    id: "dew",
    name: { en: "Dew", th: "ดิว" },
    role: { en: "Principal Consultant, Executive Search, United States · Co-founder of PunProfile", th: "Principal Consultant ด้าน Executive Search ในสหรัฐอเมริกา · ผู้ร่วมก่อตั้ง PunProfile" },
    summary: { en: "In recruitment and HR for more than 10 years, from Bangkok to the United States, and today selecting CVs to put forward to hiring managers.", th: "ทำงานด้าน recruitment และ HR มากว่า 10 ปี เริ่มจากกรุงเทพฯ จนมาถึงสหรัฐอเมริกา วันนี้เป็นคนคัดเลือก CV เพื่อส่งต่อให้ hiring manager" },
    pills: [
      { en: "Recruitment and HR, 10+ years", th: "สาย recruitment และ HR กว่า 10 ปี" },
      { en: "BA Chulalongkorn · MA in HR, US", th: "ป.ตรี จุฬาฯ · ป.โท HR ที่สหรัฐฯ" },
    ],
    link: { en: "Read Dew's story", th: "อ่านเรื่องราวของดิว" },
    pill: { en: "Co-founder · Executive Search", th: "ผู้ร่วมก่อตั้ง · Executive Search" },
    heading: { en: "Hi, I'm Dew", th: "สวัสดีค่ะ ชื่อดิวค่ะ" },
    pull: { en: "I select the CVs that go forward to the hiring manager.", th: "ดิวเป็นคนคัดเลือก CV เพื่อส่งต่อให้ hiring manager" },
    story: [
      { en: "I am currently a Principal Consultant in Executive Search in the United States. I joined the firm as a recruitment consultant before progressing to my current role. My work involves finding candidates for clients, reading CVs, and selecting suitable candidates to put forward to the hiring manager.", th: "ปัจจุบันดิวเป็น Principal Consultant ดูแลงาน Executive Search หรือการสรรหาผู้บริหาร อยู่ที่สหรัฐอเมริกา ดิวเริ่มทำงานกับบริษัทนี้ในตำแหน่ง recruitment consultant ก่อนเติบโตมารับหน้าที่ปัจจุบัน งานของดิวคือหาผู้สมัครให้ลูกค้า อ่าน CV และคัดเลือกคนที่เหมาะสมเพื่อส่งต่อให้ hiring manager พิจารณา" },
      { en: "I have worked in recruitment and HR for more than 10 years. I started in IT recruitment in Bangkok, then worked in change management consulting and HR at a Thai company, before moving to the United States to study and work in 2017.", th: "ดิวทำงานด้าน recruitment และ HR มากว่า 10 ปี เริ่มจากงานสรรหาคนสาย IT ที่กรุงเทพฯ จากนั้นทำงานที่ปรึกษาด้านการบริหารการเปลี่ยนแปลง และงาน HR ในบริษัทไทย ก่อนย้ายมาเรียนต่อและทำงานที่สหรัฐอเมริกาในปี 2017" },
      { en: "I read Thai candidates’ CVs when I worked in recruitment in Bangkok and have applied for jobs abroad myself. Today I read CVs and select candidates to put forward to clients. From that experience, I have seen that what Thai applicants write in their CVs does not always give recruiters the information they need to make a decision. In my view, this is something we can make clearer; it does not mean you are not good enough.", th: "ดิวเคยอ่าน CV ของผู้สมัครชาวไทยตั้งแต่ทำงาน recruitment ที่กรุงเทพฯ และเคยส่ง CV สมัครงานในต่างประเทศด้วยตัวเอง วันนี้ดิวเป็นคนอ่าน CV และคัดเลือกผู้สมัครเพื่อส่งต่อให้ลูกค้า จากประสบการณ์นี้ ดิวเห็นว่าบางครั้งสิ่งที่ผู้สมัครชาวไทยเขียนใน CV ยังไม่ตรงกับข้อมูลที่ recruiter ต้องการใช้ตัดสินใจ ในมุมของดิว นี่เป็นเรื่องที่ปรับให้ชัดขึ้นได้ ไม่ได้แปลว่าคุณเก่งไม่พอ" },
      { en: "My studies are in psychology and HR: a BA in Industrial and Organisational Psychology from Chulalongkorn University, and an MA in Human Resources Management from a university in San Diego.", th: "ดิวเรียนมาทางด้านจิตวิทยาและ HR โดยตรง จบปริญญาตรีด้านจิตวิทยาอุตสาหกรรมและองค์การจากจุฬาลงกรณ์มหาวิทยาลัย และปริญญาโทด้านการบริหารทรัพยากรบุคคลจากมหาวิทยาลัยในซานดิเอโก" },
    ],
    alt: { en: "Portrait of Tatiya (Dew) Doyle, coach and co-founder of PunProfile", th: "ดิว ทาทิยา ดอยล์ โค้ชและผู้ร่วมก่อตั้ง PunProfile" },
  },
];

// ------------------------------------------------------- why we do this

/** The hinge of the section, set apart from the paragraphs on either side. */
export const FOUNDER_TURN: Copy = {
  en: "That is why we do PunProfile.",
  th: "นี่คือเหตุผลที่เราทำ PunProfile",
};

/** After the turn. What he does about it, and what he will not do. */
export const FOUNDER_AFTER: readonly Copy[] = [
  {
    // Read back 06/09/2026, and `ผม` to `เรา` held.
    // What coaching is, is a claim about the method and never was Paul's
    // opinion, so it moves to the shared voice cleanly. See
    // `founder-section-we.md` for which paragraphs could not.
    en: "For us, career coaching is not writing you a new story that makes you look better than you are. It is helping you see who your existing experience is valuable to, which direction you should be heading, and how to tell your own story so another market understands it.",
    // Paul's wording, 06/09/2026, and the read-back this comment was asking for.
    // The worry it recorded was real: the term had been swapped and not a word
    // around it, and an English phrase dropped into the middle of his Thai is
    // the kind of change that is right as a rule and wrong in a particular
    // voice. He rewrote the sentence around it rather than accepting the swap:
    // `เขียนเรื่องใหม่` became `แต่งเรื่องใหม่`, `ดูเก่งกว่า` became `ดูดีกว่า`,
    // and the closing clause reads `คนในตลาดอื่น` rather than `คนอีกตลาด`.
    th: "สำหรับเรา Career Coaching ไม่ใช่การแต่งเรื่องใหม่ให้คุณดูดีกว่าความเป็นจริง แต่คือการช่วยให้คุณมองเห็นว่าประสบการณ์ที่มีอยู่ของคุณมีคุณค่าสำหรับใคร ควรมุ่งหน้าไปทางไหน และจะเล่าเรื่องของตัวเองอย่างไรให้คนในตลาดอื่นเข้าใจ",
  },
  {
    // Read back 06/09/2026, and `ผม` to `เรา` held.
    // The minimum change. This paragraph is the one Dew changes most and not by
    // wording: ten years in US placement means one of them did the recruiting
    // job before choosing not to do it here. That is his to write.
    en: "In our career coaching work, we start by asking “what kind of work suits you?” and then look at how to get there. PunProfile is not a recruitment agency, so we do not start from vacancies we need to fill.",
    // Paul's wording, 06/09/2026. `นายหน้าจัดหางาน` became `บริษัทจัดหางาน`,
    // which is the form the published disclaimer in `footer.ts` already uses, so
    // the page and the legal line now name the same thing. Both quoted questions
    // were opened out: "อะไรเหมาะกับคุณ" to "งานแบบไหนเหมาะกับคุณ", and
    // "จะนำคุณไปใส่ในตำแหน่งไหนได้บ้าง" to
    // "มีตำแหน่งว่างไหนที่เราจะส่งคุณเข้าไปได้บ้าง".
    th: "ในงาน Career Coaching เราเริ่มจากคำถามว่า “งานแบบไหนเหมาะกับคุณ” แล้วค่อยดูว่าจะไปถึงงานนั้นได้อย่างไร ส่วน PunProfile ไม่ใช่บริษัทจัดหางาน เราจึงไม่ได้เริ่มจากตำแหน่งว่างที่ต้องหาคนไปลง",
  },
  {
    en: "PunProfile is paid by you, not by an employer. Our advice therefore starts from your goals and circumstances, not from the needs of a company rushing to hire.",
    th: "ปั้นโปรไฟล์ (PunProfile) รับค่าบริการจากคุณ ไม่ใช่นายจ้าง คำแนะนำจึงยึดเป้าหมายและสถานการณ์ของคุณเป็นหลัก ไม่ใช่ความต้องการของบริษัทที่กำลังเร่งหาคน",
  },
  {
    // Read back 06/09/2026, and `ผม` to `เรา` held.
    en: "In the end, you are still the one walking this road. Our job is to make sure you are not guessing the whole way: to let you know what you already have in hand, what is still missing, and what the next step should be.",
    th: "สุดท้ายคุณยังเป็นคนที่ต้องเดินเส้นทางนี้ด้วยตัวเอง งานของเราคือช่วยให้คุณไม่ต้องคาดเดาไปตลอดทาง ให้คุณรู้ว่ามีอะไรอยู่ในมือแล้ว ยังขาดอะไร และควรก้าวต่อไปทางไหน",
  },
];

// ------------------------------------------------------------------- the close

export const CLOSE_LEAD: Copy = {
  en: "If any of that landed, the next step is not a form. It is a conversation.",
  th: "ถ้ามีข้อไหนตรงกับคุณ ขั้นต่อไปไม่ใช่การกรอกฟอร์ม แต่คือการได้คุยกัน",
};

/** Alt text. Describes what the picture shows, not what the brand means by it. */
export const MASCOT_ALT: Copy = {
  en: "The PunProfile character climbing steps towards a signpost",
  th: "ภาพการ์ตูน PunProfile เดินขึ้นบันไดไปยังป้ายบอกทาง",
};

