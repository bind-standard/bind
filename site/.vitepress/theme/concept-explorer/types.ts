export interface CategoryDef {
  id: string;
  label: string;
  color: { light: string; dark: string };
  bgColor: { light: string; dark: string };
}

export interface GraphNode {
  id: string;
  label: string;
  abbrev: string;
  category: string;
  description: string;
  // Mutable position set by d3-force
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  vx?: number;
  vy?: number;
  index?: number;
}

export interface GraphEdge {
  source: string | GraphNode;
  target: string | GraphNode;
  label: string;
  isArray: boolean;
}
