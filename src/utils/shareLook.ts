/**
 * @fileoverview Codificación y enlaces directos para compartir combinaciones de maquillaje en redes sociales.
 */

import { MakeupConfig } from '../types';

/**
 * Genera un enlace directo con los parámetros de la combinación de maquillaje integrados en la URL.
 */
export function buildShareableLookUrl(lookName: string, config: MakeupConfig, baseOrigin?: string): string {
  const origin =
    baseOrigin || (typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://palancia-estudio-glam.vercel.app/');
  const payload = {
    n: lookName,
    lc: config.lipColor,
    lo: config.lipOpacity,
    lg: config.lipGloss ? 1 : 0,
    ec: config.eyeshadowColor,
    eo: config.eyeshadowOpacity,
    el: config.eyelinerStyle,
    bc: config.blushColor,
    bo: config.blushOpacity,
    hl: config.highlighter ? 1 : 0,
    ic: config.irisColor,
    st: config.faceSticker,
  };
  const encoded = btoa(encodeURIComponent(JSON.stringify(payload)));
  return `${origin}?look=${encoded}`;
}

/**
 * Decodifica un look compartido desde el parámetro ?look= de la URL si existe.
 */
export function parseSharedLookFromQuery(
  searchQuery: string,
  defaultConfig: MakeupConfig
): { name: string; config: MakeupConfig } | null {
  try {
    const params = new URLSearchParams(searchQuery);
    const raw = params.get('look');
    if (!raw) return null;
    const decoded = JSON.parse(decodeURIComponent(atob(raw)));
    return {
      name: typeof decoded.n === 'string' ? decoded.n : 'Look Compartido',
      config: {
        ...defaultConfig,
        lipColor: decoded.lc || defaultConfig.lipColor,
        lipOpacity: typeof decoded.lo === 'number' ? decoded.lo : defaultConfig.lipOpacity,
        lipGloss: Boolean(decoded.lg),
        eyeshadowColor: decoded.ec || defaultConfig.eyeshadowColor,
        eyeshadowOpacity: typeof decoded.eo === 'number' ? decoded.eo : defaultConfig.eyeshadowOpacity,
        eyelinerStyle: decoded.el || defaultConfig.eyelinerStyle,
        blushColor: decoded.bc || defaultConfig.blushColor,
        blushOpacity: typeof decoded.bo === 'number' ? decoded.bo : defaultConfig.blushOpacity,
        highlighter: Boolean(decoded.hl),
        irisColor: decoded.ic || defaultConfig.irisColor,
        faceSticker: decoded.st || defaultConfig.faceSticker,
      },
    };
  } catch {
    return null;
  }
}

/**
 * Devuelve enlaces directos para compartir la combinación en redes sociales y mensajería familiar.
 */
export function getSocialShareLinks(lookName: string, shareUrl: string) {
  const message = `¡Mira mi diseño de maquillaje "${lookName}" creado después de estudiar en Palancia Estudio & Glam!`;
  const encodedText = encodeURIComponent(`${message} ${shareUrl}`);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(message);

  return {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
  };
}
