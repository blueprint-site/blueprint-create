import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MinecraftIcon from "@/components/utility/MinecraftIcon";
import { minecraftIcons } from "@/data/minecraftIcons";

import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Bell,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Download,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  File,
  FileText,
  Filter,
  Github,
  Heart,
  HelpCircle,
  Home,
  Image,
  Info,
  Link,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Menu,
  Moon,
  MoreHorizontal,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Share,
  Star,
  Sun,
  Trash,
  Upload,
  User,
  X,
} from "lucide-react";

const DesignSystem = () => {
  const colorSystem = {
    base: [
      {
        name: "Blueprint",
        class: "bg-blueprint",
        description: "Primary brand color, used for main UI elements",
      },
      {
        name: "Extended",
        class: "bg-extended",
        description: "Secondary brand color for accents and highlights",
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
        name: "Muted",
        class: "bg-muted",
        description: "Secondary text and disabled states",
      },
      {
        name: "Surface Text",
        class: "text-surface-text",
        description: "Text on colored backgrounds",
      },
    ],
    states: [
      {
        name: "Accent",
        class: "bg-accent",
        description: "Interactive elements and highlights",
      },
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
    <div className="container mx-auto p-8 space-y-12">
      <section>
        <h1 className="text-4xl font-bold mb-8">Blueprint Design System</h1>

        {/* Color System */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Color System</h2>
            <p className="text-muted-foreground mb-8">
              A comprehensive color system designed for Blueprint's UI
              components and brand identity.
            </p>
          </div>

          {Object.entries(colorSystem).map(([category, colors]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-xl font-semibold capitalize">
                {category} Colors
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colors.map((color) => (
                  <Card key={color.name}>
                    <CardHeader>
                      <div className={`${color.class} h-16 rounded`} />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        <p className="font-semibold">{color.name}</p>
                        <p className="text-sm">{color.description}</p>
                        <p className="text-xs font-mono text-foreground/80">{color.class}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        {/* Typography */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Typography</h2>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Heading 1</h1>
            <h2 className="text-3xl font-bold">Heading 2</h2>
            <h3 className="text-2xl font-bold">Heading 3</h3>
            <h4 className="text-xl font-bold">Heading 4</h4>
            <p className="text-base">Body text</p>
            <p className="text-sm">Small text</p>
            <p className="text-xs">Extra small text</p>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Buttons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <Settings />
            </Button>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Inputs */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Inputs</h2>
          <div className="grid gap-4 max-w-sm">
            <Input placeholder="Default input" />
            <Input placeholder="Outlined input" startIcon={Search} />
            <Input placeholder="Disabled input" disabled />
            <div className="flex gap-2">
              <Input placeholder="With button" />
              <Button>Send</Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Cards */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Cards</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content goes here.</p>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>

            <Card className="bg-blueprint">
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card content goes here.</p>
              </CardContent>
              <CardFooter>
                <Button>Action</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Profile Card</CardTitle>
                    <CardDescription>With avatar</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>Card with avatar example.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Badges */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Badges</h2>
          <div className="flex flex-wrap gap-4">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Avatar */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Avatars</h2>
          <div className="flex flex-wrap gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Tooltips */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Tooltips</h2>
          <div className="flex flex-wrap gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add new item</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send email</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Skeleton */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Skeleton</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
        <Separator className="my-8" />

        {/* Icons */}
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold">Icons</h2>

          {/* Minecraft Icons */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Minecraft Icons</h3>
            <div className="grid grid-cols-8 md:grid-cols-12 gap-4 p-6 bg-card rounded-lg">
              {minecraftIcons.map((name) => (
                <TooltipProvider key={name}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex flex-col items-center justify-center w-10 p-2 hover:bg-accent text-xs">
                        <MinecraftIcon
                          name={name}
                          size={32}
                        />
                        {name}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{name}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>

          {/* Lucide Icons */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Lucide Icons</h3>
            <div className="grid grid-cols-8 md:grid-cols-12 gap-4 p-4 bg-card rounded-lg">
              {[
                { icon: AlertCircle, name: "AlertCircle" },
                { icon: ArrowDown, name: "ArrowDown" },
                { icon: ArrowLeft, name: "ArrowLeft" },
                { icon: ArrowRight, name: "ArrowRight" },
                { icon: ArrowUp, name: "ArrowUp" },
                { icon: Bell, name: "Bell" },
                { icon: Check, name: "Check" },
                { icon: ChevronDown, name: "ChevronDown" },
                { icon: ChevronLeft, name: "ChevronLeft" },
                { icon: ChevronRight, name: "ChevronRight" },
                { icon: ChevronUp, name: "ChevronUp" },
                { icon: Copy, name: "Copy" },
                { icon: Download, name: "Download" },
                { icon: Edit, name: "Edit" },
                { icon: ExternalLink, name: "ExternalLink" },
                { icon: Eye, name: "Eye" },
                { icon: EyeOff, name: "EyeOff" },
                { icon: File, name: "File" },
                { icon: FileText, name: "FileText" },
                { icon: Filter, name: "Filter" },
                { icon: Github, name: "Github" },
                { icon: Heart, name: "Heart" },
                { icon: HelpCircle, name: "HelpCircle" },
                { icon: Home, name: "Home" },
                { icon: Image, name: "Image" },
                { icon: Info, name: "Info" },
                { icon: Link, name: "Link" },
                { icon: Loader2, name: "Loader2" },
                { icon: Lock, name: "Lock" },
                { icon: LogOut, name: "LogOut" },
                { icon: Mail, name: "Mail" },
                { icon: Menu, name: "Menu" },
                { icon: Moon, name: "Moon" },
                { icon: MoreHorizontal, name: "MoreHorizontal" },
                { icon: MoreVertical, name: "MoreVertical" },
                { icon: Plus, name: "Plus" },
                { icon: Search, name: "Search" },
                { icon: Settings, name: "Settings" },
                { icon: Share, name: "Share" },
                { icon: Star, name: "Star" },
                { icon: Sun, name: "Sun" },
                { icon: Trash, name: "Trash" },
                { icon: Upload, name: "Upload" },
                { icon: User, name: "User" },
                { icon: X, name: "X" },
              ].map(({ icon: Icon, name }) => (
                <TooltipProvider key={name}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center justify-center w-10 h-10 rounded hover:bg-accent">
                        <Icon className="w-4 h-4" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{name}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesignSystem;