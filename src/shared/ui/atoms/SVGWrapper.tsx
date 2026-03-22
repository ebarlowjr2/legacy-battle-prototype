import React from 'react';
import svg from '@/assets/svg';
import { ViewPropStyle } from '@/shared/types/ui';

interface SVGProps {
  name: keyof typeof svg;
  colour?: string;
  fillColour?: string;
  style?: ViewPropStyle;
  [key: string]: unknown;
}

/**
 * Render an SVG from a list of SVGs
 * @param props - Props including the name of the SVG and other optional attributes
 * @returns JSX.Element | null
 */
function SVGWrapperInner({ name, ...props }: SVGProps): React.JSX.Element | null {
  const SVG = svg?.[name];
  return SVG ? <SVG {...props} /> : null;
}

export default React.memo(SVGWrapperInner);
