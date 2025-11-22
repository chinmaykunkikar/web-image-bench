import { get, set, keys, clear } from "idb-keyval";

export function idbAvailable() {
  return typeof indexedDB !== "undefined";
}

export async function idbPut(key, value) {
  if (!idbAvailable()) {
    throw new Error("IndexedDB not available");
  }
  try {
    await set(key, value);
    return true;
  } catch (e) {
    console.error("idbPut failed:", e);
    throw e;
  }
}

export async function idbGet(key) {
  if (!idbAvailable()) {
    throw new Error("IndexedDB not available");
  }
  try {
    return await get(key);
  } catch (e) {
    console.error("idbGet failed:", e);
    throw e;
  }
}

export async function idbKeys() {
  if (!idbAvailable()) {
    throw new Error("IndexedDB not available");
  }
  try {
    return await keys();
  } catch (e) {
    console.error("idbKeys failed:", e);
    throw e;
  }
}

export async function idbClear() {
  if (!idbAvailable()) {
    throw new Error("IndexedDB not available");
  }
  try {
    await clear();
    return true;
  } catch (e) {
    console.error("idbClear failed:", e);
    throw e;
  }
}

export async function getCacheInfo() {
  if (!idbAvailable()) {
    return { available: false, count: 0, totalSize: 0 };
  }

  try {
    const allKeys = await idbKeys();
    let totalSize = 0;

    for (const k of allKeys) {
      const blob = await idbGet(k);
      if (blob && blob.size) {
        totalSize += blob.size;
      }
    }

    return {
      available: true,
      count: allKeys.length,
      totalSize,
    };
  } catch (e) {
    console.error("getCacheInfo failed:", e);
    return { available: false, count: 0, totalSize: 0 };
  }
}
