import { useEffect, useState } from "react";

export function formatNumberSuffix(number: number) {
  if (number >= 11 && number <= 13) {
    return number + "th";
  }
  const lastDigit = number % 10;
  switch (lastDigit) {
    case 1:
      return number + "st";
    case 2:
      return number + "nd";
    case 3:
      return number + "rd";
    default:
      return number + "th";
  }
}

export const useDate = (settings: any) => {
  const locale = "en-us";
  const [today, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const day = today.toLocaleDateString(locale, { weekday: "long" });
  const dateFormat = settings.dateFormat ?? "full";

  let date = "";
  switch (dateFormat) {
    case "short":
      date = `${today.toLocaleDateString(locale, { month: "long" })} ${today.getDate()}`;
      break;
    case "numeric":
      date = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear().toString().slice(-2)}`;
      break;
    case "full":
    default:
      date = `${day}, ${today.toLocaleDateString(locale, { month: "long" })} ${formatNumberSuffix(today.getDate())}`;
      break;
  }

  let time = today.toLocaleTimeString(locale, {
    hour: "numeric",
    hour12: true,
    minute: "numeric",
    second: settings.options.includes("show-seconds") ? "numeric" : undefined,
  });
  if (!settings.options.includes("show-am-pm")) {
    time = time.replace(/(AM|PM)/, "").trim();
  }
  return {
    date,
    time,
  };
};
