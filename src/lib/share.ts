// X（旧Twitter）の投稿画面に渡すハッシュタグ（#は付けない）
export const SHARE_HASHTAGS = ["よろず屋API講座", "Hono"];

// 本文を載せたX（旧Twitter）の投稿画面のURL。サイトのトップページとハッシュタグを添える
export function buildShareUrl(text: string): string {
  const params = new URLSearchParams({
    text,
    url: `${window.location.origin}${window.location.pathname}`,
    hashtags: SHARE_HASHTAGS.join(","),
  });
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

// ギルドランクの星（全4つ）
export function rankStars(rank: number): string {
  return "★".repeat(rank) + "☆".repeat(4 - rank);
}
