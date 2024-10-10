"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

type HackedTextEffectDemoProps = {
  className: string; // 容器的 className
  initialText: string; // 初始文字
  initialTextColor: string; // 初始文字顏色
  backgroundFadeInSpeed: number; // 背景擴展速度
  backgroundFadeOutSpeed: number; // 背景消滅速度
};

export default function HackedTextEffectDemo({
  className,
  initialText,
  initialTextColor,
  backgroundFadeInSpeed,
  backgroundFadeOutSpeed,
}: HackedTextEffectDemoProps) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const [text, setText] = useState(initialText); // 控制顯示的文字
  const [bgSize, setBgSize] = useState(0); // 控制背景擴展的狀態
  const [color, setColor] = useState(initialTextColor); // 控制文字顏色
  const h1Ref = useRef<HTMLHeadingElement | null>(null); // 使用 ref 獲取 h1 元素
  const animationRef = useRef<number | null>(null); // 使用 ref 獲取當前動畫的 requestAnimationFrame ID

  useEffect(() => {
    const handleMouseOver = (event: MouseEvent) => {
      let iteration = 0;
      const target = event.currentTarget as HTMLElement;
      const wordLength = target.dataset.value?.length || 0;

      setColor("black");

      // 清除任何現有的動畫
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      const updateText = () => {
        setText((prevText) =>
          prevText
            .split("")
            .map((letter, index) =>
              index < iteration
                ? target.dataset.value?.[index] || letter
                : letters[Math.floor(Math.random() * 26)],
            )
            .join(""),
        );

        const progress = (iteration / wordLength) * 100;
        setBgSize(progress * backgroundFadeInSpeed);

        if (iteration < wordLength) {
          iteration += 1 / 3; // 控制亂碼與背景擴展同步
          animationRef.current = requestAnimationFrame(updateText); // 繼續下一幀的更新
        }
      };

      updateText(); // 開始更新過程
    };

    const handleMouseOut = () => {
      setText(initialText); // 背景消失時顯示正確的字母
      setColor(initialTextColor); // 恢復原本的文字顏色

      // 清除任何現有的動畫
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      let isFadingOut = true; // 標記是否正在淡出

      const fadeOut = () => {
        setBgSize((prevSize) => {
          if (prevSize <= 0) {
            isFadingOut = false; // 停止淡出
            return 0; // 背景大小為 0 時不再更新
          }
          return Math.max(prevSize - backgroundFadeOutSpeed, 0); // 每次減少背景大小
        });

        // 只有在淡出狀態時繼續調用 fadeOut
        if (isFadingOut) {
          animationRef.current = requestAnimationFrame(fadeOut);
        }
      };

      fadeOut(); // 開始淡出過程
    };

    const h1Element = h1Ref.current;
    if (h1Element) {
      h1Element.addEventListener("mouseover", handleMouseOver);
      h1Element.addEventListener("mouseout", handleMouseOut);
    }

    return () => {
      if (h1Element) {
        h1Element.removeEventListener("mouseover", handleMouseOver);
        h1Element.removeEventListener("mouseout", handleMouseOut);
      }
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [
    initialText,
    initialTextColor,
    backgroundFadeInSpeed,
    backgroundFadeOutSpeed,
  ]); // 當初始文字或顏色變更時重新執行 effect

  return (
    <p
      ref={h1Ref} // 將 ref 連結到 h1 元素
      data-value={initialText}
      className={cn(
        "cursor-pointer rounded-lg px-3 py-0 text-center font-mono",
        className,
      )}
      style={{
        background: `linear-gradient(to right, white ${bgSize}%, transparent 0%)`, // 總是顯示背景
        color: color, // 使用狀態來控制文字顏色
        transition: "background-size 0.3s ease, color 0.4s ease", // 控制背景和顏色的過渡時間
      }}
    >
      {text}
    </p>
  );
}
