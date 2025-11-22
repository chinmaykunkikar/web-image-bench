import { humanBytes } from "../utils/imageUtils";
import "./FileCard.css";

export default function FileCard({ file, objectUrl, stats }) {
  return (
    <div className="file-card">
      {/* Sidebar */}
      <div className="card-sidebar">
        <div className="thumb">
          <img src={objectUrl} alt="preview" />
        </div>
        <div className="file-info">
          <div className="name" title={file.name}>
            {file.name}
          </div>
          <div className="size">{humanBytes(file.size)}</div>
        </div>
      </div>

      {/* Content Area */}
      <div className="card-content">
        {!stats ? (
          <div className="empty-state">
            <span>Ready to benchmark</span>
          </div>
        ) : (
          <>
            <div className="comparison-table">
              <div className="row header">
                <div className="cell metric">Metric</div>
                <div className="cell base64">Inline (Base64)</div>
                <div className="cell external">External (File)</div>
              </div>

              <div className="row">
                <div className="cell metric">Payload Size</div>
                <div className="cell base64 bad">
                  {stats.base64Size ? humanBytes(stats.base64Size) : "—"}
                  {stats.inflation !== null && (
                    <span className="sub">+{stats.inflation}%</span>
                  )}
                </div>
                <div className="cell external good">
                  {humanBytes(stats.originalSize)}
                </div>
              </div>

              <div className="row highlight-row">
                <div className="cell metric">Data Transferred</div>
                <div className="cell base64 bad">
                  {stats.base64Size ? humanBytes(stats.base64Size) : "—"}
                  {stats.cached && <span className="sub">Redownloaded</span>}
                </div>
                <div className={`cell external ${stats.cached ? "good" : ""}`}>
                  {stats.cached ? "0 B" : humanBytes(stats.originalSize)}
                  {stats.cached && <span className="sub">Cached</span>}
                </div>
              </div>

              <div className="row">
                <div className="cell metric">Decode Time</div>
                <div className="cell base64">
                  {stats.totalTime ? Math.round(stats.totalTime) : "—"} ms
                </div>
                <div className="cell external">
                  {stats.decodeTime ?? "—"} ms
                </div>
              </div>
            </div>

            {/*
            {stats.recommendation && (
              <div className="recommendation-wrapper">
                <span className="stat-label">Recommendation</span>
                <div className={`recommend rec-${stats.recommendation.type}`}>
                  {stats.recommendation.text}
                </div>
              </div>
            )}
            */}
          </>
        )}
      </div>
    </div>
  );
}
