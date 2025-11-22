import { useState, useEffect } from "react";
import Controls from "./components/Controls";
import FileCard from "./components/FileCard";
import Modal from "./components/Modal";
import { getCacheInfo, idbClear, idbGet, idbPut } from "./utils/idbHelper";
import { runTestForFile } from "./utils/testRunner";
import "./App.css";

function App() {
  const [files, setFiles] = useState([]);
  const [objectUrls, setObjectUrls] = useState(new Map());

  const updateCacheInfo = async () => {
    await getCacheInfo();
  };

  useEffect(() => {
    return () => {
      objectUrls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (e) {
          console.warn("Failed to revoke URL:", e);
        }
      });
    };
  }, [objectUrls]);

  const handleFileChange = (e) => {
    objectUrls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        console.warn("Failed to revoke URL:", e);
      }
    });

    const newFiles = Array.from(e.target.files || []);
    const newUrls = new Map();

    newFiles.forEach((file, idx) => {
      try {
        const url = URL.createObjectURL(file);
        newUrls.set(idx, url);
      } catch (e) {
        console.error("Failed to create object URL:", e);
      }
    });

    setFiles(newFiles);
    setObjectUrls(newUrls);
  };

  const [fileStats, setFileStats] = useState(new Map());
  const [statusMessage, setStatusMessage] = useState("");

  const runTest = async (index) => {
    const file = files[index];
    const objectUrl = objectUrls.get(index);

    try {
      // Check cache first
      const cachedBlob = await idbGet("img-" + index);
      let result;

      if (cachedBlob) {
        // Simulate loading from cache
        const obj = URL.createObjectURL(cachedBlob);
        const decode = await new Promise((resolve, reject) => {
          const img = new Image();
          const start = performance.now();
          img.onload = () => {
            const elapsed = Math.round(performance.now() - start);
            resolve(elapsed);
          };
          img.onerror = reject;
          img.src = obj;
        });

        // Base64 test still runs on original file for comparison
        const baseResult = await runTestForFile(file, objectUrl);

        result = {
          ...baseResult,
          decodeTime: decode,
          cached: true,
        };

        setTimeout(() => URL.revokeObjectURL(obj), 30000);
      } else {
        // Normal run (Network)
        result = await runTestForFile(file, objectUrl);
        result.cached = false;
      }

      setFileStats((prev) => {
        const newStats = new Map(prev);
        newStats.set(index, result);
        return newStats;
      });
    } catch (e) {
      console.error("Test failed for file", index, e);
    }
  };

  const handleReset = () => {
    objectUrls.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // Ignore revoke errors
      }
    });

    setFiles([]);
    setObjectUrls(new Map());
    setFileStats(new Map());

    const fileInput = document.getElementById("files");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleColdRun = async () => {
    setStatusMessage("Running Cold Load... (Cache Cleared)");

    // 1. Clear Cache
    try {
      await idbClear();
      await updateCacheInfo();
    } catch (error) {
      console.error("Clear cache failed:", error);
    }

    // 2. Run Tests (Network)
    for (let i = 0; i < files.length; i++) {
      await runTest(i);
    }

    setStatusMessage("Cold Load Complete ✓");
  };

  const handleWarmRun = async () => {
    setStatusMessage("Running Warm Load... (Serving from Disk Cache)");

    // 1. Warm Cache
    for (let i = 0; i < files.length; i++) {
      try {
        await idbPut("img-" + i, files[i]);
      } catch (error) {
        console.error("Cache failed for file", i, error);
      }
    }
    await updateCacheInfo();

    // 2. Run Tests (Disk Cache)
    for (let i = 0; i < files.length; i++) {
      await runTest(i);
    }

    setStatusMessage("Warm Load Complete ✓");
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleShowMessage = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const handleUpdateStats = (index, newStats) => {
    setFileStats((prev) => {
      const next = new Map(prev);
      next.set(index, newStats);
      return next;
    });
  };

  return (
    <div className="page-container">
      <h1>Web Image Bench - Base64 vs External</h1>
      <p className="lead">
        Select images to compare Base64-encoded vs external file performance.
        See how file sizes, bandwidth usage, and browser caching differ between
        the two formats.
      </p>

      <Controls
        onFileChange={handleFileChange}
        onReset={handleReset}
        onColdRun={handleColdRun}
        onWarmRun={handleWarmRun}
        filesCount={files.length}
        statusMessage={statusMessage}
      />

      {files.length > 0 && (
        <div className="file-list">
          {files.map((file, idx) => (
            <FileCard
              key={idx}
              file={file}
              index={idx}
              objectUrl={objectUrls.get(idx)}
              stats={fileStats.get(idx)}
              onRun={() => runTest(idx)}
              showMessage={handleShowMessage}
              onUpdateStats={(stats) => handleUpdateStats(idx, stats)}
            />
          ))}
        </div>
      )}

      <div className="implementation-notes">
        <h3>How This Works</h3>

        <div className="note-section">
          <h4>📦 What We're Testing</h4>
          <p>This tool compares two ways of including images in web pages:</p>
          <ul>
            <li>
              <strong>Base64 Inline:</strong> Your image is converted to a text
              string and embedded directly in your HTML/CSS/JS code
            </li>
            <li>
              <strong>External File:</strong> Your image remains a separate file
              that the browser downloads when needed
            </li>
          </ul>
        </div>

        <div className="note-section">
          <h4>🔄 How Caching Works</h4>
          <p>
            When you revisit a website, browsers cache (store) external files to
            avoid re-downloading them. Here's what happens:
          </p>
          <ul>
            <li>
              <strong>Cold Load (First Visit):</strong> Browser downloads
              everything for the first time. Both Base64 and external images
              need to be loaded.
            </li>
            <li>
              <strong>Warm Load (Return Visit):</strong> Browser uses cached
              files. External images load from cache (0 bytes transferred), but
              Base64 images must be re-downloaded because they're part of your
              code bundle.
            </li>
          </ul>
        </div>

        <div className="note-section">
          <h4>🧪 What We're Simulating</h4>
          <p>
            This app runs entirely in your browser using IndexedDB (local
            storage):
          </p>
          <ul>
            <li>
              <strong>"Test Without Cache"</strong> clears the cache and
              measures first-time load performance
            </li>
            <li>
              <strong>"Test With Cache"</strong> stores images in IndexedDB and
              measures repeat-visit performance
            </li>
            <li>
              Base64 encoding happens in JavaScript to show the size overhead
              (+33% due to encoding)
            </li>
          </ul>
        </div>

        <div className="note-section">
          <h4>💡 The Takeaway</h4>
          <p>
            Base64 encoding is convenient for tiny icons or critical images, but
            for most images, external files are better because:
          </p>
          <ul>
            <li>
              They cache independently, reducing bandwidth on repeat visits
            </li>
            <li>They don't bloat your HTML/CSS/JS bundles</li>
            <li>Browsers can lazy-load them as needed</li>
          </ul>
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Cache Info"
      >
        {modalContent}
      </Modal>
    </div>
  );
}

export default App;
