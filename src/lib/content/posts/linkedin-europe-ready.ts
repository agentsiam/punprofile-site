import type { Post } from "../blog";

/**
 * `linkedin-europe-ready`: the LinkedIn fields that decide whether a European recruiter finds
 * and understands a Thai candidate. Thai edited in a delegated copy review
 * 10/11/2026 and NOT personally read back by Paul, so every string here is
 * `draft` with `structural_calque: pending`. English translated from that Thai.
 * Record: the coaching repo's `work-content/blog/linkedin-europe-ready/article.md`.
 */
export const LINKEDIN_EUROPE_READY: Post = {
  slug: "linkedin-europe-ready",
  topic: "how-to",
  playbook: true,
  published: "2026-11-13",
  related: "start-in-europe",

  title: {
    th: "ปรับโปรไฟล์ LinkedIn ให้ recruiter ในยุโรปค้นเจอและเข้าใจประสบการณ์ของคุณ",
    en: "Make your LinkedIn profile something a European recruiter can find, and understand",
  },
  seoTitle: {
    th: "ปรับโปรไฟล์ LinkedIn ให้ recruiter ในยุโรปค้นเจอ",
    en: "Make your LinkedIn profile findable by European recruiters",
  },
  summary: {
    th: "ถ้าคุณกำลังสมัครงานในยุโรป ลองแยกการปรับ LinkedIn เป็นสองเรื่อง: ตั้งค่าให้ recruiter หาโปรไฟล์คุณเจอง่ายขึ้น แล้วเขียนให้เขาเข้าใจว่าคุณทำอะไรมา",
    en: "If you are applying for jobs in Europe, treat LinkedIn as two jobs rather than one: set it up so a recruiter can find your profile more easily, then write it so they understand what you have done.",
  },
  image: {
    src: "/blog/linkedin-europe-ready.jpg",
    alt: {
      th: "ตัวละครดินปั้นยืนข้างแท็บเล็ตที่แสดงโปรไฟล์ LinkedIn ตัวอย่าง",
      en: "A clay figure standing beside a tablet showing an example LinkedIn profile",
    },
  },
  question: {
    th: "ลองอ่านสองบรรทัดแรกของโปรไฟล์ตัวเองในมุมของ recruiter ที่ไม่รู้จักบริษัทเดิมของคุณ เขาจะเข้าใจไหมว่าคุณทำงานด้านไหน มีจุดเด่นอะไร และกำลังมองหาตำแหน่งแบบไหน",
    en: "Read the first two lines of your own profile as a recruiter would, one who does not know your former employer. Would they understand what field you work in, what you are good at, and what kind of role you are looking for?",
  },

  sections: [

    {
      heading: {
        th: "สรุปสั้น ๆ",
        en: "Short summary",
      },
      body: [
      {
        kind: "p",
        text: {
          th: "ก่อนที่ recruiter จะได้อ่านโปรไฟล์ของคุณ เขาอาจค้นหาผู้สมัครจากข้อมูลอย่างชื่อตำแหน่ง ทักษะ หรือสถานที่ทำงานที่ต้องการ การเขียนให้ดีจึงเป็นเพียงครึ่งหนึ่งของงาน อีกครึ่งคือการกรอกข้อมูลให้ตรงกับงานที่คุณเล็งไว้",
          en: "Before a recruiter reads your profile, they may search for candidates on things like job title, skills, or preferred work location. Writing it well is only half the job. The other half is filling in the fields so they match the work you are aiming at.",
        },
      },
      {
        kind: "p",
        text: {
          th: "ถ้าคุณสมัครจากไทย ลองเริ่มจากช่องที่ช่วยให้คนค้นเจอคุณ เช่น ตำแหน่งและประเทศเป้าหมาย แล้วค่อยปรับคำอธิบายประสบการณ์ให้คนที่ไม่รู้จักตลาดไทยอ่านเข้าใจ",
          en: "If you are applying from Thailand, start with the fields that help people find you, such as your target role and country, and only then adjust how you describe your experience for a reader who does not know the Thai market.",
        },
      },
      ],
    },
    {
      heading: {
        th: "1. ปรับให้ค้นเจอก่อน แล้วเขียนให้คนอ่านเข้าใจ",
        en: "1. Be findable first, then be understood",
      },
      body: [
      {
        kind: "p",
        text: {
          th: "เรซูเม่ช่วยให้คนอ่านเห็นว่าคุณเหมาะกับตำแหน่งที่สมัครอย่างไร ส่วนบน LinkedIn คุณยังต้องกรอกข้อมูลที่ช่วยให้ recruiter ค้นเจอโปรไฟล์ด้วย",
          en: "A CV shows a reader how you fit the role you applied for. On LinkedIn you also have to fill in the information that helps a recruiter find your profile in the first place.",
        },
      },
      {
        kind: "p",
        text: {
          th: "LinkedIn ระบุว่าการกรอกประเภทงานและสถานที่ทำงานที่ต้องการใน Open to Work ช่วยให้ recruiter หาโปรไฟล์คุณเจอง่ายขึ้น จุดนี้แก้ที่การตั้งค่า ไม่ใช่การเขียนส่วนแนะนำตัวให้ยาวขึ้น",
          en: "LinkedIn says that filling in the types of job you want and your preferred work location under Open to Work makes it easier for a recruiter to find your profile. That is fixed in the settings, not by writing a longer About section.",
        },
        cite: { label: "LinkedIn Help", href: "https://www.linkedin.com/help/linkedin/answer/a507508" },
      },
      {
        kind: "p",
        text: {
          th: "LinkedIn ระบุว่า Hiring Assistant ช่วย recruiter ค้นหาผู้สมัครหลายครั้งเพื่อจัดทำรายชื่อคนที่ตรงกับตำแหน่ง ข้อมูลที่ LinkedIn เผยแพร่สำหรับผลิตภัณฑ์นี้ ลงวันที่กรกฎาคม 2026 ระบุว่า recruiter ที่ใช้เครื่องมือเปิดดูโปรไฟล์น้อยลง 83%",
          en: "LinkedIn says Hiring Assistant runs searches for recruiters to assemble a list of people matching a role. The figures LinkedIn publishes for that product, dated July 2026, say recruiters using the tool view 83% fewer profiles.",
        },
        cite: { label: "LinkedIn Help", href: "https://business.linkedin.com/talent-solutions/hiring-assistant" },
      },
      {
        kind: "p",
        text: {
          th: "ตัวเลขนี้มาจาก LinkedIn ซึ่งรายงานผลของผลิตภัณฑ์ตัวเอง ไม่ใช่งานศึกษาอิสระ และไม่ได้หมายความว่า recruiter ทุกคนเปิดดูโปรไฟล์น้อยลงเท่ากัน",
          en: "That number comes from LinkedIn reporting on its own product, not from an independent study, and it does not mean every recruiter views fewer profiles to the same degree.",
        },
      },
      {
        kind: "figure",
        src: "/blog/linkedin-europe-ready-fig-1-first-action.jpg",
        alt: {
          th: "กราฟแท่งแสดงสัดส่วนของเรื่องที่ควรแก้ก่อน แถบ CV ยาวที่สุด ส่วน LinkedIn อยู่ลำดับที่ 3",
          en: "A bar chart of the share for each thing to fix first. The CV bar is the longest and LinkedIn is third.",
        },
        caption: {
          th: "สัดส่วนของขั้นตอนแรกที่ PunProfile แนะนำแก่ผู้ที่ทำแบบประเมินความพร้อมเสร็จ",
          en: "The share of each first step PunProfile assigns to the people who completed its readiness check.",
        },
      },
      {
        kind: "p",
        text: {
          th: "ในกลุ่มคนไทยที่ทำแบบประเมินความพร้อมของ PunProfile นั้น LinkedIn อยู่ลำดับที่สามของเรื่องที่ต้องแก้ก่อน",
          en: "Among the Thai professionals who have taken PunProfile's readiness check, LinkedIn is the third thing on the list of what to fix first.",
        },
      },
      {
        kind: "p",
        text: {
          th: "ถ้ายังไม่ได้เลือกตลาดเป้าหมายหรือ CV ยังไม่พร้อม ให้จัดการสองเรื่องนั้นก่อน แล้วค่อยกลับมาปรับ LinkedIn",
          en: "If you have not chosen a target market yet, or your CV is not ready, deal with those two first and come back to LinkedIn afterwards.",
        },
      },
      ],
    },
    {
      heading: {
        th: "2. เลือกประเทศและตำแหน่งเป้าหมายก่อนปรับโปรไฟล์",
        en: "2. Choose your target country and role before you edit the profile",
      },
      body: [
      {
        kind: "p",
        text: {
          th: "เริ่มจากตอบให้ได้ก่อนว่าคุณอยากสมัครตำแหน่งอะไรและในประเทศไหน",
          en: "Start by being able to answer what role you want to apply for, and in which country.",
        },
      },
      {
        kind: "p",
        text: {
          th: "ถ้ายังเลือกเป้าหมายไม่ได้ การเปลี่ยนชื่อตำแหน่งบน LinkedIn อาจดูเหมือนคืบหน้า แต่ยังไม่รู้ว่ากำลังปรับให้ใครอ่าน เมื่อเป้าหมายชัดแล้ว คุณจะเลือกได้ว่าควรใช้ชื่อตำแหน่งไหน ใส่ทักษะอะไร และอธิบายงานเดิมอย่างไร",
          en: "If you cannot name the target yet, changing your job title on LinkedIn may feel like progress, but you do not know who you are editing it for. Once the target is clear, you can choose which job title to use, which skills to add, and how to describe your previous work.",
        },
      },
      {
        kind: "p",
        text: {
          th: "ถ้ายังตัดสินใจไม่ได้ ให้เริ่มจากคู่มือ «อยากไปทำงานยุโรป เริ่มจากตรงไหน» เพื่อวางแผน 30 วันแรก",
          en: "If you cannot decide yet, start with the guide “Where to start if you want to work in Europe” and plan the first 30 days.",
        },
      },
      {
        kind: "p",
        text: {
          th: "ก่อนทำขั้นต่อไป ลองเติมประโยคนี้ให้ครบ: «กำลังมองหาตำแหน่ง [ชื่อตำแหน่ง] ในประเทศ [ชื่อประเทศ]»",
          en: "Before the next step, try completing this sentence: “I am looking for a [job title] role in [country].”",
        },
      },
      ],
    },
    {
      heading: {
        th: "3. ตั้งค่าตำแหน่งเป้าหมายและสถานที่ให้ตรงกับแผน",
        en: "3. Set your target role and location to match the plan",
      },
      body: [
      {
        kind: "p",
        text: {
          th: "เริ่มจากสองจุด: การตั้งค่างานที่สนใจและตำแหน่งที่ตั้งบนโปรไฟล์",
          en: "Start with two things: your job preferences, and the location on your profile.",
        },
      },
      {
        kind: "p",
        text: {
          th: "เปิดการตั้งค่างานที่สนใจใน Open to Work แล้วระบุชื่อตำแหน่ง สถานที่ทำงานที่ต้องการ รูปแบบการทำงาน เช่น เข้าออฟฟิศ ไฮบริด หรือทำงานทางไกล รวมถึงเวลาที่เริ่มงานได้และประเภทการจ้างงาน ข้อมูลเหล่านี้ช่วยให้ LinkedIn จับคู่โปรไฟล์กับงานที่คุณสนใจ",
          en: "Open your job preferences under Open to Work and enter your job titles, your preferred work location, the type of work such as on-site, hybrid or remote, along with when you can start and the employment types. This is what LinkedIn uses to match your profile to the jobs you are interested in.",
        },
      },
      {
        kind: "p",
        text: {
          th: "อีกจุดคือตำแหน่งที่ตั้งบนโปรไฟล์ ให้เลือกประเทศหรือภูมิภาคที่คุณอยู่จริง ส่วนช่องเมือง เขต หรือรหัสไปรษณีย์ที่ระบบแสดงจะขึ้นอยู่กับประเทศที่เลือก",
          en: "The other one is the location on your profile. Choose the country or region you actually live in. Whether a city, district or postal code field appears depends on the country you pick.",
        },
      },
      { kind: "sub", text: {
        th: "ควรตั้งตำแหน่งที่ตั้งบนโปรไฟล์เป็นเมืองที่อยากไปไหม",
        en: "Should you set your profile location to the city you want to move to?",
      } },
      {
        kind: "p",
        text: {
          th: "ถ้ายังไม่ได้ย้าย ไม่ควรตั้งโปรไฟล์เป็นเมืองที่ไม่ได้อยู่จริง หาก recruiter ถามว่าตอนนี้คุณอยู่ที่ไหนหรือต้องการสปอนเซอร์วีซ่าหรือไม่ คุณจะได้ตอบโดยไม่ต้องอธิบายว่าทำไมข้อมูลบนโปรไฟล์ไม่ตรงกัน",
          en: "If you have not moved yet, do not set your profile to a city you do not live in. When a recruiter asks where you are now, or whether you need visa sponsorship, you want to answer without also having to explain why your profile says something else.",
        },
      },
      {
        kind: "p",
        text: {
          th: "ใส่สถานที่ที่คุณอยู่จริงบนโปรไฟล์ แล้วระบุเมืองหรือประเทศที่อยากไปทำงานใน Open to Work",
          en: "Put the place you actually live on your profile, and put the city or country you want to work in under Open to Work.",
        },
      },
      {
        kind: "p",
        text: {
          th: "ลองดูประกาศงานจริงเพื่อหาว่าตลาดนั้นใช้ชื่อตำแหน่งอะไร แล้วนำมาใช้ในช่องตำแหน่งเป้าหมาย ระบุรูปแบบการทำงานตามจริงด้วย เช่น รับงานทางไกลจากกรุงเทพฯ หรือพร้อมย้ายประเทศ",
          en: "Look at real job ads to find the job titles that market uses, and use those in the target role field. State the type of work honestly too, such as remote from Bangkok, or ready to relocate.",
        },
      },
      ],
    },
    {
      heading: {
        th: "4. ใครเห็นว่าคุณกำลังเปิดรับงาน",
        en: "4. Who sees that you are open to work",
      },
      body: [
      {
        kind: "p",
        text: {
          th: "ถ้ายังทำงานอยู่ ให้เลือกก่อนว่าอยากให้ใครเห็นสถานะ Open to Work ของคุณ",
          en: "If you are still employed, decide first who you want to be able to see your Open to Work status.",
        },
      },
      {
        kind: "p",
        text: {
          th: "LinkedIn ให้เลือกได้ ว่าจะเก็บการตั้งค่างานไว้ดูเอง เปิดให้ผู้ใช้ LinkedIn Recruiter เห็น หรือเปิดให้สมาชิกทุกคนเห็น ตัวเลือกสุดท้ายจะแสดงกรอบ #OpenToWork บนรูปโปรไฟล์ด้วย",
          en: "LinkedIn lets you choose to keep your job preferences visible only to yourself, to share them with LinkedIn Recruiter users, or to share them with all members. The last option also adds the #OpenToWork frame to your profile photo.",
        },
        cite: { label: "LinkedIn Help", href: "https://www.linkedin.com/help/linkedin/answer/a507508" },
      },
      {
        kind: "p",
        text: {
          th: "ถ้าเลือก Recruiters only ผู้ใช้ LinkedIn Recruiter อาจเห็นข้อมูลที่คุณแชร์ เช่น ตำแหน่งที่สนใจและประเภทการจ้างงาน LinkedIn พยายามซ่อนข้อมูลนี้จาก recruiter ที่บริษัทปัจจุบันของคุณ แต่ ไม่ได้รับประกันว่าจะซ่อนได้ทั้งหมด",
          en: "If you choose Recruiters only, LinkedIn Recruiter users may see what you have shared, such as the roles you are interested in and the employment types. LinkedIn tries to hide this from recruiters at your current employer, but does not guarantee it can hide it completely.",
        },
        cite: { label: "LinkedIn Help", href: "https://www.linkedin.com/help/linkedin/answer/a507593" },
      },
      {
        kind: "p",
        text: {
          th: "ถ้าไม่พร้อมรับความเสี่ยงที่บริษัทปัจจุบันอาจเห็น ให้เก็บการตั้งค่างานไว้ดูเองและใช้สำหรับรับคำแนะนำงาน",
          en: "If you are not ready to carry the risk that your current employer may see it, keep your job preferences visible only to yourself and use them to get job recommendations.",
        },
      },
      {
        kind: "figure",
        src: "/blog/linkedin-europe-ready-fig-2-who-can-see.jpg",
        alt: {
          th: "ตัวละครดินปั้นถือโคมไฟเหนือแถวการ์ดบนโต๊ะ การ์ดตรงกลางเป็นสีเขียว ส่วนการ์ดด้านข้างเป็นสีครีม",
          en: "A clay figure holds a desk lamp over a row of cards on a table. The cards in the middle are green and the ones to each side are cream.",
        },
        caption: {
          th: "Open to Work มี 3 ตัวเลือก: เก็บการตั้งค่าไว้ดูเอง ให้เฉพาะผู้ใช้ LinkedIn Recruiter เห็น หรือให้สมาชิกทุกคนเห็น ตัวเลือกเฉพาะ recruiter ช่วยลดโอกาสที่บริษัทปัจจุบันจะเห็น แต่ไม่ได้รับประกันว่าจะซ่อนได้ทั้งหมด",
          en: "Open to Work has three settings: keep it to yourself, show it to LinkedIn Recruiter users, or show it to every member. The recruiters-only setting lowers the chance your current employer sees it, but it is not a guarantee.",
        },
      },
      ],
    },
    {
      heading: {
        th: "5. เขียนให้ recruiter เข้าใจงานที่คุณเคยทำ",
        en: "5. Write so a recruiter understands the work you did",
      },
      body: [
      {
        kind: "p",
        text: {
          th: "เมื่อ recruiter เปิดโปรไฟล์แล้ว คำถามต่อไปคือเขาเข้าใจไหมว่าคุณเคยรับผิดชอบอะไรและทำได้ดีแค่ไหน โดยเฉพาะถ้าเขาไม่รู้จักบริษัทเดิมของคุณ",
          en: "Once a recruiter opens your profile, the next question is whether they can tell what you were responsible for and how well you did it, especially if they do not know your previous employer.",
        },
      },
      {
        kind: "p",
        text: {
          th: "ชื่อตำแหน่งที่บริษัทไทยใช้ไม่จำเป็นต้องสื่อระดับงานเดียวกันในยุโรป ส่วนบริษัทที่คนไทยรู้จักดีอาจไม่เป็นที่รู้จักในตลาดนั้น ให้เติมบริบทที่คนอ่านต้องใช้เพื่อเข้าใจขอบเขตงาน",
          en: "A job title used by a Thai company does not necessarily signal the same level in Europe, and a company Thai people know well may be unknown in that market. Add the context a reader needs in order to understand the scope of the work.",
        },
      },
      {
        kind: "p",
        text: {
          th: "เก็บชื่อตำแหน่งจริงไว้ แล้วอธิบายขอบเขตงานด้วยคำที่คนในตลาดเป้าหมายเข้าใจ เช่น ถ้าชื่อตำแหน่งคือ Assistant Vice President, Customer Operations ให้ระบุในคำอธิบายว่าคุณดูแลทีมศูนย์บริการลูกค้า 12 คน คนอ่านจะเห็นขนาดทีมและหน้าที่โดยไม่ต้องเดาจากชื่อตำแหน่ง",
          en: "Keep your real job title, and describe the scope of the work in words the target market understands. If the title is Assistant Vice President, Customer Operations, say in the description that you ran a 12-person contact centre team. The reader then sees the size of the team and the responsibility without having to guess from the title.",
        },
      },
      {
        kind: "figure",
        src: "/blog/linkedin-europe-ready-fig-3-title-rewrite.jpg",
        alt: {
          th: "การ์ดสองใบวางเทียบกัน ทั้งสองใบใช้ชื่อตำแหน่งเดียวกัน ส่วนการ์ดด้านขวามีคำอธิบายงานและข้อมูลบริษัทเพิ่ม",
          en: "Two cards side by side with the same job title. The one on the right adds a description of the work and context on the employer.",
        },
        caption: {
          th: "ตัวอย่างสมมติที่ใช้ชื่อตำแหน่งเดียวกันทั้งสองฝั่ง ฝั่งขวาอธิบายขอบเขตงานและบริบทบริษัทเพิ่ม",
          en: "An invented example with the same job title on both sides. The right side adds the scope of the work and context on the employer.",
        },
      },
      {
        kind: "p",
        text: {
          th: "ใต้ชื่อบริษัทเดิม เพิ่มคำอธิบายสั้น ๆ ว่าบริษัททำอะไร อยู่ในตลาดไหน และมีขนาดประมาณเท่าไร ถ้าใช้ตัวเลข ให้ใช้ตัวเลขที่ตรวจสอบได้",
          en: "Under each former employer, add a short line about what the company does, which market it is in, and roughly how big it is. If you use a number, use one that can be checked.",
        },
      },
      {
        kind: "p",
        text: {
          th: "เลือกทักษะจากงานที่คุณอยากสมัคร ลองอ่านประกาศจริง 3 ตำแหน่งแล้วดูว่าทักษะไหนปรากฏซ้ำ หากคุณมีทักษะนั้นจริง ให้ใช้คำเดียวกับประกาศในโปรไฟล์ เพื่อให้คนอ่านเข้าใจว่าตรงกัน",
          en: "Choose your skills from the jobs you want to apply for. Read three real ads and see which skills come up repeatedly. If you genuinely have that skill, use the same wording as the ad on your profile, so a reader can see that it matches.",
        },
      },
      {
        kind: "p",
        text: {
          th: "LinkedIn ระบุ ว่าการเพิ่มทักษะและระบุงานที่สนใจเกี่ยวข้องกับการแสดงผลของ Top Applicant คุณอัปเดตข้อมูลสองส่วนนี้ได้โดยไม่ต้องซื้อ Premium",
          en: "LinkedIn says that adding skills and setting the jobs you are interested in are both connected to whether the Top Applicant feature appears. You can update both of those without buying Premium.",
        },
        cite: { label: "LinkedIn Help", href: "https://www.linkedin.com/help/linkedin/answer/a554236" },
      },
      ],
    },
    {
      heading: {
        th: "6. ระบุสิทธิ์ทำงานและความจำเป็นเรื่องสปอนเซอร์วีซ่า",
        en: "6. State your right to work and whether you need visa sponsorship",
      },
      body: [
      {
        kind: "p",
        text: {
          th: "ถ้ายังไม่มีสิทธิ์ทำงานในประเทศเป้าหมาย ให้เตรียมอธิบายสถานะของคุณและเงื่อนไขที่นายจ้างต้องทราบ",
          en: "If you do not yet have the right to work in your target country, be ready to explain your status and the conditions an employer needs to know about.",
        },
      },
      {
        kind: "p",
        text: {
          th: "ถ้าต้องให้นายจ้างสปอนเซอร์วีซ่า ให้บอกตามจริง หากกำลังดูเส้นทางอย่าง EU Blue Card ให้ตรวจเงื่อนไขของประเทศและตำแหน่งนั้นก่อน อย่าเขียนว่าคุณเข้าเกณฑ์จากวุฒิหรือเงินเดือนอย่างเดียว",
          en: "If you need an employer to sponsor a visa, say so plainly. If you are looking at a route such as the EU Blue Card, check the conditions for that country and that role first. Do not write that you qualify on the strength of your degree or your salary alone.",
        },
      },
      {
        kind: "p",
        text: {
          th: "ในส่วนแนะนำตัว (About) คุณอาจใส่หนึ่งบรรทัดว่าอยู่ที่ไหน พร้อมย้ายหรือไม่ และต้องให้นายจ้างช่วยเรื่องวีซ่าหรือเปล่า ให้ระบุเฉพาะข้อมูลที่คุณพร้อมเปิดเผยบนโปรไฟล์",
          en: "In your About section you can put one line saying where you are, whether you are ready to relocate, and whether you would need an employer's help with a visa. Put in only what you are ready to have on a public profile.",
        },
      },
      {
        kind: "p",
        text: {
          th: "ถ้าไม่อยากเปิดเผยเรื่องนี้บนโปรไฟล์ ให้เตรียมคำตอบไว้และแจ้ง recruiter ตั้งแต่เริ่มคุยเมื่อมีตำแหน่งที่สนใจ",
          en: "If you would rather not have this on your profile, prepare your answer and tell the recruiter early in the conversation when a role comes up.",
        },
      },
      ],
    },
    {
      heading: {
        th: "7. เพิ่มการยืนยันบนโปรไฟล์ หากมีตัวเลือกให้ใช้",
        en: "7. Add verification to your profile, where the option exists",
      },
      body: [
      {
        kind: "p",
        text: {
          th: "เครื่องหมายยืนยันช่วยให้คนอ่านเห็นว่าข้อมูลส่วนใดบนโปรไฟล์ผ่านการตรวจสอบแล้ว",
          en: "A verification mark shows a reader which parts of your profile have been checked.",
        },
      },
      {
        kind: "p",
        text: {
          th: "ถ้าคุณสมัครจากไทย นายจ้างอาจไม่รู้จักมหาวิทยาลัยหรือบริษัทเดิมของคุณ การเติมบริบทและยืนยันข้อมูลที่ทำได้จึงช่วยให้เขาเข้าใจโปรไฟล์ได้ง่ายขึ้น",
          en: "If you are applying from Thailand, an employer may not know your university or your former employer. Adding context, and verifying what you can, makes your profile easier for them to read.",
        },
      },
      {
        kind: "p",
        text: {
          th: "LinkedIn ระบุว่า Hiring Assistant ใช้ข้อมูลจาก LinkedIn และสัญญาณประกอบ เช่น การยืนยันบนโปรไฟล์ ข้อมูลนี้ไม่ได้บอกว่าการยืนยันจะเพิ่มโอกาสได้สัมภาษณ์เท่าไร",
          en: "LinkedIn says Hiring Assistant uses LinkedIn data along with supporting signals such as verifications on a profile. That does not tell you how much verification improves your chances of an interview.",
        },
        cite: { label: "LinkedIn Help", href: "https://business.linkedin.com/talent-solutions/hiring-assistant" },
      },
      {
        kind: "p",
        text: {
          th: "ลองดูว่าโปรไฟล์ของคุณมีตัวเลือกยืนยันตัวตน สถานที่ทำงาน หรือการศึกษาหรือไม่ แล้วเลือกยืนยันเฉพาะข้อมูลที่ตรงกับคุณ",
          en: "Check whether your profile offers the option to verify your identity, your workplace or your education, and verify only what is true of you.",
        },
      },
      ],
    },
    {
      heading: {
        th: "8. เขียนส่วนแนะนำตัวให้เห็นบทบาทและผลงาน",
        en: "8. Write an About section that shows your role and your results",
      },
      body: [
      {
        kind: "p",
        text: {
          th: "ถ้าส่วนแนะนำตัวยังอ่านแล้วไม่รู้ว่าคุณทำอะไร ลองดูว่าคุณใช้พื้นที่ไปกับการอธิบายหน้าที่หรือเล่าผลงานของทีมมากกว่าบทบาทของตัวเองหรือเปล่า",
          en: "If your About section still does not tell a reader what you do, look at whether you have spent the space describing duties, or describing the team's results rather than your own part in them.",
        },
      },
      {
        kind: "p",
        text: {
          th: "เวลาพูดถึงผลงานของทีม ให้ระบุด้วยว่าคุณรับผิดชอบส่วนไหนและช่วยให้ผลลัพธ์เปลี่ยนไปอย่างไร คนอ่านที่ไม่รู้จักทีมเดิมของคุณจะได้เห็นว่าคุณมีส่วนอย่างไร",
          en: "When you mention a team result, also say which part you were responsible for and how you changed the outcome. A reader who does not know your old team can then see what your contribution was.",
        },
      },
      {
        kind: "p",
        text: {
          th: "แทนที่จะเขียนเพียงว่า «เป็นส่วนหนึ่งของทีมที่ปรับปรุงกระบวนการ» ให้ระบุว่าคุณปรับขั้นตอนไหน ผลเปลี่ยนไปอย่างไร และมีตัวเลขอะไรที่ใช้ยืนยันได้",
          en: "Instead of writing only “was part of a team that improved the process”, say which step you changed, how the result changed, and what number backs it up.",
        },
      },
      ],
    },
    {
      heading: {
        th: "9. โปรไฟล์ภาษาไทย ภาษาอังกฤษ หรือทั้งสองภาษา",
        en: "9. A Thai profile, an English one, or both",
      },
      body: [
      {
        kind: "p",
        text: {
          th: "LinkedIn รองรับโปรไฟล์มากกว่าหนึ่งภาษา คุณจึงแยกฉบับภาษาไทยและภาษาอังกฤษได้",
          en: "LinkedIn supports more than one profile language, so you can keep a Thai version and an English version separately.",
        },
      },
      {
        kind: "p",
        text: {
          th: "เพิ่มโปรไฟล์ภาษาอื่นผ่าน LinkedIn บนคอมพิวเตอร์ แล้วใส่เนื้อหาในภาษานั้นเอง ระบบไม่ได้แปลหรืออัปเดตเนื้อหาอีกภาษาให้ตามโปรไฟล์หลัก",
          en: "Add the other language through LinkedIn on a computer, and put the content in that language yourself. It does not translate for you, and it does not update the second language when you change the primary profile.",
        },
      },
      {
        kind: "p",
        text: {
          th: "ถ้าทำสองภาษา ให้แก้ทั้งสองฉบับเมื่อเปลี่ยนงานหรือเพิ่มผลงาน เพื่อไม่ให้ recruiter เปิดเจอข้อมูลเก่า",
          en: "If you keep both, edit both whenever you change jobs or add work, so a recruiter does not open the out-of-date one.",
        },
      },
      {
        kind: "p",
        text: {
          th: "ถ้าตำแหน่งที่คุณเล็งใช้ภาษาอังกฤษ ให้ใช้ภาษาอังกฤษเป็นโปรไฟล์หลัก และเพิ่มฉบับภาษาไทยถ้าคุณยังใช้ LinkedIn ติดต่อกับเครือข่ายในไทย",
          en: "If the roles you are aiming at are in English, make English your primary profile, and add a Thai version if you also use LinkedIn to stay in touch with your network in Thailand.",
        },
      },
      ],
    },
    {
      heading: {
        th: "10. LinkedIn Premium ช่วยอะไรได้บ้าง",
        en: "10. What LinkedIn Premium actually helps with",
      },
      body: [
      {
        kind: "p",
        text: {
          th: "LinkedIn Premium มีเครื่องมือช่วยดูว่าคุณตรงกับตำแหน่งที่สนใจแค่ไหน เช่น Top Applicant และ How you match",
          en: "LinkedIn Premium has tools that show how well you match a role you are interested in, such as Top Applicant and How you match.",
        },
      },
      {
        kind: "p",
        text: {
          th: "Top Applicant ใช้ข้อมูลโปรไฟล์ เกณฑ์ในประกาศ และความเห็นของ recruiter ต่อผู้สมัครตำแหน่งใกล้เคียงเพื่อประเมินความเหมาะสม LinkedIn ระบุว่าฟีเจอร์จะแสดงเมื่อคุณอยู่ในกลุ่มครึ่งบนของผู้สมัครอย่างน้อยหนึ่งตำแหน่ง และตำแหน่งนั้นมีผู้สมัครอย่างน้อย 10 คน",
          en: "Top Applicant uses your profile information, the criteria in the job ad, and recruiter feedback on applicants to similar roles. LinkedIn says the feature appears when you are in the top half of applicants for at least one role, and that role has at least 10 applicants.",
        },
        cite: { label: "LinkedIn Help", href: "https://www.linkedin.com/help/linkedin/answer/a554236" },
      },
      {
        kind: "p",
        text: {
          th: "How you match ให้ดูว่าประกาศระบุทักษะอะไร โปรไฟล์ของคุณมีทักษะไหนแล้ว และทักษะไหนยังไม่ได้ระบุ",
          en: "How you match shows which skills the ad lists, which of them are already on your profile, and which are not.",
        },
        cite: { label: "LinkedIn Help", href: "https://www.linkedin.com/help/linkedin/answer/a1462281" },
      },
      { kind: "sub", text: {
        th: "ปรับโปรไฟล์ตามคู่มือนี้ได้โดยไม่ต้องใช้ Premium",
        en: "You can do everything in this guide without Premium",
      } },
      {
        kind: "p",
        text: {
          th: "ทุกขั้นในคู่มือนี้ ตั้งแต่การตั้งค่างานที่สนใจไปจนถึงการเลือกสกิลที่ตรงกับงาน ทำได้โดยไม่ต้องซื้อ Premium",
          en: "Every step in this guide, from setting your job preferences through to choosing the skills that match the work, you can do without buying Premium.",
        },
      },
      {
        kind: "p",
        text: {
          th: "ถ้ายังไม่ได้ทำเรื่องพื้นฐานเหล่านี้ ให้เริ่มจากตรงนี้ก่อน แล้วค่อยพิจารณาว่าข้อมูลเปรียบเทียบจาก Premium มีประโยชน์กับการสมัครของคุณไหม",
          en: "If you have not done those basics yet, start there, and then decide whether the comparison data in Premium is useful for the applications you are making.",
        },
      },
      ],
    },
    {
      heading: {
        th: "11. ตรวจก่อนปิดหน้าจอ",
        en: "11. Check this before you close the tab",
      },
      body: [
      { kind: "sub", text: {
        th: "เก้าข้อ เรียงตามลำดับความสำคัญ",
        en: "Nine things, in order of what matters most",
      } },
      {
        kind: "list",
        ordered: true,
        items: [
                  {
            th: "ระบุชื่อตำแหน่ง ประเทศเป้าหมาย และรูปแบบการทำงานใน Open to Work",
            en: "Enter your job titles, target country and type of work under Open to Work",
          },
                  {
            th: "เลือกให้ชัดว่าใครเห็นสถานะ Open to Work ของคุณได้",
            en: "Decide clearly who can see your Open to Work status",
          },
                  {
            th: "ระบุสถานที่ที่คุณอยู่จริงบนโปรไฟล์",
            en: "Put the place you actually live on your profile",
          },
                  {
            th: "เก็บชื่อตำแหน่งจริงไว้ และอธิบายขอบเขตงานด้วยคำที่คนในตลาดเป้าหมายเข้าใจ",
            en: "Keep your real job titles, and describe the scope in words the target market understands",
          },
                  {
            th: "เพิ่มคำอธิบายสั้น ๆ ว่าบริษัทเดิมทำอะไร",
            en: "Add a short line about what each former employer does",
          },
                  {
            th: "ใช้ headline บอกสายงานหรือตำแหน่งที่กำลังมองหาโดยไม่สื่อว่าเป็นตำแหน่งปัจจุบัน",
            en: "Use the headline to say your field or the role you are looking for, without reading as your current job",
          },
                  {
            th: "ใส่ตัวอย่างผลงานที่ตรวจสอบได้ในส่วนแนะนำตัว และระบุสถานะสิทธิ์ทำงานหากพร้อมเปิดเผย",
            en: "Put checkable examples of your results in the About section, and your right-to-work status if you are ready to share it",
          },
                  {
            th: "เทียบทักษะในโปรไฟล์กับประกาศงานจริง 3 ตำแหน่ง",
            en: "Compare the skills on your profile against three real job ads",
          },
                  {
            th: "ตรวจว่ามีข้อมูลใดให้ยืนยันบนโปรไฟล์ได้บ้าง",
            en: "Check what on your profile you are able to verify",
          },
        ],
      },
      { kind: "sub", text: {
        th: "เริ่มตรวจได้เลยโดยไม่ต้องซื้อ Premium",
        en: "You can start checking without buying Premium",
      } },
      ],
    },
    {
      heading: {
        th: "คำถามที่คนมักถาม",
        en: "Questions people ask",
      },
      body: [
      {
        kind: "qa",
        q: {
          th: "บริษัทที่ทำงานอยู่จะเห็นไหมว่ากำลังหางาน",
          en: "Will my current employer see that I am looking?",
        },
        a: [
          {
            th: "ถ้าเปิดให้สมาชิกทุกคนเห็น คนที่บริษัทปัจจุบันก็อาจเห็นได้ ตัวเลือก Recruiters only จำกัดการมองเห็น แต่ LinkedIn ไม่รับประกันว่าจะซ่อนสถานะจากบริษัทปัจจุบันได้ทั้งหมด ถ้าไม่พร้อมรับความเสี่ยงนี้ ให้เก็บการตั้งค่างานไว้ดูเอง",
            en: "If you share it with all members, people at your current company may see it. The Recruiters only option narrows that, but LinkedIn does not guarantee it can hide your status from your current employer completely. If you are not ready to carry that risk, keep your job preferences visible only to yourself.",
          },
        ],
      },
      {
        kind: "qa",
        q: {
          th: "ควรเปลี่ยนตำแหน่งที่ตั้งบนโปรไฟล์เป็นเมืองในยุโรปไหม",
          en: "Should I change my profile location to a European city?",
        },
        a: [
          {
            th: "ถ้ายังไม่ได้ย้าย ให้ระบุสถานที่ที่คุณอยู่จริง แล้วใส่เมืองที่อยากทำงานใน Open to Work",
            en: "If you have not moved yet, state where you actually are, and put the city you want to work in under Open to Work.",
          },
        ],
      },
      {
        kind: "qa",
        q: {
          th: "LinkedIn Premium คุ้มไหม",
          en: "Is LinkedIn Premium worth it?",
        },
        a: [
          {
            th: "ถ้าต้องการเพียงปรับโปรไฟล์ตามคู่มือนี้ ยังไม่จำเป็น ส่วน Top Applicant และ How you match เป็นข้อมูลประกอบการเลือกสมัคร ไม่ได้บอกว่าคุณจะได้สัมภาษณ์หรือได้งาน",
            en: "If all you want is to set your profile up the way this guide describes, not yet. Top Applicant and How you match are information to help you choose what to apply for. They do not tell you whether you will get an interview or the job.",
          },
        ],
      },
      {
        kind: "qa",
        q: {
          th: "โปรไฟล์เป็นภาษาไทย ต้องทำภาษาอังกฤษด้วยไหม",
          en: "My profile is in Thai. Do I need an English one too?",
        },
        a: [
          {
            th: "ถ้าตำแหน่งที่คุณเล็งใช้ภาษาอังกฤษ ควรมีฉบับภาษาอังกฤษ คุณเก็บฉบับภาษาไทยไว้ได้ แต่ต้องแปลและอัปเดตทั้งสองฉบับเอง",
            en: "If the roles you are aiming at are in English, you should have an English version. You can keep the Thai one, but you have to translate and update both yourself.",
          },
        ],
      },
      {
        kind: "qa",
        q: {
          th: "ถ้า CV ยังไม่พร้อม ควรปรับ LinkedIn ก่อนไหม",
          en: "If my CV is not ready, should I fix LinkedIn first?",
        },
        a: [
          {
            th: "ถ้าคุณกำลังจะส่งใบสมัคร ให้จัดการ CV ก่อน ในกลุ่มคนไทยที่ทำแบบประเมินของ PunProfile ประมาณครึ่งหนึ่งมี CV เป็นเรื่องที่ต้องแก้ก่อน เทียบกับราวหนึ่งในหกที่มี LinkedIn เป็นเรื่องแรก",
            en: "If you are about to send applications, deal with the CV first. Among the Thai professionals who have taken PunProfile's check, about half have the CV as the first thing to fix, against roughly one in six for whom it is LinkedIn.",
          },
        ],
      },
      ],
    },
  ],
};
