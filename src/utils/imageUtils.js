export function humanBytes(n) {
  if (n === null || n === undefined) return "—";
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
  return (n / 1024 / 1024).toFixed(2) + " MB";
}

export function estimateBase64Size(dataUrl) {
  const idx = dataUrl.indexOf(",");
  if (idx < 0) return null;
  const payload = dataUrl.substring(idx + 1);
  const len = payload.length;
  const padding = payload.endsWith("==") ? 2 : payload.endsWith("=") ? 1 : 0;
  const bytes = Math.ceil((len * 3) / 4) - padding;
  return bytes;
}

export function loadImageDetached(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const start = performance.now();
    img.onload = () => {
      const elapsed = Math.round(performance.now() - start);
      img.onload = img.onerror = null;
      resolve(elapsed);
    };
    img.onerror = () => {
      img.onload = img.onerror = null;
      reject(new Error("load error"));
    };
    img.src = src;
  });
}

export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}
