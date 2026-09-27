import { useEffect, useMemo, useRef, useState } from "react";
import "./PrivateFiles.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const PrivateFiles = () => {
  const fileInputRef = useRef(null);

  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getToken = () => {
    return localStorage.getItem("token");
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Your login session has expired. Please login again."
        );
      }

      const response = await fetch(`${API_URL}/files/private`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load your files."
        );
      }

      setFiles(data.files || []);
    } catch (err) {
      console.error("Load private files error:", err);

      setError(
        err.message || "Unable to load your files."
      );
    } finally {
      setLoading(false);
    }
  };

  const getExtension = (filename = "") => {
    const parts = filename.split(".");

    if (parts.length <= 1) {
      return "FILE";
    }

    return parts[parts.length - 1].toUpperCase();
  };

  const getCategory = (filename = "") => {
    const extension =
      getExtension(filename).toLowerCase();

    if (
      [
        "jpg",
        "jpeg",
        "png",
        "gif",
        "webp",
        "svg",
        "bmp"
      ].includes(extension)
    ) {
      return "image";
    }

    if (extension === "pdf") {
      return "pdf";
    }

    if (
      ["doc", "docx"].includes(extension)
    ) {
      return "document";
    }

    if (
      ["xls", "xlsx", "csv"].includes(extension)
    ) {
      return "spreadsheet";
    }

    if (
      ["ppt", "pptx"].includes(extension)
    ) {
      return "presentation";
    }

    if (
      ["zip", "rar", "7z"].includes(extension)
    ) {
      return "archive";
    }

    if (
      ["txt", "md"].includes(extension)
    ) {
      return "text";
    }

    return "other";
  };

  const getFileIcon = (category) => {
    const icons = {
      pdf: "PDF",
      document: "DOC",
      spreadsheet: "XLS",
      presentation: "PPT",
      image: "IMG",
      archive: "ZIP",
      text: "TXT",
      other: "FILE"
    };

    return icons[category] || "FILE";
  };

  const getFileClass = (category) => {
    const classes = {
      pdf: "my-files-icon-pdf",
      document: "my-files-icon-document",
      spreadsheet: "my-files-icon-spreadsheet",
      presentation: "my-files-icon-presentation",
      image: "my-files-icon-image",
      archive: "my-files-icon-archive",
      text: "my-files-icon-text",
      other: "my-files-icon-other"
    };

    return (
      classes[category] ||
      "my-files-icon-other"
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "Recently added";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );
  };

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  };

  const formatSize = (bytes = 0) => {
    if (!bytes) {
      return "0 KB";
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(
        bytes / 1024
      ).toFixed(1)} KB`;
    }

    if (bytes < 1024 * 1024 * 1024) {
      return `${(
        bytes /
        (1024 * 1024)
      ).toFixed(1)} MB`;
    }

    return `${(
      bytes /
      (1024 * 1024 * 1024)
    ).toFixed(1)} GB`;
  };

  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const filename =
        file.originalName || "";

      const category =
        getCategory(filename);

      const matchesSearch =
        filename
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesFilter =
        filter === "all" ||
        category === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [
    files,
    search,
    filter
  ]);

  const totalSize = files.reduce(
    (total, file) =>
      total + (file.size || 0),
    0
  );

  const categoryCounts = {
    pdf: files.filter(
      (file) =>
        getCategory(
          file.originalName
        ) === "pdf"
    ).length,

    document: files.filter(
      (file) =>
        getCategory(
          file.originalName
        ) === "document"
    ).length,

    image: files.filter(
      (file) =>
        getCategory(
          file.originalName
        ) === "image"
    ).length,

    spreadsheet: files.filter(
      (file) =>
        getCategory(
          file.originalName
        ) === "spreadsheet"
    ).length
  };

  const handleUpload = async (file) => {
    if (!file) {
      return;
    }

    if (uploading) {
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(
        "File size must be 10 MB or smaller."
      );
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "Your login session has expired. Please login again."
      );
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          `${API_URL}/files/private`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`
            },
            body: formData
          }
        );

      let data = {};

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(
            "Your login session has expired. Please login again."
          );
        }

        throw new Error(
          data.message ||
            "File upload failed."
        );
      }

      setSuccess(
        "Your file has been uploaded successfully."
      );

      await fetchFiles();

      setTimeout(() => {
        setSuccess("");
      }, 3500);
    } catch (err) {
      console.error(
        "File upload error:",
        err
      );

      setError(
        err.message ||
          "Unable to upload your file."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (event) => {
    const file =
      event.target.files?.[0];

    if (file) {
      handleUpload(file);
    }

    event.target.value = "";
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setDragActive(false);

    if (uploading) {
      return;
    }

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      handleUpload(file);
    }
  };

  const handleOpen = async (file) => {
    const token = getToken();

    if (!token) {
      setError(
        "Your login session has expired. Please login again."
      );
      return;
    }

    /*
      Open a blank tab immediately.

      This prevents the browser from blocking
      the popup because the actual file request
      is asynchronous.
    */
    const newWindow =
      window.open(
        "",
        "_blank"
      );

    if (!newWindow) {
      setError(
        "Your browser blocked the file window. Please allow pop-ups for this site and try again."
      );
      return;
    }

    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Opening file...</title>
          <style>
            body {
              margin: 0;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: Arial, sans-serif;
              background: #f8fafc;
              color: #334155;
            }
            .box {
              text-align: center;
              padding: 30px;
            }
            .spinner {
              width: 40px;
              height: 40px;
              border: 4px solid #e2e8f0;
              border-top-color: #6366f1;
              border-radius: 50%;
              animation: spin 0.8s linear infinite;
              margin: 0 auto 18px;
            }
            @keyframes spin {
              to {
                transform: rotate(360deg);
              }
            }
          </style>
        </head>
        <body>
          <div class="box">
            <div class="spinner"></div>
            <h3>Opening your file...</h3>
            <p>Please wait.</p>
          </div>
        </body>
      </html>
    `);

    try {
      setError("");

      const response =
        await fetch(
          `${API_URL}/files/${file._id}/open`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

      if (!response.ok) {
        let message =
          "Unable to open file.";

        try {
          const data =
            await response.json();

          message =
            data.message ||
            message;
        } catch {
          // Ignore parsing errors.
        }

        throw new Error(message);
      }

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      newWindow.location.href =
        url;

      setTimeout(() => {
        window.URL.revokeObjectURL(
          url
        );
      }, 60000);
    } catch (err) {
      console.error(
        "Open file error:",
        err
      );

      newWindow.close();

      setError(
        err.message ||
          "Unable to open file."
      );
    }
  };

  const handleDelete = async (file) => {
    const confirmed =
      window.confirm(
        `Delete "${file.originalName}"?`
      );

    if (!confirmed) {
      return;
    }

    const token = getToken();

    if (!token) {
      setError(
        "Your login session has expired. Please login again."
      );
      return;
    }

    try {
      setDeletingId(file._id);
      setError("");
      setSuccess("");

      const response =
        await fetch(
          `${API_URL}/files/${file._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

      let data = {};

      try {
        data =
          await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete file."
        );
      }

      setFiles(
        (previous) =>
          previous.filter(
            (item) =>
              item._id !==
              file._id
          )
      );

      setSelectedFile(null);

      setSuccess(
        "File deleted successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "Delete file error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete file."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="my-files-page">

      <section className="my-files-header">
        <div className="my-files-heading">

          <div className="my-files-breadcrumb">
            <span>StudentHub</span>
            <span>/</span>
            <strong>My Files</strong>
          </div>

          <div className="my-files-title-row">
            <div>
              <h1>My Files</h1>

              <p>
                Your personal space for storing and
                accessing important student resources.
              </p>
            </div>

            <button
              type="button"
              className="my-files-upload-main-button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              disabled={uploading}
            >
              <span className="my-files-upload-main-icon">
                +
              </span>

              {uploading
                ? "Uploading..."
                : "Upload File"}
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileInput}
        />
      </section>

      {error && (
        <div className="my-files-alert my-files-alert-error">
          <div className="my-files-alert-icon">
            !
          </div>

          <div className="my-files-alert-content">
            <strong>
              Something went wrong
            </strong>

            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="my-files-alert my-files-alert-success">
          <div className="my-files-alert-icon">
            ✓
          </div>

          <div className="my-files-alert-content">
            <strong>Success</strong>
            <p>{success}</p>
          </div>

          <button
            type="button"
            onClick={() =>
              setSuccess("")
            }
          >
            ×
          </button>
        </div>
      )}

      <section className="my-files-stat-grid">

        <div className="my-files-stat-card">
          <div className="my-files-stat-icon purple">
            <span>▣</span>
          </div>

          <div className="my-files-stat-content">
            <span>Total files</span>
            <strong>
              {files.length}
            </strong>
            <small>
              Your personal resources
            </small>
          </div>
        </div>

        <div className="my-files-stat-card">
          <div className="my-files-stat-icon blue">
            <span>◈</span>
          </div>

          <div className="my-files-stat-content">
            <span>Storage used</span>
            <strong>
              {formatSize(totalSize)}
            </strong>
            <small>
              Uploaded by you
            </small>
          </div>
        </div>

        <div className="my-files-stat-card">
          <div className="my-files-stat-icon red">
            <span>PDF</span>
          </div>

          <div className="my-files-stat-content">
            <span>PDF files</span>
            <strong>
              {categoryCounts.pdf}
            </strong>
            <small>
              Notes & documents
            </small>
          </div>
        </div>

        <div className="my-files-stat-card">
          <div className="my-files-stat-icon green">
            <span>DOC</span>
          </div>

          <div className="my-files-stat-content">
            <span>Documents</span>
            <strong>
              {categoryCounts.document}
            </strong>
            <small>
              Study materials
            </small>
          </div>
        </div>

      </section>

      <section
        className={`my-files-upload-zone ${
          dragActive
            ? "my-files-upload-zone-active"
            : ""
        }`}
        onDragOver={(event) => {
          event.preventDefault();

          if (!uploading) {
            setDragActive(true);
          }
        }}
        onDragLeave={() => {
          setDragActive(false);
        }}
        onDrop={handleDrop}
        onClick={() => {
          if (!uploading) {
            fileInputRef.current?.click();
          }
        }}
      >
        <div className="my-files-upload-visual">
          <div className="my-files-upload-cloud">
            ↑
          </div>

          <div className="my-files-upload-ring"></div>
        </div>

        <div className="my-files-upload-content">
          <div className="my-files-upload-status">
            <span></span>
            PERSONAL FILE STORAGE
          </div>

          <h2>
            {uploading
              ? "Uploading your file..."
              : "Drop your file here"}
          </h2>

          <p>
            Drag and drop your file here, or
            browse your computer to upload.
          </p>

          <div className="my-files-upload-details">
            <span>Maximum 10 MB</span>
            <span>•</span>
            <span>Private storage</span>
          </div>
        </div>

        <button
          type="button"
          className="my-files-browse-button"
          onClick={(event) => {
            event.stopPropagation();

            if (!uploading) {
              fileInputRef.current?.click();
            }
          }}
          disabled={uploading}
        >
          Browse Files
          <span>→</span>
        </button>
      </section>

      <section className="my-files-workspace">

        <div className="my-files-workspace-header">

          <div>
            <span className="my-files-section-label">
              PERSONAL LIBRARY
            </span>

            <h2>Your personal files</h2>

            <p>
              Files uploaded by you are visible only
              to you.
            </p>
          </div>

          <div className="my-files-private-badge">
            <span>●</span>
            Private workspace
          </div>

        </div>

        <div className="my-files-toolbar">

          <div className="my-files-search">
            <span className="my-files-search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search your files..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

            {search && (
              <button
                type="button"
                onClick={clearSearch}
              >
                ×
              </button>
            )}
          </div>

          <div className="my-files-filters">

            {[
              ["all", "All"],
              ["pdf", "PDF"],
              ["document", "Documents"],
              ["image", "Images"],
              ["spreadsheet", "Sheets"]
            ].map(
              ([value, label]) => (
                <button
                  type="button"
                  key={value}
                  className={
                    filter === value
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setFilter(value)
                  }
                >
                  {label}
                </button>
              )
            )}

          </div>

        </div>

        {loading ? (
          <div className="my-files-loading">

            <div className="my-files-loading-card">
              <div className="my-files-loader"></div>

              <h3>
                Loading your files
              </h3>

              <p>
                Preparing your personal
                resource library...
              </p>
            </div>

            <div className="my-files-skeleton-grid">
              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    className="my-files-skeleton-card"
                    key={item}
                  >
                    <div className="my-files-skeleton-icon"></div>
                    <div className="my-files-skeleton-title"></div>
                    <div className="my-files-skeleton-line"></div>
                    <div className="my-files-skeleton-button"></div>
                  </div>
                )
              )}
            </div>

          </div>
        ) : filteredFiles.length === 0 ? (

          <div className="my-files-empty">

            <div className="my-files-empty-illustration">
              <div className="my-files-empty-folder">
                <span>+</span>
              </div>
            </div>

            <span className="my-files-empty-label">
              {search ||
              filter !== "all"
                ? "NO MATCHING FILES"
                : "YOUR LIBRARY IS EMPTY"}
            </span>

            <h3>
              {search ||
              filter !== "all"
                ? "No files found"
                : "Start building your resource library"}
            </h3>

            <p>
              {search ||
              filter !== "all"
                ? "Try changing your search or selecting another category."
                : "Upload notes, documents, assignments and other personal resources here."}
            </p>

            {!search &&
              filter === "all" && (
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  Upload Your First File
                  <span>→</span>
                </button>
              )}

          </div>

        ) : (

          <div className="my-files-grid">

            {filteredFiles.map(
              (file) => {
                const category =
                  getCategory(
                    file.originalName
                  );

                const extension =
                  getExtension(
                    file.originalName
                  );

                const isMenuOpen =
                  selectedFile?._id ===
                  file._id;

                const isDeleting =
                  deletingId ===
                  file._id;

                return (
                  <article
                    className="my-files-card"
                    key={file._id}
                  >

                    <div className="my-files-card-top">

                      <div
                        className={`my-files-file-icon ${getFileClass(
                          category
                        )}`}
                      >
                        <span>
                          {getFileIcon(
                            category
                          )}
                        </span>
                      </div>

                      <div className="my-files-card-menu-wrapper">

                        <button
                          type="button"
                          className="my-files-menu-button"
                          onClick={() =>
                            setSelectedFile(
                              isMenuOpen
                                ? null
                                : file
                            )
                          }
                          aria-label="File options"
                        >
                          ⋮
                        </button>

                        {isMenuOpen && (
                          <div className="my-files-menu">

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedFile(
                                  null
                                );

                                handleOpen(
                                  file
                                );
                              }}
                            >
                              <span>↗</span>
                              Open file
                            </button>

                            <button
                              type="button"
                              className="danger"
                              disabled={
                                isDeleting
                              }
                              onClick={() =>
                                handleDelete(
                                  file
                                )
                              }
                            >
                              <span>⌫</span>

                              {isDeleting
                                ? "Deleting..."
                                : "Delete file"}
                            </button>

                          </div>
                        )}

                      </div>

                    </div>

                    <div className="my-files-card-body">

                      <div className="my-files-card-type">
                        {extension}
                        <span>•</span>
                        Personal
                      </div>

                      <h3
                        title={
                          file.originalName
                        }
                      >
                        {file.originalName}
                      </h3>

                      <p>
                        Added{" "}
                        {formatDate(
                          file.createdAt
                        )}
                      </p>

                      <div className="my-files-card-size">
                        <span>
                          {formatSize(
                            file.size
                          )}
                        </span>

                        <span>•</span>

                        <span>
                          {formatTime(
                            file.createdAt
                          )}
                        </span>
                      </div>

                    </div>

                    <div className="my-files-card-footer">

                      <div className="my-files-private-status">
                        <span>🔒</span>
                        Private
                      </div>

                      <button
                        type="button"
                        className="my-files-open-button"
                        onClick={() =>
                          handleOpen(
                            file
                          )
                        }
                      >
                        Open
                        <span>→</span>
                      </button>

                    </div>

                  </article>
                );
              }
            )}

          </div>
        )}

      </section>

      <section className="my-files-security">

        <div className="my-files-security-icon">
          🔐
        </div>

        <div className="my-files-security-content">
          <strong>
            Your personal files stay private
          </strong>

          <p>
            Files uploaded to My Files are
            protected and are accessible only
            from your account.
          </p>
        </div>

        <div className="my-files-security-status">
          <span></span>
          Protected
        </div>

      </section>

    </div>
  );
};

export default PrivateFiles;