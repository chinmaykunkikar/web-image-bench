import { loadImageDetached, readFileAsDataURL } from "./imageUtils";

export async function runTestForFile(file, objectUrl) {
  let extDecode = null;

  try {
    extDecode = await loadImageDetached(objectUrl);
  } catch {
    try {
      const fallbackUrl = await readFileAsDataURL(file);
      extDecode = await loadImageDetached(fallbackUrl);
    } catch (e2) {
      extDecode = null;
      console.warn("external decode failed", file.name, e2);
    }
  }

  const readStart = performance.now();
  let dataUrl = null;
  let readTime = null;

  try {
    dataUrl = await readFileAsDataURL(file);
    readTime = Math.round(performance.now() - readStart);
  } catch {
    readTime = null;
  }

  let baseLoad = null;
  if (dataUrl) {
    try {
      baseLoad = await loadImageDetached(dataUrl);
    } catch {
      baseLoad = null;
    }
  }

  const baseBytes = dataUrl ? dataUrl.length : null;
  const extTotal = typeof extDecode === "number" ? extDecode : null;
  const baseTotal =
    (typeof readTime === "number" ? readTime : 0) +
    (typeof baseLoad === "number" ? baseLoad : 0);

  // Calculate inflation
  let inflation = null;
  if (baseBytes && file.size > 0) {
    inflation = (((baseBytes - file.size) / file.size) * 100).toFixed(1);
  }

  let recText = "";
  let recType = "bad";

  if (file.size <= 2 * 1024) {
    recText = "Inline OK — tiny asset";
    recType = "good";
  } else if (extTotal !== null && baseTotal && baseTotal + 10 < extTotal) {
    recText = "Inline faster (measured) — but cache tradeoffs apply";
    recType = "good";
  } else {
    recText = "Prefer external — smaller bundle & cacheable";
    recType = "bad";
  }

  return {
    originalSize: file.size,
    base64Size: baseBytes,
    inflation,
    readTime,
    decodeTime: extDecode,
    totalTime: baseTotal,
    recommendation: {
      text: recText,
      type: recType,
    },
  };
}
