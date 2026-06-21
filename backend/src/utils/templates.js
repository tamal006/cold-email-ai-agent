export const templates = [
  {
    id: "internship",
    name: "Internship Request",
    description: "Request an internship opportunity at a company. Highlights your academic background and eagerness to learn.",
    icon: "\u{1F393}",
    category: "Career",
    defaults: {
      purpose: "Internship request - Seeking an internship opportunity to gain hands-on experience and contribute to the team",
      tone: "professional",
      additionalNotes: "Currently pursuing a degree. Eager to learn and contribute. Available to start immediately."
    }
  },
  {
    id: "job-application",
    name: "Job Application",
    description: "Apply for a specific job position. Showcases relevant skills and experience.",
    icon: "\u{1F4BC}",
    category: "Career",
    defaults: {
      purpose: "Job application - Applying for a position that aligns with my skills and career goals",
      tone: "formal",
      additionalNotes: "Please highlight relevant experience and skills. Include a clear call-to-action for scheduling an interview."
    }
  },
  {
    id: "freelance",
    name: "Freelance Proposal",
    description: "Propose your freelance services to a potential client. Focuses on value delivery.",
    icon: "\u{1F680}",
    category: "Business",
    defaults: {
      purpose: "Freelance proposal - Offering professional services to help achieve business goals",
      tone: "startup",
      additionalNotes: "Focus on specific deliverables and outcomes. Include relevant portfolio examples."
    }
  },
  {
    id: "collaboration",
    name: "Collaboration Request",
    description: "Propose a collaboration or partnership opportunity. Emphasizes mutual benefits.",
    icon: "\u{1F91D}",
    category: "Networking",
    defaults: {
      purpose: "Collaboration request - Exploring potential partnership opportunities for mutual growth",
      tone: "friendly",
      additionalNotes: "Emphasize mutual benefits and shared goals. Be specific about what you bring to the table."
    }
  },
  {
    id: "networking",
    name: "Networking",
    description: "Connect with professionals in your industry. Builds genuine relationships.",
    icon: "\u{1F310}",
    category: "Networking",
    defaults: {
      purpose: "Networking - Looking to connect and learn from industry professionals",
      tone: "friendly",
      additionalNotes: "Keep it casual and genuine. Mention shared interests or connections if any."
    }
  }
];
