import { useEffect, useState } from "react";

function PrivateFiles() {

  const [files, setFiles] = useState([]);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const token =
    localStorage.getItem("token");

  const loadFiles = async () => {

    try {

      const response = await fetch(
        "http://localhost:5000/api/files/private",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        setFiles(data.files || []);
      }

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  // ==========================================
  // UPLOAD
  // ==========================================
  const handleUpload = async (event) => {

    const file =
      event.target.files[0];

    if (!file) return;

    setUploading(true);
    setMessage("");

    try {

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const response =
        await fetch(
          "http://localhost:5000/api/files/private",
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`
            },

            body: formData
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Upload failed"
        );
      }

      setMessage(
        "File uploaded successfully."
      );

      event.target.value = "";

      loadFiles();

    } catch (error) {

      setMessage(
        error.message
      );

    } finally {

      setUploading(false);

    }
  };

  // ==========================================
  // OPEN FILE
  // ==========================================
  const openFile = async (file) => {

    try {

      const response =
        await fetch(
          `http://localhost:5000/api/files/${file._id}/open`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      if (!response.ok) {

        const data =
          await response.json();

        throw new Error(
          data.message ||
          "Unable to open file"
        );
      }

      const blob =
        await response.blob();

      const url =
        URL.createObjectURL(blob);

      window.open(
        url,
        "_blank"
      );

    } catch (error) {

      alert(
        error.message
      );

    }
  };

  // ==========================================
  // DELETE FILE
  // ==========================================
  const deleteFile = async (id) => {

    const confirmed =
      window.confirm(
        "Delete this file?"
      );

    if (!confirmed) return;

    try {

      const response =
        await fetch(
          `http://localhost:5000/api/files/${id}`,
          {
            method: "DELETE",

            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Delete failed"
        );
      }

      loadFiles();

    } catch (error) {

      alert(
        error.message
      );

    }
  };

  return (

    <div className="page-container">

      <div className="page-header">

        <div>

          <h1>
            My Private Files
          </h1>

          <p>
            Upload and access your personal files.
          </p>

        </div>

        <label className="btn btn-primary">

          {uploading
            ? "Uploading..."
            : "+ Upload File"}

          <input
            type="file"
            hidden
            onChange={handleUpload}
            disabled={uploading}
          />

        </label>

      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {loading ? (

        <div className="empty-state">
          Loading files...
        </div>

      ) : files.length === 0 ? (

        <div className="empty-state">

          <div className="empty-icon">
            📁
          </div>

          <h3>
            No files yet
          </h3>

          <p>
            Upload your first private file.
          </p>

        </div>

      ) : (

        <div className="file-grid">

          {files.map((file) => (

            <div
              className="file-card"
              key={file._id}
            >

              <div className="file-icon">
                📄
              </div>

              <div className="file-info">

                <h3>
                  {file.originalName}
                </h3>

              </div>

              <div className="file-actions">

                <button
                  className="btn btn-primary"
                  onClick={() =>
                    openFile(file)
                  }
                >
                  Open / Read
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() =>
                    deleteFile(file._id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>

  );
}

export default PrivateFiles;