export function HSLAToHex(hsla) {
  if (typeof hsla === "string" && hsla.startsWith("#") && hsla.length === 7)
    return hsla;
  let h = (hsla.hue ?? 0) / 360;
  let s = hsla.saturation;
  let l = hsla.brightness;

  // Convert HSL to RGB
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs(((h * 6) % 2) - 1));
  let m = l - c / 2;
  let r, g, b;

  if (h >= 0 && h < 1 / 6) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 1 / 6 && h < 2 / 6) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 2 / 6 && h < 3 / 6) {
    [r, g, b] = [0, c, x];
  } else if (h >= 3 / 6 && h < 4 / 6) {
    [r, g, b] = [0, x, c];
  } else if (h >= 4 / 6 && h < 5 / 6) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  // Convert RGB to hexadecimal
  let hexR = Math.round((r + m) * 255)
    .toString(16)
    .padStart(2, "0");
  let hexG = Math.round((g + m) * 255)
    .toString(16)
    .padStart(2, "0");
  let hexB = Math.round((b + m) * 255)
    .toString(16)
    .padStart(2, "0");

  return `#${hexR}${hexG}${hexB}`;
}

export const HEXtoHSLA = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);

  (r /= 255), (g /= 255), (b /= 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  s = s * 100;
  s = Math.round(s);
  l = l * 100;
  l = Math.round(l);
  h = Math.round(360 * h);

  return {
    hue: h,
    brightness: l,
    saturation: s,
  };
};
