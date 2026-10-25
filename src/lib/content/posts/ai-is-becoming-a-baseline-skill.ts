import type { Post } from "../blog";

/**
 * `ai-is-becoming-a-baseline-skill`, the blog's third article.
 *
 * Paul's Thai, from `thai-europe-job-guide.md` in the coaching repo's
 * `golden-th/other/` (Newsletter 1), queued in `blog-queue.md` on 16/08/2026.
 * The first article built to the `blog-post` skill's five rules: it opens with
 * `สรุปสั้น ๆ`, closes on three FAQ, carries a search title, cites a source in
 * every section that makes a market claim, and links to one related article.
 * Those additions, and the corrected Microsoft paragraph, were drafted and
 * then approved by Paul; the rest is his Thai unchanged.
 *
 * Thai is the source and the English is a translation of it.
 */
export const AI_IS_BECOMING_A_BASELINE_SKILL: Post = {
  slug: "ai-is-becoming-a-baseline-skill",
  topic: "perspective",
  published: "2026-10-25",
  related: "start-in-europe",

  title: {
    th: "ใช้ AI เป็น กำลังจะกลายเป็นทักษะพื้นฐานของคนทำงาน",
    en: "Being able to use AI is becoming a baseline skill for working people",
  },

  seoTitle: {
    th: "ทักษะ AI ที่นายจ้างในยุโรปมองหา",
    en: "The AI skills employers in Europe look for",
  },

  summary: {
    th: "นายจ้างไม่ได้ดูแค่ว่าใช้ AI เป็นหรือไม่ แต่อยากเห็นว่าคุณนำไปสร้างผลงานได้จริงอย่างไร",
    en: "Employers are not only looking at whether you can use AI. They want to see how you turned it into work that produced something.",
  },

  question: {
    th: "ถ้า AI ช่วยลดเวลางานประจำลงได้ 30% คุณจะนำเวลาที่ได้คืนมาไปสร้างคุณค่าอะไรเพิ่ม?",
    en: "If AI cut the time your routine work takes by 30%, what would you use the time it gave back to create?",
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
            th: "นายจ้างในยุโรปไม่ได้ดูแค่ว่าคุณใช้ AI เป็นหรือไม่ แต่อยากเห็นว่าคุณนำ AI ไปสร้างผลงานได้จริงอย่างไร",
            en: "Employers in Europe are not only looking at whether you can use AI. They want to see how you used it to produce real work.",
          },
        },
        {
          kind: "p",
          text: {
            th: "การ Reskill จึงไม่ได้หมายความว่าต้องเปลี่ยนสายไปเป็นโปรแกรมเมอร์ แต่คือการนำ AI มาใช้กับความเชี่ยวชาญที่มีอยู่ ตรวจสอบผลลัพธ์ได้ และเล่าออกมาเป็นผลงานในเรซูเม่หรือการสัมภาษณ์ได้",
            en: "So reskilling does not mean becoming a programmer. It means applying AI to the expertise you already have, checking what it produces, and being able to show it as work on your CV or in an interview.",
          },
        },
      ],
    },
    {
      body: [
        {
          kind: "p",
          text: {
            th: "AI กำลังเปลี่ยนวิธีทำงานในหลายสายอาชีพ ตั้งแต่นักการตลาด นักวิเคราะห์ ผู้จัดการ ฝ่ายบุคคล ไปจนถึงนักออกแบบ ผลกระทบจึงไม่ได้จำกัดอยู่เฉพาะงานด้านเทคโนโลยี",
            en: "AI is changing how work is done in many professions, from marketers, analysts, managers and HR through to designers. The effect is not limited to technology roles.",
          },
        },
        {
          kind: "p",
          text: {
            th: "สำหรับคนที่มองหาโอกาสในยุโรป การ Reskill ไม่ได้หมายความว่าต้องเปลี่ยนสายไปเป็นโปรแกรมเมอร์ แต่ต้องเรียนรู้ว่าจะนำ AI มาใช้กับความเชี่ยวชาญที่มีอยู่ เพื่อทำงานได้ดีและมีประสิทธิภาพขึ้นอย่างไร",
            en: "For anyone looking at opportunities in Europe, reskilling does not mean changing career to become a programmer. It means learning how to apply AI to the expertise you already have, so that you work better and more efficiently.",
          },
        },
        {
          kind: "p",
          text: {
            th: "สามเทรนด์ต่อไปนี้กำลังมีผลโดยตรงต่อทักษะที่นายจ้างมองหา",
            en: "These three trends are directly affecting the skills employers look for.",
          },
        },
      ],
    },
    {
      heading: {
        th: "1. AI Literacy กำลังกลายเป็นพื้นฐานที่ทุกคนควรมี",
        en: "1. AI literacy is becoming a foundation everyone should have",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "การเปิดเครื่องมือ AI แล้วใช้งานได้ยังไม่พอ นายจ้างต้องการคนที่เข้าใจว่าเทคโนโลยีนี้เหมาะกับงานแบบไหน มีข้อจำกัดตรงไหน และจะตรวจสอบผลลัพธ์อย่างไรก่อนนำไปใช้จริง",
            en: "Being able to open an AI tool and use it is not enough. Employers want people who understand which kinds of work the technology suits, where its limits are, and how to check the output before it is actually used.",
          },
        },
        {
          kind: "p",
          text: {
            th: "เรื่องนี้มีน้ำหนักมากขึ้นในยุโรป เพราะกฎหมาย AI Act กำหนดให้องค์กรที่ให้บริการหรือใช้งานระบบ AI ต้องสนับสนุนความรู้ความเข้าใจด้าน AI ของบุคลากรให้เหมาะกับงานและความเสี่ยงที่เกี่ยวข้อง",
            en: "This carries more weight in Europe, because the AI Act requires organisations that provide or use AI systems to support their people's AI literacy in a way appropriate to the work and the risks involved.",
          },
          cite: { label: "European Commission", href: "https://digital-strategy.ec.europa.eu/en/policies/ai-talent-skills-and-literacy" },
        },
        {
          kind: "p",
          text: {
            th: "ทักษะที่ตลาดต้องการจึงกว้างกว่าการเขียน Prompt คุณควรรู้วิธีตรวจสอบข้อมูล มองเห็นความเสี่ยงด้านความเป็นส่วนตัว สังเกตอคติในผลลัพธ์ และตัดสินใจได้ว่างานใดควรหรือไม่ควรใช้ AI",
            en: "The skills the market wants are therefore broader than writing prompts. You should know how to verify information, spot privacy risks, notice bias in the output, and judge which work should and should not use AI.",
          },
        },
      ],
    },
    {
      heading: {
        th: "2. คนที่ได้เปรียบคือคนที่ออกแบบวิธีทำงานใหม่ได้",
        en: "2. The advantage goes to people who can redesign how the work is done",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "การระบุในเรซูเม่ว่าใช้ ChatGPT หรือ Copilot เป็น อาจยังไม่ช่วยให้คุณโดดเด่นมากนัก นายจ้างอยากเห็นว่าคุณนำ AI ไปปรับขั้นตอนการทำงานและสร้างผลลัพธ์ได้จริงหรือไม่",
            en: "Stating on a CV that you can use ChatGPT or Copilot may not do much to make you stand out. Employers want to see whether you took AI and actually changed a process with it and produced a result.",
          },
        },
        {
          kind: "p",
          text: {
            th: "ตัวอย่างเช่น ใช้ AI สรุปข้อมูลลูกค้า ทำร่างรายงาน วิเคราะห์ความคิดเห็นในเบื้องต้น หรือเตรียมคำถามสำหรับการประชุม จากนั้นนำความรู้ในสายงานมาตรวจสอบ ปรับแก้ และตัดสินใจขั้นสุดท้าย",
            en: "For example, using AI to summarise customer information, draft a report, run a first pass over feedback, or prepare questions for a meeting, then bringing your own knowledge of the field in to check it, correct it and make the final decision.",
          },
        },
        {
          kind: "p",
          text: {
            th: "Microsoft มองว่าคนทำงานจะต้องสร้าง มอบหมายงาน และดูแลจัดการ AI agents มากขึ้น ผู้บริหารที่ร่วมการสำรวจคาดว่าภายใน 5 ปี ทีมของตนจะต้องฝึก AI agents (41%) และดูแลจัดการ AI agents (36%)",
            en: "Microsoft's view is that workers will increasingly build, delegate to and manage AI agents. The leaders it surveyed expect their teams to be training agents (41%) and managing them (36%) within five years.",
          },
          cite: { label: "Microsoft, 2025 Work Trend Index", href: "https://blogs.microsoft.com/blog/2025/04/23/the-2025-annual-work-trend-index-the-frontier-firm-is-born/" },
        },
        {
          kind: "p",
          text: {
            th: "ดังนั้น คำถามที่มีน้ำหนักในการสมัครงานจึงไม่ใช่เพียง “ใช้ AI ตัวไหนเป็น” แต่คือ “นำ AI ไปแก้ปัญหาอะไร และงานดีขึ้นอย่างไร”",
            en: "So the question that carries weight in an application is not only “which AI can you use”, but “what problem did you take AI to, and how did the work get better”.",
          },
        },
      ],
    },
    {
      heading: {
        th: "3. ทักษะของคนยิ่งมีราคาเมื่อ AI รับงานซ้ำ ๆ ไปมากขึ้น",
        en: "3. Human skills are worth more as AI takes on more of the repetitive work",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "เมื่อ AI ช่วยจัดการงานที่ทำซ้ำได้มากขึ้น การคิดวิเคราะห์ ความคิดสร้างสรรค์ การสื่อสาร ความยืดหยุ่น และการทำงานร่วมกับผู้อื่นจะยิ่งมีบทบาท",
            en: "As AI handles more repetitive work, analytical thinking, creativity, communication, adaptability and working with others all take on a larger role.",
          },
        },
        {
          kind: "p",
          text: {
            th: "World Economic Forum รายงานว่า 77% ของนายจ้างที่ร่วมการสำรวจวางแผนพัฒนาทักษะพนักงานให้ทำงานร่วมกับ AI ได้ดีขึ้นภายในปี 2030 ขณะเดียวกัน ทักษะของมนุษย์ยังเป็นส่วนสำคัญของงานที่กำลังเติบโต",
            en: "The World Economic Forum reports that 77% of the employers surveyed plan to develop their staff's skills to work better alongside AI by 2030, while human skills remain a significant part of the jobs that are growing.",
          },
          cite: { label: "World Economic Forum, Future of Jobs Report 2025", href: "https://www.weforum.org/publications/the-future-of-jobs-report-2025/in-full/4-workforce-strategies/" },
        },
        {
          kind: "p",
          text: {
            th: "เป้าหมายของการ Reskill จึงไม่ใช่การพยายามแข่งกับ AI แต่เป็นการผสานความเข้าใจเทคโนโลยีเข้ากับประสบการณ์และวิจารณญาณที่คุณมี",
            en: "The goal of reskilling is therefore not to try to compete with AI. It is to combine an understanding of the technology with the experience and judgement you already have.",
          },
        },
      ],
    },
    {
      heading: {
        th: "เปลี่ยนความรู้เรื่อง AI ให้เป็นผลงานที่เล่าได้",
        en: "Turn what you know about AI into work you can talk about",
      },
      body: [
        {
          kind: "p",
          text: {
            th: "เลือกงานประจำมาหนึ่งอย่าง แล้วทดลองให้ AI ช่วยบางขั้นตอน ระหว่างทดลอง ลองจดไว้ว่า",
            en: "Pick one routine task and try letting AI help with part of it. As you go, note down:",
          },
        },
        {
          kind: "list",
          items: [
            {
              th: "คุณกำลังแก้ปัญหาอะไร",
              en: "What problem you are solving",
            },
            {
              th: "AI เข้ามาช่วยตรงไหน",
              en: "Where AI came in to help",
            },
            {
              th: "คุณตรวจสอบผลลัพธ์ด้วยวิธีใด",
              en: "How you checked the output",
            },
            {
              th: "งานเร็วขึ้นหรือมีคุณภาพดีขึ้นอย่างไร",
              en: "How the work got faster or better in quality",
            },
            {
              th: "พบความเสี่ยงหรือข้อจำกัดอะไรบ้าง",
              en: "What risks or limits you found",
            },
          ],
        },
        {
          kind: "p",
          text: {
            th: "การทดลองเล็ก ๆ แบบนี้นำไปพัฒนาเป็นตัวอย่างผลงานในเรซูเม่ พอร์ตโฟลิโอ หรือการสัมภาษณ์ได้ชัดกว่าการเขียนสั้น ๆ ว่า “มีทักษะด้าน AI”",
            en: "A small experiment like that develops into a clearer example for a CV, a portfolio or an interview than writing the short line “AI skills”.",
          },
        },
        {
          kind: "p",
          text: {
            th: "คุณไม่ต้องไล่เรียนทุกเครื่องมือในตลาด แต่ควรแสดงให้นายจ้างเห็นว่าเรียนรู้เทคโนโลยีใหม่ได้ ใช้อย่างรับผิดชอบ และเปลี่ยนเครื่องมือให้เป็นผลลัพธ์ทางธุรกิจได้จริง",
            en: "You do not have to work through every tool on the market. You do have to show an employer that you can learn a new technology, use it responsibly, and turn a tool into a real business result.",
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
            th: "AI Literacy คืออะไร",
            en: "What is AI literacy?",
          },
          a: [
            {
              th: "คือความเข้าใจว่า AI เหมาะกับงานแบบไหน มีข้อจำกัดตรงไหน และจะตรวจสอบผลลัพธ์อย่างไรก่อนนำไปใช้จริง ไม่ใช่แค่การเปิดเครื่องมือแล้วใช้งานได้",
              en: "It is understanding which kinds of work AI suits, where its limits are, and how to check its output before using it, not just being able to open a tool and use it.",
            },
            {
              th: "ในสหภาพยุโรป มาตรา 4 ของ AI Act ซึ่งมีผลตั้งแต่ 2 กุมภาพันธ์ 2025 กำหนดให้องค์กรที่ให้บริการหรือใช้งานระบบ AI ต้องสนับสนุนความรู้ด้าน AI ของบุคลากร",
              en: "In the EU, Article 4 of the AI Act, in force since 2 February 2025, requires organisations that provide or use AI systems to support their staff's AI literacy.",
            },
          ],
        },
        {
          kind: "qa",
          q: {
            th: "ต้องเรียนเขียนโปรแกรมไหม ถึงจะ Reskill ด้าน AI ได้",
            en: "Do I have to learn to code to reskill in AI?",
          },
          a: [
            {
              th: "ไม่จำเป็น สิ่งที่นายจ้างมองหาคือคนที่นำ AI มาใช้กับงานในสายของตัวเองได้ เช่น สรุปข้อมูลลูกค้า ทำร่างรายงาน หรือเตรียมคำถามก่อนประชุม แล้วใช้ความรู้ในสายงานตรวจสอบและตัดสินใจขั้นสุดท้าย",
              en: "No. What employers look for is someone who can apply AI to the work in their own field, such as summarising customer information, drafting a report or preparing questions for a meeting, then use their own knowledge to check it and make the final call.",
            },
          ],
        },
        {
          kind: "qa",
          q: {
            th: "ควรเขียนทักษะ AI ในเรซูเม่อย่างไร",
            en: "How should I put AI skills on my CV?",
          },
          a: [
            {
              th: "เล่าเป็นผลงานแทนการเขียนสั้น ๆ ว่ามีทักษะด้าน AI ระบุว่าคุณแก้ปัญหาอะไร AI ช่วยตรงไหน คุณตรวจสอบผลลัพธ์อย่างไร และงานเร็วขึ้นหรือดีขึ้นแค่ไหน",
              en: "Describe it as work rather than writing a short line saying you have AI skills: what problem you solved, where AI helped, how you checked the output, and how much faster or better the work became.",
            },
          ],
        },
      ],
    },
  ],
};
