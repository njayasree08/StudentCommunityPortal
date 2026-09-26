import {
  useEffect,
  useState
} from "react";

function CommunityFiles() {

  const token =
    localStorage.getItem("token");

  const currentUser =
    JSON.parse(
      localStorage.getItem("user") ||
      "null"
    );

  const [files, setFiles] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [uploading, setUploading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const loadFiles = async () => {

    try {

      const response =
        await fetch(
          "http://localhost:5000/api/files/community",
          {
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
          data.message
        );
      }

      setFiles(
        data.files || []
      );

    } catch (error) {

      setMessage(
        error.message
      );

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

  const uploadFile =
    async (event) => {

      const file =
        event.target.files[0];

      if (!file) return;

      try {

        setUploading(true);
        setMessage("");

        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        const response =
          await fetch(
            "http://localhost:5000/api/files/community",
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
            data.message
          );
        }

        setMessage(
          "File shared successfully."
        );

        event.target.value = "";

        await loadFiles();

      } catch (error) {

        setMessage(
          error.message
        );

      } finally {

        setUploading(false);

      }
    };

  // ==========================================
  // OPEN
  // ==========================================

  const openFile =
    async (file) => {

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
            data.message
          );
        }

        const blob =
          await response.blob();

        const url =
          URL.createObjectURL(
            blob
          );

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
  // DELETE
  // ==========================================

  const deleteFile =
    async (id) => {

      if (
        !window.confirm(
          "Delete this community file?"
        )
      ) {
        return;
      }

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
            data.message
          );
        }

        await loadFiles();

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

          <p className="eyebrow">
            COMMUNITY
          </p>

          <h1>
            Community Files
          </h1>

          <p>
            Share and access useful resources.
          </p>

        </div>

        <label className="btn btn-primary">

          {uploading
            ? "Uploading..."
            : "+ Share File"}

          <input
            type="file"
            hidden
            onChange={
              uploadFile
            }
            disabled={
              uploading
            }
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
          Loading community files...
        </div>

      ) : files.length === 0 ? (

        <div className="empty-state">

          <div className="empty-icon">
            🌐
          </div>

          <h3>
            No community files
          </h3>

          <p>
            Be the first to share a useful resource.
          </p>

        </div>

      ) : (

        <div className="file-grid">

          {files.map(
            (file) => {

              const ownerId =
                file.owner?._id;

              const isOwner =
                ownerId ===
                currentUser?.id;

              const isAdmin =
                currentUser?.role ===
                "admin";

              return (

                <div
                  className="file-card"
                  key={
                    file._id
                  }
                >

                  <div className="file-icon">
                    📚
                  </div>

                  <div className="file-info">

                    <h3>
                      {file.originalName}
                    </h3>

                    <p>
                      Shared by{" "}
                      {file.owner?.name ||
                        "Community member"}
                    </p>

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

                    {(isOwner ||
                      isAdmin) && (

                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          deleteFile(
                            file._id
                          )
                        }
                      >
                        Delete
                      </button>

                    )}

                  </div>

                </div>

              );

            }
          )}

        </div>

      )}

    </div>
  );
}

export default CommunityFiles;