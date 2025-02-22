import { cn } from "@/config/utils.ts";
import { useThemeStore } from "@/api/stores/themeStore.tsx";

interface MinecraftIconProps {
  name: keyof typeof iconPositions;
  size?: number;
  className?: string;
}

const iconPositions = {
  // Row 1
  "plus": [0, 0],
  "trash": [1, 0],
  "grid": [2, 0],
  "target": [3, 0],
  "double-down": [4, 0],
  "one-down": [5, 0],
  "one-up": [6, 0],
  "double-up": [7, 0],
  "bad": [8, 0],
  "good": [9, 0],
  "checklist-patial": [10, 0],
  "checklist-full": [11, 0],
  "checklist-none": [12, 0],
  "sword-menu": [13, 0],
  "sword": [14, 0],
  // Row 2
  "checkmark": [0, 1],
  "equals": [1, 1],
  "folder": [2, 1],
  "clockwise": [3, 1],
  "notice": [4, 1],
  "dialog": [5, 1],
  "pinwheel-full": [6, 1],
  "pinwheel-partial": [7, 1],
  "pinwheel-none": [8, 1],
  "coupled": [9, 1],
  "half-coupled": [10, 1],
  "uncoupled": [11, 1],
  "rotate": [12, 1],
  "rotate-dotted": [13, 1],
  "rotate-reverse": [14, 1],
  // Row 3
  "unknown-1": [0, 2],
  "unknown-2": [1, 2],
  "unknown-3": [2, 2],
  "unknown-4": [3, 2],
  "unknown-5": [4, 2],
  "unknown-6": [5, 2],
  "unknown-7": [6, 2],
  "unknown-8": [7, 2],
  "unknown-9": [8, 2],
  "unknown-10": [9, 2],
  "unknown-11": [10, 2],
  "unknown-12": [11, 2],
  "unknown-13": [12, 2],
  "left-click": [13, 2],
  "middle-click": [14, 2],
  "right-click": [15, 2],
  // Row 4
  // Row 5
  // Row 6
  "play": [0, 5],
  "pause": [1, 5],
  "stop": [2, 5],
  "unknown-14": [3, 5],
  "counter-clockwise": [4, 5],
  "unknown-15": [5, 5],
  "unknown-16": [6, 5],
  "unknown-17": [7, 5],
  // Row 7
  // Row 8
  "unknown-18": [0, 7],
  "unknown-19": [1, 7],
  "unknown-20": [2, 7],
  "unknown-21": [3, 7],
  "can-delete": [4, 7],
  // Row 9
  "schematic": [0, 8],
  "unknown-22": [1, 8],
  "reticule": [2, 8],
  "reticule-small": [3, 8],
  "reticule-round": [4, 8],
  // Row 10
  "chevron-left": [0, 9],
  "exit": [1, 9],
  "chevron-right": [2, 9],
  "search": [3, 9],
  "magnifying-glass": [3, 9],
  "rotate-arrow": [4, 9],
  "layer": [5, 9],
  "datetime": [6, 9],
  // Row 11
  "unlock": [0, 10],
  "lock": [1, 10],
  "garbage": [2, 10],
  "save": [3, 10],
  "refresh": [4, 10],
  "back": [5, 10],
  "back-one": [6, 10],
  "forward-one": [7, 10],
  "X": [8, 10],
  "forward": [9, 10],
  // Row 12
  "cube": [0, 11],
  "cube-filled": [1, 11],
  "mound": [2, 11],
  "mound-filled": [3, 11],
  "apart": [4, 11],
  "stacked": [5, 11],

} as const;


const MinecraftIcon = ({ name, size = 16, className }: MinecraftIconProps) => {
  const lightIcons = 'src/assets/icons/create_icons.png';
  const darkIcons = 'src/assets/icons/create_icons_dark.png';
  const { isDarkMode } = useThemeStore();
  
  const [x, y] = iconPositions[name];
  
  return (
    <div 
      className={cn("inline-block bg-no-repeat", className)}
      style={{
        width: size,
        height: size,
        backgroundImage: `url(${isDarkMode ? darkIcons : lightIcons})`,
        backgroundSize: `${size * 16}px ${size * 16}px`,
        backgroundPosition: `-${x * size}px -${y * size}px`,
        imageRendering: "pixelated"
      }}
      role="img"
      aria-label={name}
    />
  );
};

export default MinecraftIcon;