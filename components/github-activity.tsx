"use client";
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import profile from "@/data/profile.json";
type Day = { date: string; count: number; level: number };
const colors = ["#383838", "#606060", "#8c8c8c", "#bababa", "#ebebeb"];
const blockSize = 12;
const blockStep = 16;
const calendarTop = 22;
type Tooltip = { index: number; left: number; top: number };
function isDay(value: unknown): value is Day {
  if (!value || typeof value !== "object") return false;
  const day = value as Day;
  return (
    typeof day.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(day.date) &&
    Number.isFinite(Date.parse(day.date)) &&
    Number.isSafeInteger(day.count) &&
    day.count >= 0 &&
    Number.isInteger(day.level) &&
    day.level >= 0 &&
    day.level <= 4
  );
}
export function GitHubActivity() {
  const {
    locale,
    messages: { ui },
  } = useLanguage();
  const [days, setDays] = useState<Day[] | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [focusedDay, setFocusedDay] = useState(0);
  const [tooltip, setTooltip] = useState<Tooltip | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const dayRefs = useRef<(SVGRectElement | null)[]>([]);
  const tooltipId = useId();
  const helpId = useId();
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    let mounted = true;
    async function load() {
      try {
        const response = await fetch(
          "https://github-contributions-api.jogruber.de/v4/" +
            encodeURIComponent(profile.username) +
            "?y=last",
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error("Unavailable");
        const data: unknown = await response.json();
        const entries =
          data && typeof data === "object" && "contributions" in data
            ? data.contributions
            : null;
        if (
          !Array.isArray(entries) ||
          entries.length < 1 ||
          entries.length > 371 ||
          !entries.every(isDay)
        )
          throw new Error("Invalid contributions");
        if (mounted) {
          const sorted = entries.sort((a, b) => a.date.localeCompare(b.date));
          // GitHub pads its calendar to whole weeks; keep the same year as the reference.
          const cutoff = new Date(sorted[sorted.length - 1].date + "T00:00:00Z");
          cutoff.setUTCFullYear(cutoff.getUTCFullYear() - 1);
          const firstDate = cutoff.toISOString().slice(0, 10);
          setDays(sorted.filter((day) => day.date > firstDate));
        }
      } catch {
        if (mounted) setUnavailable(true);
      } finally {
        clearTimeout(timeout);
      }
    }
    void load();
    return () => {
      mounted = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);
  const calendar = useMemo(() => {
    if (!days) return null;
    const language = locale === "pt" ? "pt-BR" : "en-US";
    const monthFormat = new Intl.DateTimeFormat(language, {
      month: "short",
      timeZone: "UTC",
    });
    const dateFormat = new Intl.DateTimeFormat(language, {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
    const startOffset = new Date(days[0].date + "T00:00:00Z").getUTCDay();
    const columns = Math.ceil((days.length + startOffset) / 7);
    const months: { label: string; column: number }[] = [];
    let previousMonth = "";
    days.forEach((day, index) => {
      if (index !== 0 && (index + startOffset) % 7 !== 0) return;
      const monthKey = day.date.slice(0, 7);
      if (monthKey === previousMonth) return;
      previousMonth = monthKey;
      const column = Math.floor((index + startOffset) / 7);
      if (columns - column < 3) return;
      const month = monthFormat.format(new Date(day.date));
      if (months.length && column - months[months.length - 1].column < 3) months.pop();
      months.push({ label: month.charAt(0).toUpperCase() + month.slice(1).replace(".", ""), column });
    });
    const labels = days.map((day) => {
      const template = day.count === 0
        ? ui.activityDayNone
        : day.count === 1
          ? ui.activityDayOne
          : ui.activityDayMany;
      return template
        .replace("{count}", day.count.toLocaleString(language))
        .replace("{date}", dateFormat.format(new Date(day.date)));
    });
    return {
      startOffset,
      width: columns * blockStep - (blockStep - blockSize),
      months,
      labels,
      summary: ui.activitySummary.replace(
        "{count}",
        days.reduce((sum, day) => sum + day.count, 0).toLocaleString(language),
      ),
    };
  }, [days, locale, ui]);

  function showDay(index: number, target: SVGRectElement) {
    const section = sectionRef.current;
    if (!section) return;
    const bounds = section.getBoundingClientRect();
    const cell = target.getBoundingClientRect();
    const halfWidth = Math.min(140, (bounds.width - 16) / 2);
    setTooltip({
      index,
      left: Math.max(halfWidth + 8, Math.min(cell.left + cell.width / 2 - bounds.left, bounds.width - halfWidth - 8)),
      top: cell.top - bounds.top - 8,
    });
  }

  function navigateDay(event: KeyboardEvent<SVGRectElement>, index: number) {
    if (!days) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setTooltip(null);
      return;
    }
    const destinations: Record<string, number> = {
      ArrowLeft: index - 7,
      ArrowRight: index + 7,
      ArrowUp: index - 1,
      ArrowDown: index + 1,
      Home: 0,
      End: days.length - 1,
    };
    const destination = destinations[event.key];
    if (destination === undefined) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showDay(index, event.currentTarget);
      }
      return;
    }
    event.preventDefault();
    const next = Math.max(0, Math.min(destination, days.length - 1));
    dayRefs.current[next]?.focus();
    dayRefs.current[next]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  return (
    <section
      ref={sectionRef}
      className="github-activity"
      aria-label={ui.githubActivity}
      onPointerLeave={() => setTooltip(null)}
    >
      {days && calendar ? (
        <>
          <p id={helpId} className="sr-only">{ui.activityHelp}</p>
          <div
            className="calendar-scroll"
            tabIndex={0}
            role="group"
            aria-label={ui.githubActivity}
            aria-describedby={helpId}
            onScroll={(event) => {
              if (!tooltip) return;
              const target = dayRefs.current[tooltip.index];
              if (!target) return;
              const cell = target.getBoundingClientRect();
              const bounds = event.currentTarget.getBoundingClientRect();
              if (cell.left >= bounds.left && cell.right <= bounds.right) {
                showDay(tooltip.index, target);
              } else {
                setTooltip(null);
              }
            }}
          >
            <svg
              className="calendar"
              width={calendar.width}
              height={130}
              viewBox={`0 0 ${calendar.width} 130`}
              role="group"
              aria-label={calendar.summary}
            >
              <g fill="currentColor" aria-hidden="true">
                {calendar.months.map((month) => (
                  <text key={month.column} x={month.column * blockStep} y={0} dominantBaseline="hanging">
                    {month.label}
                  </text>
                ))}
              </g>
              {days.map((day, i) => (
                <rect
                  key={day.date}
                  ref={(element) => { dayRefs.current[i] = element; }}
                  className="calendar-day"
                  x={Math.floor((i + calendar.startOffset) / 7) * blockStep}
                  y={calendarTop + ((i + calendar.startOffset) % 7) * blockStep}
                  width={blockSize}
                  height={blockSize}
                  rx={2}
                  fill={colors[day.level]}
                  data-date={day.date}
                  data-level={day.level}
                  role="button"
                  tabIndex={i === focusedDay ? 0 : -1}
                  aria-label={calendar.labels[i]}
                  aria-describedby={tooltip?.index === i ? tooltipId : undefined}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "touch") showDay(i, event.currentTarget);
                  }}
                  onFocus={(event) => {
                    setFocusedDay(i);
                    showDay(i, event.currentTarget);
                  }}
                  onBlur={() => setTooltip(null)}
                  onClick={(event) => {
                    event.currentTarget.focus();
                    showDay(i, event.currentTarget);
                  }}
                  onKeyDown={(event) => navigateDay(event, i)}
                />
              ))}
            </svg>
          </div>
          <div className="calendar-footer">
            <span>{calendar.summary}</span>
            <div className="calendar-legend" aria-hidden="true">
              <span>{ui.less}</span>
              {colors.map((color) => (
                <i key={color} style={{ background: color }} />
              ))}
              <span>{ui.more}</span>
            </div>
          </div>
          {tooltip && (
            <div
              id={tooltipId}
              role="tooltip"
              className="calendar-tooltip"
              style={{ left: tooltip.left, top: tooltip.top }}
            >
              {calendar.labels[tooltip.index]}
            </div>
          )}
        </>
      ) : (
        <div className="calendar-message" role="status">
          <p>{unavailable ? ui.activityUnavailable : ui.activityLoading}</p>
          {unavailable && (
            <a className="calendar-profile" href={profile.socials[0].url} target="_blank" rel="noreferrer">
              @{profile.username} <ArrowUpRight size={11} aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </section>
  );
}
