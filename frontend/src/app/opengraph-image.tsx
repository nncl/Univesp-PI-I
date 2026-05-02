import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Yara Oliveira — Tatuadora em Campinas/SP";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const match = css.match(/src: url\((.+?)\) format/);
  if (!match) throw new Error(`Could not find font URL for ${family}`);
  return (await fetch(match[1])).arrayBuffer();
}

export default async function OpengraphImage() {
  const heading = "Yara Oliveira";
  const subheading = "Tatuadora · Campinas / SP";
  const tagline = "Portfólio e agenda de orçamentos";

  const [serif, sans] = await Promise.all([
    loadGoogleFont("Cormorant Garamond", 500, heading),
    loadGoogleFont("Inter", 400, `${subheading}${tagline}`),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#fafaf9",
          color: "#0a0a0a",
          padding: 80,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 40,
            border: "1px solid #0a0a0a",
            opacity: 0.15,
          }}
        />
        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            marginBottom: 40,
            opacity: 0.7,
          }}
        >
          {tagline}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Cormorant Garamond",
            fontSize: 180,
            lineHeight: 1,
            fontWeight: 500,
          }}
        >
          {heading}
        </div>
        <div
          style={{
            display: "flex",
            width: 120,
            height: 1,
            background: "#0a0a0a",
            margin: "40px 0",
            opacity: 0.4,
          }}
        />
        <div
          style={{
            display: "flex",
            fontFamily: "Inter",
            fontSize: 32,
            letterSpacing: 2,
          }}
        >
          {subheading}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant Garamond", data: serif, style: "normal", weight: 500 },
        { name: "Inter", data: sans, style: "normal", weight: 400 },
      ],
    },
  );
}
