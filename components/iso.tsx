// Tiny isometric toolkit. World axes: x runs right-down, y runs left-down,
// z runs up. Faces can be drawn in flat 2D by wrapping content in a <g> that
// uses one of the matrix helpers below.

const C = 0.866;
const S = 0.5;

export function P(x: number, y: number, z = 0): [number, number] {
  return [C * (x - y), S * (x + y) - z];
}

const pts = (list: [number, number][]) =>
  list.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

/** Floor / top plane: local (u, v) maps to world (x + u, y + v, z). */
export function topM(x = 0, y = 0, z = 0) {
  const [px, py] = P(x, y, z);
  return `matrix(${C} ${S} ${-C} ${S} ${px} ${py})`;
}

/** Left-front face (plane y = const): local u runs along +x, v runs down. */
export function leftM(x: number, y: number, z: number) {
  const [px, py] = P(x, y, z);
  return `matrix(${C} ${S} 0 1 ${px} ${py})`;
}

/** Right-front face (plane x = const): local u runs toward -y, v runs down.
 *  Pass the front corner (largest y) as the origin. */
export function rightM(x: number, y: number, z: number) {
  const [px, py] = P(x, y, z);
  return `matrix(${C} ${-S} 0 1 ${px} ${py})`;
}

type BoxProps = {
  x: number;
  y: number;
  z?: number;
  w: number; // along x
  d: number; // along y
  h: number;
  top?: string;
  left?: string;
  right?: string;
  stroke?: string;
  sw?: number;
  opacity?: number;
};

export function Box({
  x,
  y,
  z = 0,
  w,
  d,
  h,
  top = "var(--ill-hi)",
  left = "var(--ill-mid)",
  right = "var(--ill-dark)",
  stroke = "var(--line-strong)",
  sw = 0.75,
  opacity,
}: BoxProps) {
  const z1 = z + h;
  return (
    <g stroke={stroke} strokeWidth={sw} strokeLinejoin="round" opacity={opacity}>
      <polygon
        fill={left}
        points={pts([
          P(x, y + d, z1),
          P(x + w, y + d, z1),
          P(x + w, y + d, z),
          P(x, y + d, z),
        ])}
      />
      <polygon
        fill={right}
        points={pts([
          P(x + w, y + d, z1),
          P(x + w, y, z1),
          P(x + w, y, z),
          P(x + w, y + d, z),
        ])}
      />
      <polygon
        fill={top}
        points={pts([
          P(x, y, z1),
          P(x + w, y, z1),
          P(x + w, y + d, z1),
          P(x, y + d, z1),
        ])}
      />
    </g>
  );
}
