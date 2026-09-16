export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

export const clamp = (v: number, mn: number, mx: number) =>
  Math.max(mn, Math.min(mx, v))

/** ease-in-out */
export const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

/** normalise v from the range [a,b] into [0,1] */
export const range = (v: number, a: number, b: number) =>
  clamp((v - a) / (b - a), 0, 1)

/**
 * One parallax plane in the hero.
 *
 * `scale` is the scroll-driven zoom: as the camera pushes through the arch, the
 * layers closest to the lens grow fastest and leave frame first. `mouse` is the
 * pixel offset applied on pointer move — the "wiggle". Nearer planes get both a
 * larger scale range and a larger mouse offset, which is what sells the depth.
 */
export type Layer = {
  src: string
  z: number
  /** px of pointer parallax */
  mouse: number
  /** scroll zoom, start -> end */
  scale: [number, number]
  /** static framing scale applied before the scroll zoom */
  base?: number
  /** px of vertical drift across the scroll */
  driftY?: number
  /** px of horizontal drift across the scroll (mirrored for the right side) */
  driftX?: number
  /** fades out over this scroll range */
  fade?: [number, number]
  /** transform-origin, so edge layers grow outward instead of from centre */
  origin?: string
  /**
   * Static shove, as a percentage of the plate. Every layer is full-bleed
   * `cover` (contain would letterbox and show a cut edge), so the way to open
   * up the centre is to push the dense foreground masses out past the frame
   * rather than shrink them.
   */
  offsetX?: number
  offsetY?: number
}

export const HERO_LAYERS: Layer[] = [
  { src: `${import.meta.env.BASE_URL}sky.webp`, z: 1, mouse: 4, scale: [1.0, 1.45] },
  { src: `${import.meta.env.BASE_URL}rays.webp`, z: 2, mouse: 7, scale: [1.0, 1.7], base: 1.05, driftY: -40 },
  // Sits low enough that the seafloor plate (z6) buries its sandbar. Zooms hard
  // on descent: it is the thing you are travelling toward, so it has to grow
  // faster than the water behind it or the approach reads as a flat push-in.
  {
    src: `${import.meta.env.BASE_URL}statue.webp`,
    z: 3,
    mouse: 9,
    scale: [1.0, 7.2],
    base: 0.44,
    offsetY: 17,
    driftY: 55,
  },
  {
    src: `${import.meta.env.BASE_URL}arch.webp`,
    z: 4,
    mouse: 12,
    scale: [1.0, 9.0],
    base: 0.94,
    fade: [0.4, 0.58],
  },
  {
    src: `${import.meta.env.BASE_URL}floor.webp`,
    z: 6,
    mouse: 15,
    scale: [1.0, 3.0],
    base: 1.06,
    origin: '50% 100%',
    offsetY: 9,
    driftY: 760,
    fade: [0.34, 0.54],
  },
  {
    src: `${import.meta.env.BASE_URL}fg-left.webp`,
    z: 7,
    mouse: 24,
    scale: [1.0, 3.8],
    base: 1.06,
    origin: '0% 100%',
    offsetX: -19,
    offsetY: 9,
    driftX: -880,
    driftY: 260,
    fade: [0.26, 0.46],
  },
  {
    src: `${import.meta.env.BASE_URL}fg-right.webp`,
    z: 7,
    mouse: 24,
    scale: [1.0, 3.8],
    base: 1.06,
    origin: '100% 100%',
    offsetX: 19,
    offsetY: 9,
    driftX: 880,
    driftY: 260,
    fade: [0.26, 0.46],
  },
  {
    src: `${import.meta.env.BASE_URL}canopy.webp`,
    z: 8,
    mouse: 19,
    scale: [1.0, 3.4],
    base: 1.04,
    origin: '50% 0%',
    offsetY: -12,
    driftY: -720,
    fade: [0.24, 0.44],
  },
]
