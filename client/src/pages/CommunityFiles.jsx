import React, { useEffect, useMemo, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function CommunityFiles() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/files/community`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load files");
      }

      setFiles(data.files || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    const token = localStorage.getItem("token");

    setUploading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(`${API_URL}/files/community`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setSuccess("File shared with the community successfully.");
      setSelectedFile(null);

      document.getElementById("community-file-input").value = "";

      await loadFiles();
    } catch (error) {
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const openFile = async (fileId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/files/${fileId}/open`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Unable to open file");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");

      setTimeout(() => URL.revokeObjectURL(url), 30000);
    } catch (error) {
      setError(error.message);
    }
  };

  const filteredFiles = useMemo(() => {
    return files.filter((file) =>
      file.originalName
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [files, search]);

  const getFileIcon = (name = "") => {
    const extension = name.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
      return "🖼️";
    }

    if (["pdf"].includes(extension)) return "📕";

    if (["doc", "docx"].includes(extension)) return "📘";

    if (["xls", "xlsx", "csv"].includes(extension)) return "📗";

    if (["ppt", "pptx"].includes(extension)) return "📙";

    if (["zip", "rar"].includes(extension)) return "🗜️";

    return "📄";
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="files-page">
      <div className="files-hero community-hero">
        <div>
          <div className="hero-mini-badge">
            🌐 Community workspace
          </div>

          <h2>Shared resources</h2>

          <p>
            Discover useful documents and resources shared by
            StudentHub members.
          </p>
        </div>

        <div className="hero-stat">
          <strong>{files.length}</strong>
          <span>Shared files</span>
        </div>
      </div>

      {error && (
        <div className="page-alert error">
          <span>!</span>
          {error}
        </div>
      )}

      {success && (
        <div className="page-alert success">
          <span>✓</span>
          {success}
        </div>
      )}

      <div className="community-upload-card">
        <div className="upload-icon-large">↥</div>

        <div className="upload-content">
          <h3>Share a resource</h3>
          <p>
            Upload a file that could be useful to other community
            members.
          </p>

          <label
            className="file-picker"
            htmlFor="community-file-input"
          >
            <span>Choose file</span>

            <input
              id="community-file-input"
              type="file"
              onChange={(event) =>
                setSelectedFile(event.target.files?.[0] || null)
              }
            />
          </label>

          {selectedFile && (
            <div className="selected-upload">
              <span>📄</span>
              <strong>{selectedFile.name}</strong>

              <button
                type="button"
                onClick={uploadFile}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Share file"}
              </button>
            </div>
          )}
        </div>

        <div className="upload-note">
          <span>🔒</span>
          <p>
            Files are available to authenticated community
            members.
          </p>
        </div>
      </div>

      <div className="files-toolbar">
        <div>
          <span className="eyebrow">COMMUNITY LIBRARY</span>
          <h3>Shared files</h3>
        </div>

        <div className="file-search">
          <span>⌕</span>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search files..."
          />
        </div>
      </div>

      {loading ? (
        <div className="file-grid">
          {[1, 2, 3, 4].map((item) => (
            <div className="file-card skeleton-card" key={item}>
              <div className="skeleton square" />
              <div className="skeleton text" />
              <div className="skeleton small" />
            </div>
          ))}
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="empty-files">
          <div className="empty-files-icon">🌐</div>
          <h3>No shared files</h3>
          <p>
            {search
              ? "No files match your search."
              : "The community has not shared any files yet."}
          </p>
        </div>
      ) : (
        <div className="file-grid">
          {filteredFiles.map((file) => (
            <article className="file-card" key={file._id}>
              <div className="file-card-top">
                <div className="file-type-icon">
                  {getFileIcon(file.originalName)}
                </div>

                <span className="community-label">
                  Community
                </span>
              </div>

              <div className="file-card-content">
                <h4 title={file.originalName}>
                  {file.originalName}
                </h4>

                <p>
                  Shared by{" "}
                  <strong>
                    {file.owner?.name || "Community member"}
                  </strong>
                </p>

                <span className="file-date">
                  {formatDate(file.createdAt)}
                </span>
              </div>

              <button
                className="file-open-button"
                onClick={() => openFile(file._id)}
              >
                Open file
                <span>→</span>
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default CommunityFiles;