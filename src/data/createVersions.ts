/**
 * Create Version Compatibility Mapping
 * Maps Minecraft versions to compatible Create mod versions
 */

export interface CreateVersion {
  /** The Create version identifier (e.g. "0.5", "6.0") */
  value: string;
  /** Human-readable label for display (e.g. "0.5", "6.0") */
  label: string;
  /** Order for sorting (lower number means higher priority) */
  sortOrder: number;
}

export interface CreateModId {
  /** The Create mod ID on Modrinth */
  FORGE: string;
  /** The Create Fabric ID on Modrinth */
  FABRIC: string;
  /** The Flywheel dependency ID on Modrinth */
  FLYWHEEL: string;
}

/**
 * Create mod IDs on Modrinth
 */
export const CREATE_MOD_IDS: CreateModId = {
  FORGE: 'LNytGWDc', // Create (Forge/NeoForge)
  FABRIC: 'Xbc0uyRg', // Create Fabric
  FLYWHEEL: '5lpsZoRi', // Flywheel (dependency)
};

/**
 * Known Create versions and their display data
 */
export const CREATE_VERSIONS: Record<string, CreateVersion> = {
  '0.1': { value: '0.1', label: '0.1', sortOrder: 50 },
  '0.2': { value: '0.2', label: '0.2', sortOrder: 40 },
  '0.3': { value: '0.3', label: '0.3', sortOrder: 30 },
  '0.4': { value: '0.4', label: '0.4', sortOrder: 20 },
  '0.5': { value: '0.5', label: '0.5', sortOrder: 10 },
  '6.0': { value: '6.0', label: '6.0', sortOrder: 0 },
};

/**
 * Maps Minecraft versions to compatible Create versions
 * Key: Minecraft version
 * Value: Array of Create version strings
 */
export const MINECRAFT_TO_CREATE_VERSIONS: Record<string, string[]> = {
  '1.14.4': ['0.1', '0.2'], // Early betas
  '1.15.2': ['0.2', '0.3'], // 0.2.4e through 0.3.1a
  '1.16.3': ['0.3'], // v0.3c through v0.3e
  '1.16.4': ['0.3'], // v0.3c through v0.3.1c
  '1.16.5': ['0.3'], // v0.3.1a through v0.3.2g
  '1.18': ['0.4'], // v0.4
  '1.18.1': ['0.4'], // v0.4a through v0.4c
  '1.18.2': ['0.4', '0.5'], // Both 0.4 and 0.5 series
  '1.19.2': ['0.5'], // 0.5 series
  '1.20.1': ['0.5', '6.0'], // Both 0.5 and 6.0 series
  '1.21.1': ['6.0'], // 6.0 series
};

/**
 * Version-related regular expressions for extracting Create versions from text
 */
export const CREATE_VERSION_PATTERNS = [
  // Direct Create version mentions
  /create[\s-]*v?(\d+\.\d+(?:\.\d+)?[a-z0-9-]*)/i,
  // "For Create X.Y"
  /for[\s-]*create[\s-]*v?(\d+\.\d+(?:\.\d+)?[a-z0-9-]*)/i,
  // Create with something between (like "Create Fabric 0.5")
  /create[\s-]*[\w-]*[\s-]*(\d+\.\d+(?:\.\d+)?)/i,
];

// Create Forge version mapping for 0.3, 0.4, 0.5, and 6.0 versions
export const createForgeVersionMap = {
  // 6.0 versions
  wYOXyPP5: '6.0', // 1.20.1-6.0.3
  s3Pltpiv: '6.0', // 1.21.1-6.0.3
  mXfmc8qO: '6.0', // 1.20.1-6.0.2
  N367NzaZ: '6.0', // 1.21.1-6.0.2
  IJpm7znS: '6.0', // 1.21.1-6.0.1
  yiECLWCs: '6.0', // 1.20.1-6.0.1
  NEb0yK69: '6.0', // 1.21.1-6.0.0
  '5vscABRG': '6.0', // 1.20.1-6.0.0

  // All 0.5.x versions map to "0.5"
  '6R069CcK': '0.5', // 1.20.1-0.5.1.j
  '9df9xn5Z': '0.5', // 1.20.1-0.5.1.i
  tJVykywJ: '0.5', // 1.19.2-0.5.1.i
  '7BIftSin': '0.5', // 1.18.2-0.5.1.i
  ZZW2y7nG: '0.5', // 1.20.1-0.5.1.h
  '3xeyebKN': '0.5', // 1.19.2-0.5.1.h
  PPBSr5ud: '0.5', // 1.18.2-0.5.1.h
  Sg7CifFb: '0.5', // 1.20.1-0.5.1.g
  fo2Gf9pn: '0.5', // 1.19.2-0.5.1.g
  rKV201e5: '0.5', // 1.18.2-0.5.1.g
  HNYrbfZZ: '0.5', // 1.20.1-0.5.1.f
  Vfzp1Xaz: '0.5', // 1.19.2-0.5.1.f
  kvDi1uyh: '0.5', // 1.18.2-0.5.1.f
  F8INqv9w: '0.5', // 1.20.1-0.5.1.e
  BzindULC: '0.5', // 1.19.2-0.5.1.e
  ZyOnhaSB: '0.5', // 1.18.2-0.5.1.e
  tIhVl7AP: '0.5', // 1.20.1-0.5.1.d
  gjvACune: '0.5', // 1.20.1-0.5.1.c
  '2aUVdjOe': '0.5', // 1.19.2-0.5.1.c
  PTHAyfx7: '0.5', // 1.18.2-0.5.1.c
  '6ZQIjBQo': '0.5', // 1.19.2-0.5.1.b
  BnkUJVhl: '0.5', // 1.19.2-0.5.1.b
  '4awoSQJV': '0.5', // 1.19.2-0.5.1.a
  '8LczbIGv': '0.5', // 1.18.2-0.5.1.a
  '1Nb1UGA5': '0.5', // 1.19.2-0.5.0.i
  iRckjniU: '0.5', // 1.18.2-0.5.0.i
  '7wAE1EBf': '0.5', // 1.19.2-0.5.0.h
  '74qMainw': '0.5', // 1.18.2-0.5.0.h
  '8u9atQ9x': '0.5', // 1.19.2-0.5.0.g
  '679bk5la': '0.5', // 1.18.2-0.5.0.g
  DI8s7Siu: '0.5', // 1.19.2-0.5.0.f
  IsdIyd4f: '0.5', // 1.19.2-0.5.0.e
  DfnKjc7G: '0.5', // 1.18.2-0.5.0.e
  xRw8XV1l: '0.5', // 1.18.2-0.5.0.d
  w5UlhTtV: '0.5', // 1.18.2-0.5.0c
  agqHZOAO: '0.5', // 1.18.2-0.5.0b
  '6IophzXm': '0.5', // 1.18.2-0.5.0a
  '5qZVd4uA': '0.5', // 1.18.2-0.5.0

  // Known 0.4 versions (we don't have IDs for these, but they will be detected by version pattern)
  FORGE_0_4: '0.4', // Generic placeholder for Create 1.18 v0.4
  FORGE_0_4A: '0.4', // Generic placeholder for Create 1.18.1 v0.4a
  FORGE_0_4B: '0.4', // Generic placeholder for Create 1.18.1 v0.4b
  FORGE_0_4C: '0.4', // Generic placeholder for Create 1.18.1 v0.4c

  // Known 0.3 versions (we don't have IDs for these, but they will be detected by version pattern)
  FORGE_0_3: '0.3', // Generic placeholder for Create 1.16.x v0.3
  FORGE_0_3_1: '0.3', // Generic placeholder for Create 1.16.x v0.3.1
  FORGE_0_3_2: '0.3', // Generic placeholder for Create 1.16.x v0.3.2
};

// Create Fabric version mapping
export const createFabricVersionMap = {
  // 0.5 versions
  XMiAOQvM: '0.5', // 0.5.1-i-build.1630+mc1.19.2
  '7Ub71nPb': '0.5', // 0.5.1-j-build.1631+mc1.20.1
  L283tIV7: '0.5', // 0.5.1-i-build.1629+mc1.18.2
  lNcgFlF8: '0.5', // 0.5.1-j-build.1609+mc1.20.1
  cVnXjt7x: '0.5', // 0.5.1-i-build.1608+mc1.19.2
  GOkLKgci: '0.5', // 0.5.1-i-build.1603+mc1.19.2
  '4Flkixdq': '0.5', // 0.5.1-j-build.1604+mc1.20.1
  S5OtZS6Y: '0.5', // 0.5.1-j-build.1600+mc1.20.1
  iMqYwC9I: '0.5', // 0.5.1-i-build.1599+mc1.19.2
  KW1sKlUC: '0.5', // 0.5.1-i-build.1598+mc1.18.2
  h2HgGyvA: '0.5', // 0.5.1-f-build.1417+mc1.20.1
  ylv5ppFs: '0.5', // 0.5.1-f-build.1416+mc1.19.2
  ACfVIQMB: '0.5', // 0.5.1-f-build.1415+mc1.18.2
  '42mznDva': '0.5', // 0.5.1-f-build.1334+mc1.19.2
  A8R3Be5A: '0.5', // 0.5.1-f-build.1335+mc1.20.1
  mFmmdAVA: '0.5', // 0.5.1-f-build.1333+mc1.18.2
  qlA1WuOK: '0.5', // 0.5.1-d-build.1161+mc1.20.1
  '3eQP1uZu': '0.5', // 0.5.1-c-build.1159+mc1.18.2
  okpdciJG: '0.5', // 0.5.1-c-build.1160+mc1.19.2
  uxdmLu14: '0.5', // 0.5.1-b-build.1088+mc1.18.2
  wKEEi1qX: '0.5', // 0.5.1-b-build.1089+mc1.19.2
  q6x0xvc1: '0.5', // 0.5.1-b-build.1079+mc1.19.2
  '8hPKnWl8': '0.5', // 0.5.1-b-build.1078+mc1.18.2
  i0067Dja: '0.5', // 0.5.1-b-build.1070+mc1.18.2
  ojGZcMyX: '0.5', // 0.5.1-b-build.1075+mc1.19.2
  EkeMb3jA: '0.5', // 0.5.0.i-1017+1.19.2
  URHyiw9Z: '0.5', // 0.5.0.i-1016+1.18.2
  kOmlEnRT: '0.5', // 0.5.0.i-1002+1.18.2
  js1edbtD: '0.5', // 0.5.0.i-1003+1.19.2
  MpeKaF3n: '0.5', // 0.5.0.i-991+1.19.2
  OzM1R01X: '0.5', // 0.5.0.i-989+1.19.2
  SDRtfq3B: '0.5', // 0.5.0.i-988+1.18.2
  '6WodDaRw': '0.5', // 0.5.0.i-979+1.18.2
  wSUajPZ2: '0.5', // 0.5.0.i-963+1.18.2
  eiOEbe83: '0.5', // 0.5.0.i-961+1.19.2
  XfN2Gwkh: '0.5', // 0.5.0.i-960+1.18.2
  '9Kizjtn4': '0.5', // 0.5.0.i-946+1.19.2
  eMmAlNIo: '0.5', // 0.5.0.i-944+1.18.2
  WIznfof3: '0.5', // 0.5.0.i-925+1.19.2
  '8wJieFuI': '0.5', // 0.5.0.i-921+1.18.2
  ZOucvJwc: '0.5', // 0.5.0.g-796+1.19.2
  aCFWhh4m: '0.5', // 0.5.0.g-792+1.18.2
  KVlT278H: '0.5', // 0.5.0.g-788+1.18.2
  CMXqOgvp: '0.5', // 0.5.0.g-791+1.19.2
  '5QkKPfWg': '0.5', // 0.5.0.f-776+1.19.2
  AUnWONBr: '0.5', // 0.5.0.e-733+1.18.2
  l66YzGBK: '0.5', // 0.5.0.d-731+1.18.2
  mEHNMQS7: '0.5', // 0.5.0.d-730+1.18.2
  uAheUy8q: '0.5', // 0.5.0.d-728+1.18.2
  j7rLltXv: '0.5', // 0.5.0.c-708+1.18.2

  // 0.4 versions
  kTNqWWMa: '0.4', // 0.4.1-637+1.18.2
  TMePrzvw: '0.4', // 0.4.1-635+1.18.2
  bJKtTI8y: '0.4', // 0.4.1-631+1.18.2
  claJcl5F: '0.4', // 0.4.1-629+1.18.2
  CDGw3zSe: '0.4', // 0.4.1-628+1.18.2
  eNCMQaKl: '0.4', // 0.4.1-601+1.18.2
  '5nlKopWj': '0.4', // 0.4.1-600+1.18.2
  OYqqVNgO: '0.4', // 0.4.1-599+1.18.2
  LQns5RQ4: '0.4', // 0.4.1-596+1.18.2
  yFEFFnx0: '0.4', // 0.4.1-595+1.18.2
  bGga7Elj: '0.4', // 0.4.1-594+1.18.2
  eq17R2hD: '0.4', // 0.4.1-586+1.18.2
  ce9nGr3a: '0.4', // 0.4.1-576+1.18.2
  mRXoRTy0: '0.4', // 0.4.1+1.18.2
};
