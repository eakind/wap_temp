function hexToRgba(hex, opacity) {
  if (typeof hex === 'object') hex = hex.background;
  if (hex === '#fff') hex = '#ffffff';
  if (hex === '#000') hex = '#000000';
  if (!opacity && opacity !== 0) opacity = 100;
  if (!hex) return 'rbga(255,255,255,0)';
  let r = parseInt('0x' + hex.slice(1, 3));
  let g = parseInt('0x' + hex.slice(3, 5));
  let b = parseInt('0x' + hex.slice(5, 7));
  if (opacity < 1 && opacity > 0) {
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  let a = opacity / 100;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
function rgbToHex(rgb) {
  // rgb(x, y, z)
  var color = rgb.toString().match(/\d+/g); // 把 x,y,z 推送到 color 数组里
  var hex = '#';

  for (var i = 0; i < 3; i++) {
    // 'Number.toString(16)' 是JS默认能实现转换成16进制数的方法.
    // 'color[i]' 是数组，要转换成字符串.
    // 如果结果是一位数，就在前面补零。例如： A变成0A
    hex += ('0' + Number(color[i]).toString(16)).slice(-2);
  }
  let opacity = 1;
  if (color.length > 3) {
    opacity = color.slice(3).join('.');
  }
  return { hex, opacity };
}

function retStyleObj({
  bgColor,
  border,
  padding,
  fontColor,
  fontSize,
  fontStyle,
  textAlign,
}) {
  let styleObj = {};
  if (bgColor && bgColor.bgSelected) {
    styleObj.background = hexToRgba(bgColor.background, bgColor.opacity);
  }

  if (border && border.bgSelected) {
    let borderRes = hexToRgba(border.background, border.opacity);
    const borderStyle = {
      bold: `2px solid ${borderRes}`,
      solid: `1px solid ${borderRes}`,
      dotted: `1px dotted ${borderRes}`,
    };
    styleObj.border = borderStyle[border.bgSelected];
  }
  if (padding) {
    let paddingObj = {
      paddingTop: `${padding.top / 100}rem`,
      paddingLeft: `${padding.left / 100}rem`,
      paddingRight: `${padding.right / 100}rem`,
      paddingBottom: `${padding.bottom / 100}rem`,
    };
    Object.assign(styleObj, paddingObj);
  }
  if (fontColor && fontColor.bgSelected) {
    styleObj.color = hexToRgba(fontColor.background, fontColor.opacity);
  }
  if (fontSize) {
    styleObj.fontSize = fontSize / 100 + 'rem';
  }
  if (fontStyle) {
    let pare = {
      bold: 'fontWeight',
      underline: 'textDecoration',
      italic: 'fontStyle',
    };
    for (const i of fontStyle) {
      styleObj[pare[i]] = i;
    }
  }
  if (textAlign) {
    styleObj.textAlign = textAlign;
  }
  return styleObj;
}

function toPx(val) {
  let devicePixelRatio = window.devicePixelRatio;
  let dpr = 1;
  if (devicePixelRatio >= 3) {
    dpr = 3;
  } else if (devicePixelRatio >= 2) {
    dpr = 2;
  }
  var ua = navigator.userAgent,
    isTablet = /(?:iPad|PlayBook)/.test(ua);
  if (isTablet) {
    dpr = parseInt(getComputedStyle(document.documentElement).fontSize) / 100;
  }
  // dpr = parseInt(getComputedStyle(document.documentElement).fontSize) / 100;
  return val * dpr;
}

function isAndroid() {
  var u = navigator.userAgent;
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  return isAndroid ? true : false;
}

export { hexToRgba, rgbToHex, retStyleObj, toPx,isAndroid };
