/**
 * Document data interface
 */
export interface DocumentData {
  id: string;
  path: string;
  name: string;
  type: string;
  size: number;
  dimensions: {
    width: number;
    height: number;
  };
  pages: number;
  dateOpened: Date;
}

/**
 * Text frame interface
 */
export interface TextFrame {
  id: string;
  documentId: string;
  pageIndex: number;
  position: {
    x: number;
    y: number;
  };
  dimensions: {
    width: number;
    height: number;
  };
  content: string;
  style: TextStyle;
}

/**
 * Text style interface
 */
export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  tracking: number;
  wordSpacing: number;
  baselineOffset: number;
  color: string;
}

/**
 * Alignment settings interface
 */
export interface AlignmentSettings {
  type: 'tracking' | 'baseline' | 'wordSpacing' | 'combined';
  highlightColor: string;
  wordSpacingFactor: number;
  autoApply: boolean;
  showWarnings: boolean;
  previewEnabled: boolean;
}

/**
 * Grid settings interface
 */
export interface GridSettings {
  baselineSize: number;
  gridColor: string;
  gridOpacity: number;
  showGrid: boolean;
  snapToGrid: boolean;
  gridOffset: number;
  horizontalGrid: boolean;
  verticalGrid: boolean;
  horizontalSpacing: number;
  verticalSpacing: number;
}

/**
 * Alignment issue interface
 */
export interface AlignmentIssue {
  id: string;
  textFrameId: string;
  type: 'baseline' | 'tracking' | 'wordSpacing';
  severity: 'low' | 'medium' | 'high';
  position: {
    start: number;
    end: number;
  };
  description: string;
}

/**
 * Preset interface
 */
export interface Preset {
  id: string;
  name: string;
  description: string;
  dateCreated: Date;
  alignmentSettings: AlignmentSettings;
  gridSettings: GridSettings;
}
