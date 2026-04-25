import { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Col,
  Divider,
  Drawer,
  Grid,
  HStack,
  Image,
  Row,
  SelectPicker,
  Slider,
  Text,
  VStack,
} from "rsuite";
import { SettingsContext } from "../App";
import { formatNumberSuffix } from "../lib/useDate";
import { WallpaperIcon } from "lucide-react";
import wallpapers from "../lib/wallpapers.json" with { type: "json" };

export default function Settings({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { settings, setSettings } = useContext(SettingsContext);
  const [options, setOptions] = useState<(string | number)[]>([
    "show-seconds",
    "show-date",
    "center-date",
    "vignette",
    "auto-text",
  ]);

  const [wallpaperOpen, setWallpaperOpen] = useState(false);
  const restoredRef = useRef(false);

  const [timeSize, setTimeSize] = useState(100);
  const [dateSize, setDateSize] = useState(60);
  const [dateFormat, setDateFormat] = useState("short");
  const [fontWeight, setFontWeight] = useState(600);
  const [fontFamily, setFontFamily] = useState("Martian Mono");
  const [backgroundBrightness, setBackgroundBrightness] = useState(100);
  const [wallpaper, setWallpaper] = useState(
    "https://hcpss-space-assets.s3.us-east-1.amazonaws.com/wallpapers/zhang-liven-BiLh-YznD0I-unsplash.jpg",
  );

  useEffect(() => {
    setSettings((prev) => {
      const newSettings = {
        ...prev,
        options: options as string[],
        timeSize,
        dateSize,
        dateFormat,
        fontWeight,
        fontFamily,
        backgroundBrightness,
        wallpaper,
      };
      return newSettings;
    });
  }, [
    options,
    timeSize,
    dateSize,
    dateFormat,
    fontWeight,
    fontFamily,
    backgroundBrightness,
    wallpaper,
  ]);

  const today = new Date();
  const weekday = today.toLocaleDateString("en-us", { weekday: "long" });
  const dateFormats = [
    {
      label: `${weekday}, ${today.toLocaleDateString("en-us", { month: "long" })} ${formatNumberSuffix(today.getDate())}`,
      value: "full",
    },
    {
      label: `${today.toLocaleDateString("en-us", { month: "long" })} ${today.getDate()}`,
      value: "short",
    },
    {
      label: `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear().toString().slice(-2)}`,
      value: "numeric",
    },
  ];

  const fonts = [
    { label: "Martian Mono", value: "Martian Mono" },
    { label: "Geist Mono", value: "Geist Mono" },
    { label: "Aleo", value: "Aleo" },
  ];

  useEffect(() => {
    const savedSettings = localStorage.getItem("clock-settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setSettings(settings);
      setOptions(settings.options);
      setTimeSize(settings.timeSize);
      setDateSize(settings.dateSize);
      setDateFormat(settings.dateFormat);
      setFontWeight(settings.fontWeight);
      setFontFamily(settings.fontFamily);
      setBackgroundBrightness(settings.backgroundBrightness);
      setWallpaper(settings.wallpaper);
    }
    restoredRef.current = true;
  }, []);

  useEffect(() => {
    if (restoredRef.current) {
      localStorage.setItem("clock-settings", JSON.stringify(settings));
    }
  }, [settings]);

  return (
    <>
      <Drawer
        open={wallpaperOpen}
        onClose={() => {
          setWallpaperOpen(false);
          setOpen(true);
        }}
        size={"xs"}
      >
        <Drawer.Header>
          <Drawer.Title>Wallpaper</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <Grid fluid>
            <Row gutter={10}>
              {wallpapers.map((wallpaper) => (
                <Col key={wallpaper} span={12}>
                  <Image
                    src={wallpaper.replace("/wallpapers/", "/thumbnails/")}
                    rounded
                    fit="cover"
                    draggable={false}
                    className="wallpaper-thumbnail"
                    onClick={() => setWallpaper(wallpaper)}
                  />
                </Col>
              ))}
            </Row>
          </Grid>
        </Drawer.Body>
      </Drawer>

      <Drawer open={open} onClose={() => setOpen(false)} size={"xs"}>
        <Drawer.Header>
          <Drawer.Title>Settings</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <VStack spacing={10}>
            <CheckboxGroup value={options} onChange={setOptions}>
              <Checkbox value={"show-seconds"}>Show seconds</Checkbox>
              <Checkbox value={"show-am-pm"}>Show AM/PM</Checkbox>
              <Checkbox value={"show-date"}>Show date</Checkbox>
              <Checkbox value={"center-date"}>Center date text</Checkbox>
              <Checkbox value={"vignette"}>Vignette</Checkbox>
              <Checkbox value={"hide-btns"}>
                Hide buttons in fullscreen
              </Checkbox>
              <Checkbox value={"auto-text"}>Auto text size</Checkbox>
            </CheckboxGroup>
            {!options.includes("auto-text") && (
              <VStack marginTop={15} spacing={15} width={"100%"}>
                <HStack width={"100%"} spacing={10}>
                  <Text width={40}>Time</Text>
                  <Slider
                    value={timeSize}
                    onChange={setTimeSize}
                    min={30}
                    max={300}
                    step={10}
                    progress
                    graduated
                    marks={[{ value: 100, label: " " }]}
                    width={"100%"}
                  />
                </HStack>
                <HStack width={"100%"} spacing={10}>
                  <Text width={40}>Date</Text>
                  <Slider
                    value={dateSize}
                    onChange={setDateSize}
                    min={30}
                    max={300}
                    step={10}
                    progress
                    graduated
                    marks={[{ value: 60, label: " " }]}
                    width={"100%"}
                  />
                </HStack>
              </VStack>
            )}
            <Divider />
            <VStack spacing={3}>
              <Text>Date format</Text>
              <SelectPicker
                data={dateFormats}
                searchable={false}
                width={200}
                value={dateFormat}
                onChange={(v) => setDateFormat(v!)}
                cleanable={false}
              />
            </VStack>
            <VStack spacing={3}>
              <Text>Font family</Text>
              <SelectPicker
                data={fonts}
                searchable={false}
                width={200}
                value={fontFamily}
                onChange={(v) => setFontFamily(v!)}
                cleanable={false}
              />
            </VStack>
            <Divider />
            <HStack width={"100%"} spacing={10}>
              <Text width={290} align="right">
                Font weight
              </Text>
              <Slider
                value={fontWeight}
                onChange={setFontWeight}
                min={100}
                max={800}
                step={50}
                progress
                graduated
                marks={[{ value: 600, label: " " }]}
                width={"100%"}
              />
            </HStack>
            <HStack width={"100%"} spacing={10}>
              <Text width={290} align="right">
                Background brightness
              </Text>
              <Slider
                value={backgroundBrightness}
                onChange={setBackgroundBrightness}
                min={0}
                max={100}
                step={5}
                progress
                width={"100%"}
              />
            </HStack>
            <Divider />
            <Button
              startIcon={<WallpaperIcon />}
              onClick={() => {
                setOpen(false);
                setWallpaperOpen(true);
              }}
            >
              Choose Wallpaper
            </Button>
          </VStack>
        </Drawer.Body>
      </Drawer>
    </>
  );
}
