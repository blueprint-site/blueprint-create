import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card";

const ColorsSection = () => {
  const colorSystem = {
    base: [
      {
        name: "Blueprint",
        class: "bg-blueprint",
        description: "Primary brand color, used for main UI elements",
      },
    ],
    surfaces: [
      {
        name: "Surface 1",
        class: "bg-surface-1",
        description: "Primary surface, main content areas",
      },
      {
        name: "Surface 2",
        class: "bg-surface-2",
        description: "Secondary surface, raised elements",
      },
      {
        name: "Surface 3",
        class: "bg-surface-3",
        description: "Tertiary surface, highest elevation",
      },
    ],
    semantic: [
      {
        name: "Primary",
        class: "bg-primary",
        description: "Main actions and navigation",
      },
      {
        name: "Secondary",
        class: "bg-secondary",
        description: "Supporting actions",
      },
      {
        name: "Accent",
        class: "bg-accent",
        description: "Interactive elements and highlights",
      },
      {
        name: "Success",
        class: "bg-success",
        description: "Positive actions and alerts",
      },
      {
        name: "Warning",
        class: "bg-warning",
        description: "Cautionary actions and alerts",
      },
      {
        name: "Destructive",
        class: "bg-destructive",
        description: "Dangerous or destructive actions",
      },
    ],
    text: [
      {
        name: "Foreground",
        class: "bg-foreground",
        description: "Primary text color",
      },
      {
        name: "Semantic Foreground",
        class: "bg-semantic-foreground",
        description: "Text on colored backgrounds",
        cardClass: "bg-success",
      },
      {
        name: "Blueprint Foreground",
        class: "bg-blueprint-foreground",
        description: "Text on blueprint background",
        cardClsas: "bg-blueprint",
      },
      {
        name: "Foreground Muted",
        class: "bg-foreground-muted",
        description: "Secondary text and disabled states",
      },
      {
        name: "Semantic Foreground Muted",
        class: "bg-semantic-foreground-muted",
        description: "Secondary text on colored backgrounds",
        cardClass: "bg-accent",
      },
      {
        name: "Blueprint Foreground Muted",
        class: "bg-blueprint-foreground-muted",
        description: "Secondary text on blueprint background",
        cardClass: "bg-blueprint",
      },
    ],
    states: [

      {
        name: "Border",
        class: "border-2 border-border",
        description: "Borders and dividers",
      },
      {
        name: "Ring",
        class: "border-2 border-ring",
        description: "Focus states and outlines",
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Color System</h2>
        <p className="text-foreground-muted mb-8">
          A comprehensive color system designed for Blueprint's UI components
          and brand identity.
        </p>
      </div>

      {Object.entries(colorSystem).map(([category, colors]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-xl font-semibold capitalize">
            {category} Colors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {colors.map((color) => (
              <Card key={color.name} className="bg-background border">
                <CardHeader>
                  <div className={`${color.class} h-16 rounded`} />
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="font-semibold">{color.name}</p>
                    <p className="text-sm">{color.description}</p>
                    <p className="text-xs font-mono text-foreground/80">
                      {color.class}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ColorsSection;
