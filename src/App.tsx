import { Box, Center, IconButton, Text, VStack } from "rsuite";
import "./App.css";
import { useDate } from "./lib/useDate";
import { ExpandIcon, SettingsIcon, ShrinkIcon } from "lucide-react";
import Settings from "./Components/Settings";
import { useState, createContext, useEffect, useMemo } from "react";
import useFavicon from "./lib/useFavicon";

export const defaultSettings = {
  options: ["show-seconds", "show-am-pm", "show-date", "center-date"],
  timeSize: 100,
  dateSize: 60,
  dateFormat: "short",
  fontWeight: 600,
  fontFamily: "Martian Mono",
  backgroundBrightness: 100,
  wallpaper:
    "https://hcpss-space-assets.s3.us-east-1.amazonaws.com/wallpapers/zhang-liven-BiLh-YznD0I-unsplash.jpg",
};

interface SettingsContextType {
  settings: typeof defaultSettings;
  setSettings: React.Dispatch<React.SetStateAction<typeof defaultSettings>>;
}

export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  setSettings: () => {},
});

export default function App() {
  const [settings, setSettings] =
    useState<typeof defaultSettings>(defaultSettings);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { date, time } = useDate(settings);
  useMemo(useFavicon, []);

  const settingsContext: SettingsContextType = {
    settings,
    setSettings,
  };

  useEffect(() => {
    document.body.style.backgroundImage = `url(${settings.wallpaper})`;
    document.body.classList.toggle(
      "hidden-btns",
      settings.options.includes("hide-btns") && isFullscreen && !settingsOpen,
    );
  }, [settings.wallpaper, settings.options, isFullscreen, settingsOpen]);

  useEffect(() => {
    function handleFullscreenChange() {
      const fullscreenElement = document.fullscreenElement;
      setIsFullscreen(fullscreenElement !== null);
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <SettingsContext.Provider value={settingsContext}>
      <Center
        className={[
          "main-content",
          settings.options.includes("vignette") ? "vignette" : "",
        ].join(" ")}
        style={{
          backdropFilter: `brightness(${settings.backgroundBrightness}%)`,
        }}
      >
        <VStack spacing={10}>
          <Text
            className={[
              "time",
              settings.options.includes("auto-text") ? "auto" : "",
            ].join(" ")}
            fontSize={
              settings.options.includes("auto-text")
                ? "unset"
                : settings.timeSize
            }
            lineHeight={
              settings.options.includes("auto-text")
                ? "unset"
                : settings.timeSize
            }
            fontFamily={settings.fontFamily}
            style={{ fontWeight: settings.fontWeight }}
          >
            {time}
          </Text>
          {settings.options.includes("show-date") && (
            <Text
              className={[
                "date",
                settings.options.includes("auto-text") ? "auto" : "",
              ].join(" ")}
              align={
                settings.options.includes("center-date") ? "center" : "left"
              }
              fontSize={
                settings.options.includes("auto-text")
                  ? "unset"
                  : settings.dateSize
              }
              fontFamily={settings.fontFamily}
              style={{ fontWeight: settings.fontWeight }}
            >
              {date}
            </Text>
          )}
        </VStack>
      </Center>
      <Box
        className="icons"
        display={
          isFullscreen && settings.options.includes("hide-btns")
            ? "none"
            : "unset"
        }
      >
        <IconButton
          icon={<SettingsIcon className="full-size" />}
          onClick={() => setSettingsOpen(true)}
        />
        <IconButton
          className="right"
          icon={
            isFullscreen ? (
              <ShrinkIcon className="full-size" />
            ) : (
              <ExpandIcon className="full-size" />
            )
          }
          onClick={() => {
            if (document.fullscreenElement != null) {
              document.exitFullscreen();
              return;
            }
            document.documentElement.requestFullscreen();
          }}
        />
      </Box>
      <Settings open={settingsOpen} setOpen={setSettingsOpen} />
    </SettingsContext.Provider>
  );
}
