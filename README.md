# LADS Agent Demo — Course Analytics

A [Next.js](https://nextjs.org) course-analytics dashboard with four tabs:
**Course Grade · Weekly Online Activity · Students · Discussions**

It runs in two modes:

| Mode | What it shows |
|---|---|
| `mock` (default) | Static demo data — no credentials needed |
| `canvas` | Live data pulled from your Canvas LMS instance via the REST API |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

| Variable | Required for `canvas` | Description |
|---|---|---|
| `DATA_SOURCE` | — | `mock` (default) or `canvas` |
| `CANVAS_API_URL` | yes | e.g. `https://canvas.ust.hk` |
| `CANVAS_API_TOKEN` | yes | Canvas → Account → Settings → New Access Token |
| `CANVAS_COURSE_ID` | yes | Numeric ID from the course URL `/courses/<id>` |

### 3. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Architecture

```
src/
  app/
    page.tsx                   # Fetches /api/analytics once; passes props to tabs
    api/analytics/route.ts     # Server Route Handler — token never leaves the server
  components/
    CourseGrade.tsx             # props: { grades, assessments }
    WeeklyOnlineActivity.tsx    # props: { activity }
    Students.tsx                # props: { students }
    Discussions.tsx             # props: { discussions }
  lib/
    canvas/client.ts            # Typed Canvas REST client (fetch + pagination)
    config.ts                   # Env readers + formative/summative classifier
    data/
      canvas.ts                 # Transforms Canvas API → CourseAnalytics
      mock.ts                   # Returns static demo data
      index.ts                  # Picks canvas vs mock at runtime
  types/analytics.ts            # Shared TypeScript interfaces
  data/                         # Static mock files (used by mock mode)
```

The `/api/analytics` response is cached for **5 minutes** so tab switches don't re-hit Canvas on every click.

---

## Canvas endpoint mapping

The `canvas` data source calls the same Canvas REST endpoints used by
[vishalsachdev/canvas-mcp](https://github.com/vishalsachdev/canvas-mcp).

| Tab | canvas-mcp reference file | Tool name |
|---|---|---|
| Weekly Online Activity | `src/canvas_mcp/tools/analytics.py` | `get_course_analytics_activity` |
| Students (page views / participations) | `src/canvas_mcp/tools/analytics.py` | `get_student_analytics` |
| Students (enrollment / last activity) | `src/canvas_mcp/tools/courses.py` | `list_students` |
| Course Grade histogram | `src/canvas_mcp/tools/grades.py` | `list_assignment_groups`, `list_submissions` |
| Discussions | `src/canvas_mcp/tools/discussions.py` | `list_discussion_topics`, `get_discussion_topic_view` |

---

## Formative vs Summative classification

Canvas has no built-in formative/summative flag. We derive it from **assignment group names**:

- **Formative** keywords: `quiz`, `homework`, `hw`, `assignment`, `lab`, `exercise`, `practice`
- **Summative** keywords: `exam`, `midterm`, `final`, `project`, `capstone`, `test`

Override in `.env.local`:
```
FORMATIVE_GROUP_KEYWORDS=quiz,lab,homework
SUMMATIVE_GROUP_KEYWORDS=exam,final,project,midterm
```

---

## Deploy on Vercel

Add the four env vars in the Vercel project → Settings → Environment Variables, then:

```bash
vercel deploy
```

The Canvas token stays server-side and is never exposed to the browser.
