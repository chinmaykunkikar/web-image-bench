import { humanBytes } from "../utils/imageUtils";
import "./CacheBar.css";

export default function CacheBar({
  visible,
  onClearCache,
  onShowCache,
  cacheInfo,
}) {
  if (!visible) return null;

  return (
    <div className="cache-bar">
      <button className="ghost" onClick={onClearCache}>
        Clear cache
      </button>
      <button className="ghost" onClick={onShowCache}>
        Show cache
      </button>
      <div className="cache-info">
        {cacheInfo.available ? (
          <>
            Cache: {cacheInfo.count} entries — {humanBytes(cacheInfo.totalSize)}
          </>
        ) : (
          <>Cache: unavailable</>
        )}
      </div>
    </div>
  );
}
