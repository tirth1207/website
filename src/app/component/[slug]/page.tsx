import { Components } from "@/data/component"
import { getComponent, extractUsageFromMDX, extractPropsFromMDX, extractExamplesFromMDX } from "@/data/component-mdx"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import { AsciiImage } from "@/components/ascii"

type Props = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return Components.map((component) => ({
    slug: component.slug,
  }))
}

export async function generateMetadata({ params }: Props) {
  const component = Components.find((c) => c.slug === params.slug)
  if (!component) return {}
  return {
    title: component.name,
    description: component.description,
  }
}

export default async function ComponentPage({ params }: Props) {
  const component = Components.find((c) => c.slug === params.slug)

  if (!component) {
    notFound()
  }

  // Load MDX data
  let mdxData = null
  let usage = ''
  let props: Array<{
    name: string;
    type: string;
    required: boolean;
    default?: string;
    description: string;
  }> = []
  let examples: Array<{
    title: string;
    code: string;
  }> = []

  try {
    console.log('Loading MDX data for component:', component.slug)
    mdxData = await getComponent(component.slug)
    console.log('MDX data loaded successfully:', mdxData.metadata.title)
    
    // Use raw content for extraction since it contains markdown syntax
    const rawContent = (mdxData as any).rawContent || mdxData.source
    
    usage = extractUsageFromMDX(rawContent)
    console.log('Usage extracted:', usage ? 'Yes' : 'No')
    
    props = extractPropsFromMDX(rawContent)
    console.log('Props extracted:', props.length)
    
    examples = extractExamplesFromMDX(rawContent)
    console.log('Examples extracted:', examples.length)
  } catch (error) {
    console.error('Error loading MDX data for component', component.slug, ':', error)
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {component.icon && (
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
              {/* @ts-ignore */}
              <component.icon className="w-6 h-6 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{component.name}</h1>
            <p className="text-xl text-muted-foreground mt-1">{component.description}</p>
          </div>
        </div>

        {component.github && (
          <Button variant="outline" size="sm" asChild>
            <a
              href={component.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              View on GitHub
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
        )}
      </div>

      {/* Features Section for ASCII component */}
      {component.slug === "ascii" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Features</CardTitle>
            <CardDescription>Key capabilities of the AsciiImage component</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">🎨 Multiple Modes</h4>
                <p className="text-sm text-muted-foreground">8 different ASCII character sets from classic to blocks</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">🌈 Color Support</h4>
                <p className="text-sm text-muted-foreground">Full color, grayscale, or monochrome rendering</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">📱 Responsive</h4>
                <p className="text-sm text-muted-foreground">Automatic container fitting and responsive sizing</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">⚡ Performance</h4>
                <p className="text-sm text-muted-foreground">Optimized canvas processing with error handling</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">🎛️ Customizable</h4>
                <p className="text-sm text-muted-foreground">Gamma correction, dithering, and aspect ratio control</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">🌙 Theme Aware</h4>
                <p className="text-sm text-muted-foreground">Automatic light/dark theme detection</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Preview section for ASCII component */}
      {component.slug === "ascii" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Live Preview</CardTitle>
            <CardDescription>Interactive demonstration of different ASCII rendering modes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-8">
              <div>
                <h4 className="font-semibold text-lg mb-4">Classic Mode</h4>
                <p className="text-sm text-muted-foreground mb-4">Traditional ASCII characters for detailed artistic rendering</p>
                <div className="border rounded-lg p-6 bg-muted/20 w-full flex items-center justify-center" style={{ height: 400 }}>
                  <AsciiImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_iuLWJHl-zfu1gOcxgox6MTqORHsuP9wzIw&s" mode="classic"  fitToContainer={true}/>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-4">Blocks Mode</h4>
                <p className="text-sm text-muted-foreground mb-4">High-contrast block characters for bold, pixelated effects</p>
                <div className="border rounded-lg p-6 bg-muted/20 w-full flex items-center justify-center" style={{ height: 400 }}>
                  <AsciiImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_iuLWJHl-zfu1gOcxgox6MTqORHsuP9wzIw&s" mode="blocks"  fitToContainer={true}/>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-4">Color Mode</h4>
                <p className="text-sm text-muted-foreground mb-4">Full color ASCII art preserving original image colors</p>
                <div className="border rounded-lg p-6 bg-muted/20 w-full flex items-center justify-center" style={{ height: 400 }}>
                  <AsciiImage
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_iuLWJHl-zfu1gOcxgox6MTqORHsuP9wzIw&s"
                    mode="classic"
                    colorMode="color"
                    fitToContainer={true}
                  />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-4">Detailed Mode</h4>
                <p className="text-sm text-muted-foreground mb-4">Fine-grained characters for intricate detail preservation</p>
                <div className="border rounded-lg p-6 bg-muted/20 w-full flex items-center justify-center" style={{ height: 400 }}>
                  <AsciiImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_iuLWJHl-zfu1gOcxgox6MTqORHsuP9wzIw&s" mode="detailed" fitToContainer={true} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ASCII Modes Comparison */}
      {component.slug === "ascii" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">ASCII Modes</CardTitle>
            <CardDescription>Compare different character sets and their visual effects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Classic</h4>
                <p className="text-xs text-muted-foreground">
                  {"@$B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!lI;:,\"^`'."}
                </p>
                <div className="text-xs font-mono bg-muted p-2 rounded">Traditional ASCII art characters</div>
                <h4 className="font-semibold">Blocks</h4>
                <p className="text-xs text-muted-foreground">██▓▒░</p>
                <div className="text-xs font-mono bg-muted p-2 rounded">High-contrast block characters</div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Shades</h4>
                <p className="text-xs text-muted-foreground">██▓▒░</p>
                <div className="text-xs font-mono bg-muted p-2 rounded">Gradient block characters</div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Numbers</h4>
                <p className="text-xs text-muted-foreground">9876543210</p>
                <div className="text-xs font-mono bg-muted p-2 rounded">Numeric character mapping</div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Alphanumeric</h4>
                <p className="text-xs text-muted-foreground">ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789</p>
                <div className="text-xs font-mono bg-muted p-2 rounded">Letters and numbers only</div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Minimal</h4>
                <p className="text-xs text-muted-foreground">█▌</p>
                <div className="text-xs font-mono bg-muted p-2 rounded">Simple block characters</div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Detailed</h4>
                <p className="text-xs text-muted-foreground">@%#*+=-:.</p>
                <div className="text-xs font-mono bg-muted p-2 rounded">Fine detail characters</div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">Pixel</h4>
                <p className="text-xs text-muted-foreground">██▀▄</p>
                <div className="text-xs font-mono bg-muted p-2 rounded">Pixelated block effect</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Usage</CardTitle>
          <CardDescription>How to use this component in your project</CardDescription>
        </CardHeader>
        <CardContent>
          {usage ? (
            <div className="relative">
              <pre className="bg-muted/50 border rounded-lg p-4 overflow-x-auto text-sm font-mono leading-relaxed">
                <code>{usage}</code>
              </pre>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Usage information is being loaded from MDX documentation...</p>
              <p className="text-sm mt-2">If this persists, check the console for errors.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Props Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Props</CardTitle>
          <CardDescription>Available properties for this component</CardDescription>
        </CardHeader>
        <CardContent>
          {props && props.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-sm">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Required</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Default</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {props.map((prop, index) => (
                    <tr
                      key={prop.name}
                      className={index !== props.length - 1 ? "border-b border-border/50" : ""}
                    >
                      <td className="py-3 px-4">
                        <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{prop.name}</code>
                      </td>
                      <td className="py-3 px-4">
                        <code className="text-sm text-muted-foreground">{prop.type}</code>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={prop.required ? "destructive" : "secondary"} className="text-xs">
                          {prop.required ? "Required" : "Optional"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {prop.default !== undefined ? (
                          <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{String(prop.default)}</code>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground max-w-xs">{prop.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>Props information is being loaded from MDX documentation...</p>
              <p className="text-sm mt-2">If this persists, check the console for errors.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Examples Section */}
      {examples && examples.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Examples</CardTitle>
            <CardDescription>See the component in action with different use cases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {examples.map((example, index) => (
              <div key={index} className="space-y-4">
                <h4 className="font-semibold text-lg">{example.title}</h4>
                <div className="relative">
                  <pre className="bg-muted/50 border rounded-lg p-4 overflow-x-auto text-sm font-mono leading-relaxed">
                    <code>{example.code}</code>
                  </pre>
                </div>
                {component.slug === "ascii" && index === 0 && (
                  <div className="border rounded-lg p-6 bg-card">
                    <div className="text-sm text-muted-foreground mb-3 font-medium">Preview:</div>
                    <div className="space-y-4">
                      <AsciiImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_iuLWJHl-zfu1gOcxgox6MTqORHsuP9wzIw&s" mode="shades" colorMode="color" dithering={true} fitToContainer={true} />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Full Documentation Section */}
      {mdxData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Documentation</CardTitle>
            <CardDescription>Complete component documentation</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: mdxData.source }}
            />
          </CardContent>
        </Card>
      )}

      {/* Tags Section */}
      {component.tags && component.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Tags</CardTitle>
            <CardDescription>Related categories and keywords</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {component.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
