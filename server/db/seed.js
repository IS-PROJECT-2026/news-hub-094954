import bcrypt from "bcryptjs";
import db from "./connection.js";

const DEMO_USER = {
  username: "newshub_demo",
  email: "demo@newshub.dev",
  password: "demo12345", // only used to seed the hash below — not a real login you need to use
};

const DEMO_ARTICLES = [
  {
    title: "Local coffee shop sees record turnout for community open mic night",
    content:
      "Dozens of residents packed into a downtown coffee shop this weekend for what organizers are calling their most successful open mic night yet. The event, now in its third year, has grown from a handful of regulars to a monthly fixture drawing performers of all ages. Organizers say they're already planning to expand seating for next month's event.",
    category: "general",
  },
  {
    title: "New study links short walks to improved afternoon focus",
    content:
      "Researchers publishing in a peer-reviewed journal this week found that participants who took a 10-minute walk after lunch reported sharper focus and fewer energy dips through the rest of the workday, compared to a control group that remained seated. The effect held even when the walks took place indoors, suggesting movement itself — not necessarily fresh air — may be the key factor.",
    category: "health",
  },
  {
    title: "Startup raises seed funding to simplify small business bookkeeping",
    content:
      "A newly launched startup announced it has closed a seed funding round aimed at building tools that automate bookkeeping for small businesses. The founders say the platform focuses on reducing the manual work owners currently spend on reconciling invoices and expenses, with an early version already in testing with a small group of local businesses.",
    category: "business",
  },
  {
    title: "City council approves funding for expanded bike lane network",
    content:
      "City council voted this week to approve additional funding for expanding the city's bike lane network, with construction expected to begin in phases over the coming year. Supporters say the expansion will improve safety for commuters, while some local business owners raised concerns about the impact on street parking during construction.",
    category: "general",
  },
  {
    title: "Community garden project reaches its five-year milestone",
    content:
      "What began as a small volunteer-run plot has grown into one of the neighborhood's most active community spaces. Over the past five years, the garden has expanded to include dozens of individual plots, a shared herb section, and a weekend workshop series teaching composting and seasonal planting to new gardeners.",
    category: "general",
  },
  {
    title: "Youth sports league sees surge in registrations this season",
    content:
      "Organizers of the local youth sports league report a noticeable increase in registrations this season, with several age divisions now waitlisted. League coordinators attribute the growth to expanded scheduling flexibility and new evening practice slots designed to accommodate working parents.",
    category: "sports",
  },
];

function seed() {
  const { count } = db.prepare(`SELECT COUNT(*) AS count FROM articles`).get();
  if (count > 0) {
    console.log(`Seed skipped — articles table already has ${count} row(s).`);
    return;
  }

  let author = db.prepare(`SELECT * FROM users WHERE email = ?`).get(DEMO_USER.email);

  if (!author) {
    const passwordHash = bcrypt.hashSync(DEMO_USER.password, 10);
    const result = db
      .prepare(`INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`)
      .run(DEMO_USER.username, DEMO_USER.email, passwordHash);
    author = { id: result.lastInsertRowid };
    console.log(`Created demo author (id: ${author.id})`);
  }

  const insert = db.prepare(
    `INSERT INTO articles (title, content, category, author_id) VALUES (?, ?, ?, ?)`
  );

  const insertMany = db.transaction((articles) => {
    for (const article of articles) {
      insert.run(article.title, article.content, article.category, author.id);
    }
  });

  insertMany(DEMO_ARTICLES);
  console.log(`Seeded ${DEMO_ARTICLES.length} demo articles.`);
}

seed();