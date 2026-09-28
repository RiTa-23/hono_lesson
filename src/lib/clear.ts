// クリア判定（全クリ演出・回クリア演出で共有する）
import { MAIN_FLOW, PUBLISHED_UP_TO } from "@/lib/routes";
import type { PageDef } from "@/lib/routes";
import { getAllProgress } from "@/lib/storage";

export type SessionNumber = 1 | 2 | 3 | 4;

export const SESSION_NUMBERS: SessionNumber[] = [1, 2, 3, 4];

// 公開中のメインフローのうち、指定した回のページ
export function getSessionFlow(n: SessionNumber): PageDef[] {
  return MAIN_FLOW.filter((p) => p.section === `session${n}`);
}

export function isAllCleared(progress: Record<string, boolean> = getAllProgress()): boolean {
  // 全4回が公開されるまでは、途中までの達成を「全クリ」として演出しない
  if (PUBLISHED_UP_TO < 4) return false;
  return MAIN_FLOW.every((p) => p.progressId && progress[p.progressId]);
}

// 公開中の回のうち、メインフローのクエストをすべて達成した回の番号
export function getClearedSessions(
  progress: Record<string, boolean> = getAllProgress()
): SessionNumber[] {
  return SESSION_NUMBERS.filter((n) => {
    const pages = getSessionFlow(n);
    return pages.length > 0 && pages.every((p) => p.progressId && progress[p.progressId]);
  });
}
