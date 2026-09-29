import { useEffect, useRef, useState } from "react";

// 要素が画面に入ったら true になる（一度trueになったら戻らない）
// 図のアニメーションを「読者が見たタイミング」で再生するために使う
export function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    // IntersectionObserver が無い環境（テストのjsdomなど）では即表示
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  return { ref, inView };
}
