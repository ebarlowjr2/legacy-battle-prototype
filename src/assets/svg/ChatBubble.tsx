import { moderateScale } from '@/shared/theme/theme';
import { IconProps } from '@/shared/types/ui';
import { JSX } from 'react';
import { SvgXml } from 'react-native-svg';

export default function Whatsapp({ fill = '#fff', ...props }: IconProps): JSX.Element {
  const svgMarkup = `
  <svg width=${moderateScale(73)} height=${moderateScale(73)} viewBox="0 0 73 73" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="18.2012" width="56" height="56" rx="12" transform="rotate(15 18.2012 0)" fill="#FF0000"/>
  <foreignObject x="-16" y="0.292969" width="88" height="88"><div xmlns="http://www.w3.org/1999/xhtml" style="backdrop-filter:blur(8px);clip-path:url(#bgblur_0_658_3642_clip_path);height:100%;width:100%"></div></foreignObject><g data-figma-bg-blur-radius="16">
  <rect y="16.293" width="56" height="56" rx="12" fill="white" fill-opacity="0.6"/>
  <rect x="0.5" y="16.793" width="55" height="55" rx="11.5" stroke="white" stroke-opacity="0.6"/>
  <path d="M38.4994 43.7096C38.4994 49.1865 34.0596 53.6263 28.5827 53.6263C27.3265 53.6263 26.1248 53.3927 25.0187 52.9666C24.8165 52.8887 24.7154 52.8497 24.635 52.8312C24.5559 52.813 24.4987 52.8054 24.4176 52.8023C24.3351 52.7991 24.2447 52.8085 24.0637 52.8272L18.0892 53.4447C17.5196 53.5036 17.2348 53.5331 17.0668 53.4306C16.9204 53.3413 16.8208 53.1922 16.7942 53.0229C16.7638 52.8284 16.8999 52.5765 17.1721 52.0727L19.0803 48.5406C19.2375 48.2497 19.3161 48.1043 19.3517 47.9644C19.3868 47.8263 19.3953 47.7267 19.3841 47.5846C19.3727 47.4408 19.3096 47.2535 19.1833 46.879C18.8479 45.8838 18.6661 44.818 18.6661 43.7096C18.6661 38.2328 23.1059 33.793 28.5827 33.793C34.0596 33.793 38.4994 38.2328 38.4994 43.7096Z" stroke="#383E49" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <defs>
  <clipPath id="bgblur_0_658_3642_clip_path" transform="translate(16 -0.292969)"><rect y="16.293" width="56" height="56" rx="12"/>
  </clipPath></defs>
  </svg>
  `;

  return <SvgXml xml={svgMarkup} {...props} />;
}
