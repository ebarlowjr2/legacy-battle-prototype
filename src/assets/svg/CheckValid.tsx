import { moderateScale } from '@/shared/theme/theme';
import { IconProps } from '@/shared/types/ui';
import { JSX } from 'react';
import { SvgXml } from 'react-native-svg';

export default function CheckValid({ fill = '#fff', ...props }: IconProps): JSX.Element {
  const svgMarkup = `
  <svg width=${moderateScale(20)} height=${moderateScale(20)} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_2391_3847)">
  <path d="M18.3332 9.23818V10.0049C18.3321 11.8019 17.7503 13.5504 16.6743 14.9897C15.5983 16.429 14.0859 17.4819 12.3626 17.9914C10.6394 18.501 8.79755 18.4398 7.1119 17.817C5.42624 17.1942 3.98705 16.0433 3.00897 14.5357C2.03089 13.0282 1.56633 11.2449 1.68457 9.45178C1.80281 7.65866 2.49751 5.95179 3.66507 4.58575C4.83263 3.2197 6.41049 2.26767 8.16333 1.87164C9.91617 1.47561 11.7501 1.6568 13.3915 2.38818M18.3332 3.33341L9.99984 11.6751L7.49984 9.17508" stroke="#17B26A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
  <clipPath id="clip0_2391_3847">
  <rect width="20" height="20" fill="white"/>
  </clipPath>
  </defs>
  </svg>
  `;

  return <SvgXml xml={svgMarkup} {...props} />;
}
