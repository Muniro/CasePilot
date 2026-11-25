import { SvgIcon } from "@mui/material";
import type { SvgIconProps } from "@mui/material";

type GlyphName =
  | "case"
  | "search"
  | "document"
  | "package"
  | "arrow"
  | "external"
  | "copy"
  | "check"
  | "refresh"
  | "shield"
  | "chevron"
  | "clock";

const paths: Record<GlyphName, string> = {
  case: "M8 6V4h8v2 M3 7h18v13H3z M3 12c6 3 12 3 18 0 M10 12h4v4h-4z",
  search: "M20 20l-5-5 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  document: "M14 3H5v18h14V8z M14 3v5h5 M8 12h8 M8 16h6",
  package:
    "M12 3 3 7.5v9L12 21l9-4.5v-9z M3 7.5l9 4.5 9-4.5 M12 12v9 M7.5 5.25l9 4.5",
  arrow: "M4 12h16 M14 6l6 6-6 6",
  external: "M14 3h7v7 M21 3 10 14 M10 3H3v18h18v-7",
  copy: "M8 8h13v13H8z M16 8V3H3v13h5",
  check: "M5 12l4 4L19 6",
  refresh: "M20 7v5h-5 M4 17v-5h5 M20 12a8 8 0 0 0-14-5 M4 12a8 8 0 0 0 14 5",
  shield: "M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6z M8 12l3 3 5-6",
  chevron: "M9 5l7 7-7 7",
  clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M12 7v5l3 2",
};

export default function Glyph({
  name,
  ...props
}: SvgIconProps & { name: GlyphName }) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path
        d={paths[name]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SvgIcon>
  );
}
