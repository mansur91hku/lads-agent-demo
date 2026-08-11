import { getCanvasConfig } from '@/lib/config';

type CanvasParams = Record<string, string | number | boolean | undefined>;

export interface CanvasEnrollment {
  user_id: number;
  user?: { id: number; name: string };
  grades?: { current_score?: number; final_score?: number };
  last_activity_at?: string;
}

export interface CanvasAssignment {
  id: number;
  name: string;
  points_possible?: number;
  submission_types?: string[];
  due_at?: string;
  assignment_group_id?: number;
}

export interface CanvasSubmission {
  user_id: number;
  score?: number;
  submitted_at?: string;
  workflow_state?: string;
}

export interface CanvasDiscussionTopic {
  id: number;
  title: string;
  message?: string;
  discussion_subentry_count?: number;
}

export interface CanvasDiscussionEntry {
  id: number;
  user_id: number;
  user_name: string;
  message: string;
  parent_id?: number | null;
  created_at: string;
  replies?: CanvasDiscussionEntry[];
}

interface CanvasDiscussionView {
  view: CanvasDiscussionEntry[];
}

// Assignment group returned by Canvas (with assignments included)
export interface CanvasAssignmentGroup {
  id: number;
  name: string;
  group_weight?: number;
  assignments?: CanvasAssignment[];
}

// One entry in /courses/:id/analytics/activity
export interface CanvasActivityEntry {
  date: string;       // ISO-8601 date string e.g. "2024-09-02"
  views: number;
  participations: number;
}

// One entry in /courses/:id/analytics/student_summaries
export interface CanvasStudentSummary {
  id: number;         // user_id
  page_views: number;
  page_views_level: number;
  participations: number;
  participations_level: number;
  tardiness_breakdown?: {
    total: number;
    on_time: number;
    late: number;
    missing: number;
    floating: number;
  };
}

export class CanvasClient {
  private apiUrl: string;
  private apiToken: string;

  constructor(apiUrl: string, apiToken: string) {
    this.apiUrl = apiUrl.replace(/\/$/, '');
    this.apiToken = apiToken;
  }

  static fromEnv(): CanvasClient {
    const { apiUrl, apiToken } = getCanvasConfig();
    return new CanvasClient(apiUrl, apiToken);
  }

  private async request<T>(path: string, params?: CanvasParams): Promise<T> {
    const url = new URL(`${this.apiUrl}/api/v1${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Canvas API ${response.status}: ${body.slice(0, 200)}`);
    }

    return response.json() as Promise<T>;
  }

  private async paginate<T>(path: string, params?: CanvasParams): Promise<T[]> {
    const results: T[] = [];
    let page = 1;

    while (page <= 10) {
      const pageResults = await this.request<T[]>(path, {
        ...params,
        per_page: 100,
        page,
      });

      if (!pageResults.length) break;
      results.push(...pageResults);
      if (pageResults.length < 100) break;
      page += 1;
    }

    return results;
  }

  // ─── Existing methods ───────────────────────────────────────────────────────

  async getStudentEnrollments(courseId: string): Promise<CanvasEnrollment[]> {
    return this.paginate<CanvasEnrollment>(`/courses/${courseId}/enrollments`, {
      'type[]': 'StudentEnrollment',
      'include[]': 'avatar_url',
      state: 'active',
    });
  }

  async getAssignments(courseId: string): Promise<CanvasAssignment[]> {
    return this.paginate<CanvasAssignment>(`/courses/${courseId}/assignments`);
  }

  async getSubmissions(courseId: string, assignmentId: number): Promise<CanvasSubmission[]> {
    return this.paginate<CanvasSubmission>(
      `/courses/${courseId}/assignments/${assignmentId}/submissions`,
      { include: 'user' }
    );
  }

  async getDiscussionTopics(courseId: string): Promise<CanvasDiscussionTopic[]> {
    return this.paginate<CanvasDiscussionTopic>(`/courses/${courseId}/discussion_topics`);
  }

  async getDiscussionEntries(courseId: string, topicId: number): Promise<CanvasDiscussionEntry[]> {
    const view = await this.request<CanvasDiscussionView>(
      `/courses/${courseId}/discussion_topics/${topicId}/view`
    );
    return view.view ?? [];
  }

  // ─── New methods ────────────────────────────────────────────────────────────

  /**
   * Returns assignment groups with their assignments embedded.
   * Used to determine formative vs summative split and per-assignment grade buckets.
   * Mirrors canvas-mcp: src/canvas_mcp/tools/grades.py → list_assignment_groups
   */
  async getAssignmentGroups(courseId: string): Promise<CanvasAssignmentGroup[]> {
    return this.paginate<CanvasAssignmentGroup>(
      `/courses/${courseId}/assignment_groups`,
      { 'include[]': 'assignments' }
    );
  }

  /**
   * Returns daily page-view and participation counts for the whole course.
   * Used to build the "Weekly Online Activity" line chart.
   * Mirrors canvas-mcp: src/canvas_mcp/tools/analytics.py → get_course_analytics_activity
   */
  async getCourseActivity(courseId: string): Promise<CanvasActivityEntry[]> {
    return this.request<CanvasActivityEntry[]>(
      `/courses/${courseId}/analytics/activity`
    );
  }

  /**
   * Returns per-student page-view and participation totals for the course.
   * Joined with enrollment data to build the Students table.
   * Mirrors canvas-mcp: src/canvas_mcp/tools/analytics.py → get_student_analytics
   */
  async getStudentSummaries(courseId: string): Promise<CanvasStudentSummary[]> {
    return this.request<CanvasStudentSummary[]>(
      `/courses/${courseId}/analytics/student_summaries`
    );
  }
}

