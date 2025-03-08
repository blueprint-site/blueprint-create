export const minecraftIcons = [
  'plus',
  'trash',
  'grid',
  'target',
  'double-down',
  'one-down',
  'one-up',
  'double-up',
  'bad',
  'good',
  'checklist-patial',
  'checklist-full',
  'checklist-none',
  'sword-menu',
  'sword',
  // Row 2
  'checkmark',
  'equals',
  'folder',
  'clockwise',
  'notice',
  'dialog',
  'pinwheel-full',
  'pinwheel-partial',
  'pinwheel-none',
  'coupled',
  'half-coupled',
  'uncoupled',
  'rotate',
  'rotate-dotted',
  'rotate-reverse',
  // Row 3
  'unknown-1',
  'unknown-2',
  'unknown-3',
  'unknown-4',
  'unknown-5',
  'unknown-6',
  'unknown-7',
  'unknown-8',
  'unknown-9',
  'unknown-10',
  'unknown-11',
  'unknown-12',
  'unknown-13',
  'left-click',
  'middle-click',
  'right-click',
  // Row 4
  // Row 5
  // Row 6
  'play',
  'pause',
  'stop',
  'unknown-14',
  'counter-clockwise',
  'unknown-15',
  'unknown-16',
  'unknown-17',
  // Row 7
  // Row 8
  'unknown-18',
  'unknown-19',
  'unknown-20',
  'unknown-21',
  'can-delete',
  // Row 9
  'schematic',
  'unknown-22',
  'reticule',
  'reticule-small',
  'reticule-round',
  // Row 10
  'chevron-left',
  'exit',
  'chevron-right',
  'search',
  'magnifying-glass',
  'rotate-arrow',
  'layer',
  'datetime',
  // Row 11
  'unlock',
  'lock',
  'garbage',
  'save',
  'refresh',
  'back',
  'back-one',
  'forward-one',
  'X',
  'forward',
  // Row 12
  'cube',
  'cube-filled',
  'mound',
  'mound-filled',
  'apart',
  'stacked',
] as const;

export type MinecraftIconName = (typeof minecraftIcons)[number];
