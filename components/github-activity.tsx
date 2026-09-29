"use client";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import profile from "@/data/profile.json";
type Day = { date: string; count: number; level: number };
const colors = ["#303234", "#606060", "#8c8c8c", "#bababa", "#ebebeb"];
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
        if (mounted)
          setDays(entries.sort((a, b) => a.date.localeCompare(b.date)));
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
  const total = days?.reduce((sum, day) => sum + day.count, 0) ?? 0;
  const startOffset = days
    ? new Date(days[0].date + "T00:00:00Z").getUTCDay()
    : 0;
  const columns = days ? Math.ceil((days.length + startOffset) / 7) : 53;
  const months =
    days?.flatMap((day, i) =>
      day.date.endsWith("-01") && i < days.length - 14
        ? [
            {
              label: new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en", {
                month: "short",
                timeZone: "UTC",
              }).format(new Date(day.date)),
              column: Math.floor((i + startOffset) / 7),
            },
          ]
        : [],
    ) ?? [];
  return (
    <section className="github-activity" aria-label={ui.githubActivity}>
      {days ? (
        <>
          <div
            className="calendar-scroll"
            tabIndex={0}
            role="group"
            aria-label={ui.githubActivity}
          >
            <svg
              className="calendar"
              width={columns * 12}
              height={104}
              role="img"
              aria-label={total.toLocaleString(locale) + " " + ui.contributions}
            >
              <g fill="#aaa" fontSize="9">
                {months.map((month) => (
                  <text key={month.column} x={month.column * 12} y={10}>
                    {month.label}
                  </text>
                ))}
              </g>
              {days.map((day, i) => (
                <rect
                  key={day.date}
                  x={Math.floor((i + startOffset) / 7) * 12}
                  y={20 + ((i + startOffset) % 7) * 12}
                  width={9}
                  height={9}
                  rx={2}
                  fill={colors[day.level]}
                >
                  <title>{day.date + ": " + day.count}</title>
                </rect>
              ))}
            </svg>
          </div>
          <div className="calendar-footer">
            <span>
              <strong>{total.toLocaleString(locale)}</strong> {ui.contributions}
            </span>
            <div className="calendar-legend" aria-hidden="true">
              <span>{ui.less}</span>
              {colors.map((color) => (
                <i key={color} style={{ background: color }} />
              ))}
              <span>{ui.more}</span>
            </div>
          </div>
        </>
      ) : (
        <p className="calendar-message" role="status">
          {unavailable ? ui.activityUnavailable : ui.activityLoading}
        </p>
      )}
      <a
        className="calendar-profile"
        href={profile.socials[0].url}
        target="_blank"
        rel="noreferrer"
      >
        @{profile.username} <ArrowUpRight size={11} aria-hidden="true" />
      </a>
    </section>
  );
}
