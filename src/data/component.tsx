import { Component, NotebookIcon, ImageIcon } from "lucide-react"

// Each component entry references MDX files for detailed documentation
export const Components = [
  {
    name: "AsciiImage",
    slug: "ascii-image",
    description: "A powerful React component that converts images to ASCII art with multiple rendering modes, color support, responsive sizing, and advanced image processing features like dithering and gamma correction.",
    cli: "npm install ascii-image-component",
    tags: ["image", "ascii", "art", "converter", "responsive", "canvas", "processing", "retro", "terminal", "visual-effects", "image-processing", "dithering", "color", "monochrome"],
    icon: ImageIcon,
    github: "https://github.com/yourrepo/ascii-image-component",
    docs: "/docs/components/ascii-image",
    mdxPath: "/content/components/ascii-image.mdx",
  },
  {
    name: "StampImage",
    slug: "stamp-image",
    description: "A React component that converts any image into a beautiful stamp with perforated borders, customizable colors, and realistic stamp effects. Perfect for creating vintage-style image displays.",
    cli: "npm install stamp-image-component",
    tags: ["image", "stamp", "vintage", "border", "perforated", "canvas", "art", "converter", "visual-effects", "postage", "retro"],
    icon: ImageIcon,
    github: "https://github.com/yourrepo/stamp-image-component",
    docs: "/docs/components/stamp-image",
    mdxPath: "/content/components/stamp-image.mdx",
  },
  {
    name: "KeycapButton",
    slug: "keycap-button",
    description: "A beautiful keycap-style button component with glassmorphism effects, rainbow glow animations, and realistic key press interactions. Perfect for keyboard shortcuts display and gaming interfaces.",
    cli: "npm install keycap-button-component",
    tags: ["ui", "button", "keycap", "keyboard", "gaming", "glassmorphism", "animation", "interactive", "mechanical", "shortcuts", "controls"],
    icon: Component,
    github: "https://github.com/yourrepo/keycap-button-component",
    docs: "/docs/components/keycap-button",
    mdxPath: "/content/components/keycap-button.mdx",
  },
//   {
//     name: "Button",
//     slug: "button",
//     description: "A customizable button component with multiple variants.",
//     usage: `import { Button } from "@/components/ui/button";
// <Button variant="default">Click me</Button>`,
//     props: [
//       {
//         name: "variant",
//         type: "string",
//         required: false,
//         default: "default",
//         description: "The visual style variant of the button.",
//       },
//       {
//         name: "size",
//         type: "string",
//         required: false,
//         default: "default",
//         description: "The size of the button.",
//       },
//       {
//         name: "disabled",
//         type: "boolean",
//         required: false,
//         default: false,
//         description: "Whether the button is disabled.",
//       },
//     ],
//     example: {
//       code: `<Button variant="outline" size="lg">
//   Large Outline Button
// </Button>`,
//       preview: '<button class="px-6 py-3 border rounded-lg">Large Outline Button</button>',
//     },
//     tags: ["ui", "button", "interactive"],
//     icon: Component,
//     github: "https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/button.tsx",
//   },
//   {
//     name: "Card",
//     slug: "card",
//     description: "A flexible container component for displaying content.",
//     usage: `import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// <Card>
//   <CardHeader>
//     <CardTitle>Title</CardTitle>
//   </CardHeader>
//   <CardContent>Content goes here</CardContent>
// </Card>`,
//     props: [
//       {
//         name: "className",
//         type: "string",
//         required: false,
//         description: "Additional CSS classes to apply.",
//       },
//     ],
//     example: {
//       code: `<Card className="w-96">
//   <CardHeader>
//     <CardTitle>Example Card</CardTitle>
//   </CardHeader>
//   <CardContent>
//     This is some example content inside the card.
//   </CardContent>
// </Card>`,
//       preview:
//         '<div class="border rounded-lg p-4 w-96"><h3 class="font-semibold mb-2">Example Card</h3><p>This is some example content inside the card.</p></div>',
//     },
//     tags: ["ui", "container", "layout"],
//     icon: NotebookIcon,
//     github: "https://github.com/shadcn-ui/ui/tree/main/apps/www/registry/default/ui/card.tsx",
//   },
]
