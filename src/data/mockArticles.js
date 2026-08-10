// In-memory demo data — used when no backend is configured (VITE_API_URL unset).
// Resets on every page refresh, which is expected for a static demo.

export const DEMO_USER = {
  id: 1,
  username: 'demo_user',
  email: 'demo@newshub.dev',
};

let nextId = 7;

export const mockArticles = [
  {
    id: 1,
    title: 'Local coffee shop sees record turnout for community open mic night',
    content:
      "Dozens of residents packed into a downtown coffee shop this weekend for what organizers are calling their most successful open mic night yet. The event, now in its third year, has grown from a handful of regulars to a monthly fixture drawing performers of all ages. Organizers say they're already planning to expand seating for next month's event.",
    category: 'general',
    author_id: 1,
    author_name: 'demo_user',
    created_at: '2026-08-05 09:00:00',
    updated_at: '2026-08-05 09:00:00',
  },
  {
    id: 2,
    title: 'New study links short walks to improved afternoon focus',
    content:
      'Researchers publishing in a peer-reviewed journal this week found that participants who took a 10-minute walk after lunch reported sharper focus and fewer energy dips through the rest of the workday, compared to a control group that remained seated. The effect held even when the walks took place indoors, suggesting movement itself — not necessarily fresh air — may be the key factor.',
    category: 'health',
    author_id: 1,
    author_name: 'demo_user',
    created_at: '2026-08-06 11:30:00',
    updated_at: '2026-08-06 11:30:00',
  },
  {
    id: 3,
    title: 'Startup raises seed funding to simplify small business bookkeeping',
    content:
      'A newly launched startup announced it has closed a seed funding round aimed at building tools that automate bookkeeping for small businesses. The founders say the platform focuses on reducing the manual work owners currently spend on reconciling invoices and expenses, with an early version already in testing with a small group of local businesses.',
    category: 'business',
    author_id: 1,
    author_name: 'demo_user',
    created_at: '2026-08-07 14:15:00',
    updated_at: '2026-08-07 14:15:00',
  },
  {
    id: 4,
    title: "City council approves funding for expanded bike lane network",
    content:
      "City council voted this week to approve additional funding for expanding the city's bike lane network, with construction expected to begin in phases over the coming year. Supporters say the expansion will improve safety for commuters, while some local business owners raised concerns about the impact on street parking during construction.",
    category: 'general',
    author_id: 1,
    author_name: 'demo_user',
    created_at: '2026-08-08 08:45:00',
    updated_at: '2026-08-08 08:45:00',
  },
  {
    id: 5,
    title: "Community garden project reaches its five-year milestone",
    content:
      "What began as a small volunteer-run plot has grown into one of the neighborhood's most active community spaces. Over the past five years, the garden has expanded to include dozens of individual plots, a shared herb section, and a weekend workshop series teaching composting and seasonal planting to new gardeners.",
    category: 'general',
    author_id: 1,
    author_name: 'demo_user',
    created_at: '2026-08-08 16:20:00',
    updated_at: '2026-08-08 16:20:00',
  },
  {
    id: 6,
    title: "Youth sports league sees surge in registrations this season",
    content:
      "Organizers of the local youth sports league report a noticeable increase in registrations this season, with several age divisions now waitlisted. League coordinators attribute the growth to expanded scheduling flexibility and new evening practice slots designed to accommodate working parents.",
    category: 'sports',
    author_id: 1,
    author_name: 'demo_user',
    created_at: '2026-08-09 10:00:00',
    updated_at: '2026-08-09 10:00:00',
  },
];

export function nextMockId() {
  return nextId++;
}
