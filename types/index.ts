export interface HistoryItem {
  id: string;
  user_id?: string;
  topic: string;
  // DB column is content_type; we expose both for compatibility
  contentType: string;
  content_type?: string;
  tone: string;
  language: string;
  output: string;
  createdAt: string;
  created_at?: string;
}

// Helper to normalize DB row → HistoryItem
export function normalizeHistoryItem(
  row: Record<string, unknown>,
): HistoryItem {
  return {
    id: row.id as string,
    user_id: row.user_id as string,
    topic: row.topic as string,
    contentType: (row.content_type ?? row.contentType) as string,
    tone: row.tone as string,
    language: row.language as string,
    output: row.output as string,
    createdAt: (row.created_at ?? row.createdAt) as string,
  };
}
