import { Course } from "./types";

export const HSC_ICT_COURSES: Course[] = [
  {
    id: "hsc-ict-full",
    title: "HSC ICT Full Course (Academic)",
    description: "Master all 6 chapters of HSC ICT with interactive lessons, C programming practice, and HTML web design.",
    thumbnail: "https://picsum.photos/seed/ict1/800/600",
    instructor: "Redwan Master",
    price: 1500,
    stats: {
      students: 12500,
      lessons: 45,
      quizzes: 12,
    },
    chapters: [
      {
        id: "ch1",
        title: "Chapter 1: ICT World & BD Perspective",
        lessons: [
          { id: "l1-1", title: "Introduction to ICT", content: "# Welcome to ICT\nThis is the first lesson.", duration: "15:00" },
          { id: "l1-2", title: "Virtual Reality", content: "## VR in Education\nVR is changing how we learn.", duration: "20:00" },
        ]
      },
      {
        id: "ch2",
        title: "Chapter 2: Communication Systems & Networking",
        lessons: [
          { id: "l2-1", title: "Data Communication", content: "Understanding how data travels.", duration: "25:00" },
        ]
      },
      {
        id: "ch3",
        title: "Chapter 3: Number Systems & Digital Device",
        lessons: [
          { id: "l3-1", title: "Binary, Octal, Hexadecimal", content: "Converting between systems.", duration: "30:00" },
          { id: "l3-2", title: "Logic Gates", content: "AND, OR, NOT gates explained.", duration: "35:00" },
        ]
      },
      {
        id: "ch4",
        title: "Chapter 4: Web Design & HTML",
        lessons: [
          { id: "l4-1", title: "HTML Basics", content: "Building your first webpage.", duration: "40:00" },
        ]
      },
      {
        id: "ch5",
        title: "Chapter 5: Programming Language (C)",
        lessons: [
          { id: "l5-1", title: "Introduction to C", content: "Hello World in C.", duration: "45:00" },
        ]
      },
      {
        id: "ch6",
        title: "Chapter 6: Database Management System",
        lessons: [
          { id: "l6-1", title: "SQL Basics", content: "Querying data.", duration: "30:00" },
        ]
      }
    ]
  }
];
