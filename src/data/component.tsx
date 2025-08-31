// Component library documentation data structure

import { Icons } from "@/components/icons";
import { Component, HomeIcon, NotebookIcon, Subtitles } from "lucide-react";

// Each component entry should include all relevant documentation fields
export const Components = [
  {
    name: "ASCII",
    slug: "ascii",
    description: "Convert images to ASCII art using a simple interface.",
    cli: "ascii-cli <input-image> [options]",
    usage: `
      import { Ascii } from "@/components/ascii";
      <Ascii src="/path/to/image.jpg" width={80} />
    `,
    props: [
      {
        name: "src",
        type: "string",
        required: true,
        description: "The source path or URL of the image to convert."
      },
      {
        name: "width",
        type: "number",
        required: false,
        default: 80,
        description: "Width of the ASCII output in characters."
      },
      {
        name: "invert",
        type: "boolean",
        required: false,
        default: false,
        description: "Invert the ASCII color mapping."
      }
    ],
    example: {
      code: `
        <Ascii src="/images/cat.jpg" width={100} invert />
      `,
      preview: "<pre>...ASCII ART PREVIEW...</pre>"
    },
    tags: ["image", "ascii", "utility", "converter"],
    icon: Component, // or a custom icon if available
    github: "https://github.com/yourrepo/ascii-component",
    docs: "/docs/components/ascii"
  },
  // Add more components here as needed
];