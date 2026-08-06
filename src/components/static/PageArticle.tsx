import type { Section } from "@/lib/policies";
import { CheckIcon } from "@/components/icons";

// Render nội dung trang (intro + sections) sửa được ở admin. Dùng cho Giới
// thiệu / Liên hệ (và tái dùng được cho chính sách nếu cần).
export function PageArticle({
  intro,
  sections,
}: {
  intro: string[];
  sections: Section[];
}) {
  return (
    <article className="max-w-3xl">
      {intro.length > 0 && (
        <div className="flex flex-col gap-4 border-l-[3px] border-green pl-6 text-[15.5px] leading-[1.8] text-ink-2">
          {intro.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      )}

      {sections.map((section) => (
        <div key={section.heading} className="mt-10 border-t border-line pt-9">
          <h2 className="flex items-center gap-3 text-[19px] font-bold text-ink">
            <span className="h-6 w-[4px] shrink-0 rounded-full bg-gradient-to-b from-green to-green-dd" />
            {section.heading}
          </h2>
          {section.paragraphs?.map((para, i) => (
            <p key={i} className="mt-3.5 text-[15px] leading-[1.8] text-ink-2">
              {para}
            </p>
          ))}
          {section.items && (
            <ul className="mt-4 flex flex-col gap-3">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[15px] leading-[1.7] text-ink-2"
                >
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green to-green-dd text-white">
                    <CheckIcon className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </article>
  );
}
