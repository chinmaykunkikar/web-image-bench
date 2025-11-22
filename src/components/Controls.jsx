import "./Controls.css";

export default function Controls({
  onFileChange,
  onReset,
  onColdRun,
  onWarmRun,
  filesCount,
  statusMessage,
}) {
  return (
    <div className="controls">
      <div className="controls-header">
        <input
          type="file"
          id="files"
          accept="image/*"
          multiple
          onChange={onFileChange}
        />
        <button className="small ghost" onClick={onReset}>
          Reset
        </button>
      </div>
      <div className="privacy-note">
        🔒 Nothing is uploaded. Your images stay on your device
      </div>

      {filesCount > 0 && (
        <>
          <div className="controls-actions">
            <button className="action-btn" onClick={onColdRun}>
              <span className="btn-label">Test Without Cache</span>
              <span className="btn-hint">Fresh load (clears cache)</span>
            </button>
            <button className="action-btn" onClick={onWarmRun}>
              <span className="btn-label">Test With Cache</span>
              <span className="btn-hint">Repeat visit (uses cache)</span>
            </button>
          </div>

          {statusMessage && (
            <div className="status-message">{statusMessage}</div>
          )}
        </>
      )}
    </div>
  );
}
