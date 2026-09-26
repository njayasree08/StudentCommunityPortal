import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function Messages() {
  const [searchParams] = useSearchParams();

  const token = localStorage.getItem("token");

  const storedUser =
    JSON.parse(
      localStorage.getItem("user") || "null"
    );

  const currentUserId =
    storedUser?.id ||
    storedUser?._id;

  // ==========================================
  // USERS
  // ==========================================

  const [users, setUsers] =
    useState([]);

  const [selectedUser, setSelectedUser] =
    useState(null);

  // ==========================================
  // CONVERSATION
  // ==========================================

  const [messages, setMessages] =
    useState([]);

  const [messageText, setMessageText] =
    useState("");

  const [loadingUsers, setLoadingUsers] =
    useState(true);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  // ==========================================
  // EDIT
  // ==========================================

  const [editingMessageId, setEditingMessageId] =
    useState(null);

  const [editingText, setEditingText] =
    useState("");

  // ==========================================
  // COMMUNITY BROADCAST
  // ==========================================

  const [broadcastMessage, setBroadcastMessage] =
    useState("");

  const [broadcastSending, setBroadcastSending] =
    useState(false);

  // ==========================================
  // LOAD USERS
  // ==========================================

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);

      const response = await fetch(
        `${API_URL}/users`,
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
          data.message ||
          "Unable to load users"
        );
      }

      const loadedUsers =
        data.users || [];

      setUsers(loadedUsers);

      // If URL contains ?user=ID
      const urlUserId =
        searchParams.get("user");

      if (urlUserId) {

        const urlUser =
          loadedUsers.find(
            (user) =>
              user._id === urlUserId
          );

        if (urlUser) {
          setSelectedUser(urlUser);
          return;
        }
      }

      // Otherwise select first user
      // including yourself
      if (
        loadedUsers.length > 0 &&
        !selectedUser
      ) {
        setSelectedUser(
          loadedUsers[0]
        );
      }

    } catch (error) {

      console.error(
        "Load users error:",
        error
      );

    } finally {

      setLoadingUsers(false);

    }
  };

  // ==========================================
  // LOAD CONVERSATION
  // ==========================================

  const loadConversation = async (
    userId
  ) => {

    if (!userId) return;

    try {

      setLoadingMessages(true);

      const response =
        await fetch(
          `${API_URL}/messages/${userId}`,
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
          data.message ||
          "Unable to load messages"
        );
      }

      setMessages(
        data.messages || []
      );

    } catch (error) {

      console.error(
        "Load conversation error:",
        error
      );

      setMessages([]);

    } finally {

      setLoadingMessages(false);

    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadUsers();
  }, []);

  // ==========================================
  // LOAD WHEN USER CHANGES
  // ==========================================

  useEffect(() => {

    if (selectedUser?._id) {
      loadConversation(
        selectedUser._id
      );
    }

  }, [selectedUser]);

  // ==========================================
  // SEND PRIVATE MESSAGE
  // ==========================================

  const sendMessage = async () => {

    if (!messageText.trim()) {
      return;
    }

    if (!selectedUser) {
      alert(
        "Please select a user."
      );
      return;
    }

    try {

      setSending(true);

      const response =
        await fetch(
          `${API_URL}/messages/send`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`
            },

            body: JSON.stringify({
              receiverId:
                selectedUser._id,

              message:
                messageText.trim()
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to send message"
        );
      }

      setMessageText("");

      await loadConversation(
        selectedUser._id
      );

    } catch (error) {

      alert(
        error.message
      );

    } finally {

      setSending(false);

    }
  };

  // ==========================================
  // ENTER TO SEND
  // ==========================================

  const handleMessageKeyDown = (
    event
  ) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();
    }
  };

  // ==========================================
  // START EDIT
  // ==========================================

  const startEditing = (
    message
  ) => {

    setEditingMessageId(
      message._id
    );

    setEditingText(
      message.message
    );
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const cancelEditing = () => {

    setEditingMessageId(null);

    setEditingText("");

  };

  // ==========================================
  // SAVE EDIT
  // ==========================================

  const saveEdit = async (
    messageId
  ) => {

    if (!editingText.trim()) {
      return;
    }

    try {

      const response =
        await fetch(
          `${API_URL}/messages/${messageId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`
            },

            body: JSON.stringify({
              message:
                editingText.trim()
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to edit message"
        );
      }

      cancelEditing();

      await loadConversation(
        selectedUser._id
      );

    } catch (error) {

      alert(
        error.message
      );

    }
  };

  // ==========================================
  // DELETE MESSAGE
  // ==========================================

  const deleteMessage = async (
    messageId
  ) => {

    const confirmed =
      window.confirm(
        "Delete this message?"
      );

    if (!confirmed) {
      return;
    }

    try {

      const response =
        await fetch(
          `${API_URL}/messages/${messageId}`,
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
          "Unable to delete message"
        );
      }

      await loadConversation(
        selectedUser._id
      );

    } catch (error) {

      alert(
        error.message
      );

    }
  };

  // ==========================================
  // SEND TO ALL COMMUNITY MEMBERS
  // ==========================================

  const sendToEveryone = async () => {

    if (!broadcastMessage.trim()) {
      return;
    }

    const confirmed =
      window.confirm(
        "Send this message to all community members?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setBroadcastSending(true);

      const response =
        await fetch(
          `${API_URL}/messages/broadcast`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`
            },

            body: JSON.stringify({
              message:
                broadcastMessage.trim()
            })
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to send community message"
        );
      }

      setBroadcastMessage("");

      alert(
        data.message ||
        "Message sent to all community members."
      );

    } catch (error) {

      alert(
        error.message
      );

    } finally {

      setBroadcastSending(false);

    }
  };

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (
    date
  ) => {

    if (!date) return "";

    return new Date(
      date
    ).toLocaleString(
      [],
      {
        dateStyle: "short",
        timeStyle: "short"
      }
    );
  };

  // ==========================================
  // LOADING USERS
  // ==========================================

  if (loadingUsers) {

    return (
      <div className="page-container">

        <div className="empty-state">

          <div className="empty-icon">
            💬
          </div>

          <h3>
            Loading messages...
          </h3>

        </div>

      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (

    <div className="page-container">

      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <div className="page-header">

        <div>

          <h1>
            Messages
          </h1>

          <p>
            Chat privately with community members.
          </p>

        </div>

      </div>


      {/* =====================================
          COMMUNITY BROADCAST
      ====================================== */}

      <div
        className="community-message-card"
        style={{
          marginBottom: "24px"
        }}
      >

        <div
          style={{
            marginBottom: "14px"
          }}
        >

          <h2
            style={{
              margin: 0
            }}
          >
            📢 Community Message
          </h2>

          <p
            style={{
              marginTop: "6px",
              marginBottom: 0,
              color: "#64748b"
            }}
          >
            Send one message to all community members.
          </p>

        </div>

        <textarea
          value={broadcastMessage}
          onChange={(event) =>
            setBroadcastMessage(
              event.target.value
            )
          }
          placeholder="Write a message for everyone..."
          rows="3"
          className="form-input"
          style={{
            width: "100%",
            resize: "vertical",
            marginBottom: "12px"
          }}
        />

        <button
          className="btn btn-primary"
          onClick={
            sendToEveryone
          }
          disabled={
            broadcastSending ||
            !broadcastMessage.trim()
          }
        >

          {broadcastSending
            ? "Sending..."
            : "Send to All Members"}

        </button>

      </div>


      {/* =====================================
          MESSAGING AREA
      ====================================== */}

      <div
        className="messages-layout"
        style={{
          display: "grid",
          gridTemplateColumns:
            "280px 1fr",
          gap: "20px",
          minHeight: "600px"
        }}
      >

        {/* ===================================
            USER LIST
        ==================================== */}

        <div className="card">

          <div
            style={{
              padding: "20px",
              borderBottom:
                "1px solid #e5e7eb"
            }}
          >

            <h2
              style={{
                margin: 0,
                fontSize: "18px"
              }}
            >
              Community
            </h2>

            <p
              style={{
                margin:
                  "5px 0 0",
                fontSize: "13px",
                color: "#64748b"
              }}
            >
              Select a member
            </p>

          </div>

          <div
            style={{
              maxHeight: "500px",
              overflowY: "auto"
            }}
          >

            {users.length === 0 ? (

              <div
                style={{
                  padding: "25px",
                  textAlign: "center",
                  color: "#64748b"
                }}
              >
                No members found.
              </div>

            ) : (

              users.map(
                (user) => {

                  const isSelected =
                    selectedUser?._id ===
                    user._id;

                  const isMe =
                    user._id ===
                    currentUserId;

                  return (

                    <button
                      key={user._id}
                      onClick={() =>
                        setSelectedUser(
                          user
                        )
                      }
                      style={{
                        width: "100%",
                        border: "none",
                        borderBottom:
                          "1px solid #f1f5f9",
                        background:
                          isSelected
                            ? "#eef2ff"
                            : "white",
                        padding: "14px 16px",
                        cursor: "pointer",
                        textAlign: "left"
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: "12px"
                        }}
                      >

                        <div
                          style={{
                            width: "42px",
                            height: "42px",
                            borderRadius:
                              "50%",
                            background:
                              "#e0e7ff",
                            color:
                              "#4338ca",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            fontWeight:
                              "700"
                          }}
                        >
                          {user.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <div>

                          <div
                            style={{
                              fontWeight:
                                "600",
                              color:
                                "#1e293b"
                            }}
                          >
                            {user.name}
                          </div>

                          <div
                            style={{
                              fontSize:
                                "12px",
                              color:
                                "#64748b",
                              marginTop:
                                "3px"
                            }}
                          >
                            {isMe
                              ? "You"
                              : user.role ===
                                "admin"
                              ? "Administrator"
                              : "Student"}
                          </div>

                        </div>

                      </div>

                    </button>

                  );

                }
              )

            )}

          </div>

        </div>


        {/* ===================================
            CHAT WINDOW
        ==================================== */}

        <div
          className="card"
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: 0
          }}
        >

          {!selectedUser ? (

            <div className="empty-state">

              <div className="empty-icon">
                💬
              </div>

              <h3>
                Select a member
              </h3>

              <p>
                Choose someone from the community
                to start a conversation.
              </p>

            </div>

          ) : (

            <>

              {/* CHAT HEADER */}

              <div
                style={{
                  padding: "18px 22px",
                  borderBottom:
                    "1px solid #e5e7eb",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  gap: "12px"
                }}
              >

                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius:
                      "50%",
                    background:
                      "#e0e7ff",
                    color:
                      "#4338ca",
                    display:
                      "flex",
                    alignItems:
                      "center",
                    justifyContent:
                      "center",
                    fontWeight:
                      "700"
                  }}
                >
                  {selectedUser.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                <div>

                  <h2
                    style={{
                      margin: 0,
                      fontSize: "17px"
                    }}
                  >
                    {selectedUser.name}
                  </h2>

                  <p
                    style={{
                      margin:
                        "3px 0 0",
                      color:
                        "#64748b",
                      fontSize:
                        "12px"
                    }}
                  >
                    {selectedUser._id ===
                    currentUserId
                      ? "Private messages to yourself"
                      : "Private conversation"}
                  </p>

                </div>

              </div>


              {/* CHAT MESSAGES */}

              <div
                style={{
                  flex: 1,
                  padding: "20px",
                  overflowY:
                    "auto",
                  minHeight:
                    "380px",
                  maxHeight:
                    "450px",
                  background:
                    "#f8fafc"
                }}
              >

                {loadingMessages ? (

                  <div
                    style={{
                      textAlign:
                        "center",
                      color:
                        "#64748b",
                      padding:
                        "50px 20px"
                    }}
                  >
                    Loading conversation...
                  </div>

                ) : messages.length === 0 ? (

                  <div
                    style={{
                      textAlign:
                        "center",
                      color:
                        "#64748b",
                      padding:
                        "60px 20px"
                    }}
                  >

                    <div
                      style={{
                        fontSize:
                          "40px",
                        marginBottom:
                          "10px"
                      }}
                    >
                      💬
                    </div>

                    <h3
                      style={{
                        margin:
                          "0 0 5px",
                        color:
                          "#334155"
                      }}
                    >
                      No messages yet
                    </h3>

                    <p
                      style={{
                        margin: 0
                      }}
                    >
                      Start the conversation.
                    </p>

                  </div>

                ) : (

                  messages.map(
                    (message) => {

                      const isMine =
                        message.sender?._id ===
                        currentUserId;

                      const isEditing =
                        editingMessageId ===
                        message._id;

                      return (

                        <div
                          key={message._id}
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              isMine
                                ? "flex-end"
                                : "flex-start",
                            marginBottom:
                              "14px"
                          }}
                        >

                          <div
                            style={{
                              maxWidth:
                                "75%"
                            }}
                          >

                            {isEditing ? (

                              <div
                                style={{
                                  background:
                                    "white",
                                  border:
                                    "1px solid #c7d2fe",
                                  borderRadius:
                                    "14px",
                                  padding:
                                    "12px"
                                }}
                              >

                                <textarea
                                  value={
                                    editingText
                                  }
                                  onChange={(
                                    event
                                  ) =>
                                    setEditingText(
                                      event.target
                                        .value
                                    )
                                  }
                                  rows="3"
                                  className="form-input"
                                  style={{
                                    width:
                                      "100%",
                                    resize:
                                      "vertical"
                                  }}
                                />

                                <div
                                  style={{
                                    display:
                                      "flex",
                                    gap:
                                      "8px",
                                    marginTop:
                                      "8px"
                                  }}
                                >

                                  <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                      saveEdit(
                                        message._id
                                      )
                                    }
                                  >
                                    Save
                                  </button>

                                  <button
                                    className="btn"
                                    onClick={
                                      cancelEditing
                                    }
                                  >
                                    Cancel
                                  </button>

                                </div>

                              </div>

                            ) : (

                              <div
                                style={{
                                  background:
                                    isMine
                                      ? "#4f46e5"
                                      : "white",
                                  color:
                                    isMine
                                      ? "white"
                                      : "#1e293b",
                                  padding:
                                    "11px 14px",
                                  borderRadius:
                                    isMine
                                      ? "16px 16px 4px 16px"
                                      : "16px 16px 16px 4px",
                                  boxShadow:
                                    "0 1px 3px rgba(0,0,0,0.08)"
                                }}
                              >

                                <div
                                  style={{
                                    whiteSpace:
                                      "pre-wrap",
                                    wordBreak:
                                      "break-word"
                                  }}
                                >
                                  {message.message}
                                </div>

                                <div
                                  style={{
                                    fontSize:
                                      "10px",
                                    marginTop:
                                      "6px",
                                    opacity:
                                      0.7
                                  }}
                                >
                                  {formatTime(
                                    message.createdAt
                                  )}
                                </div>

                              </div>

                            )}

                            {/* MESSAGE ACTIONS */}

                            {isMine &&
                              !isEditing && (

                                <div
                                  style={{
                                    display:
                                      "flex",
                                    justifyContent:
                                      "flex-end",
                                    gap:
                                      "10px",
                                    marginTop:
                                      "5px"
                                  }}
                                >

                                  <button
                                    onClick={() =>
                                      startEditing(
                                        message
                                      )
                                    }
                                    style={{
                                      border:
                                        "none",
                                      background:
                                        "none",
                                      color:
                                        "#4f46e5",
                                      cursor:
                                        "pointer",
                                      fontSize:
                                        "12px"
                                    }}
                                  >
                                    Edit
                                  </button>

                                  <button
                                    onClick={() =>
                                      deleteMessage(
                                        message._id
                                      )
                                    }
                                    style={{
                                      border:
                                        "none",
                                      background:
                                        "none",
                                      color:
                                        "#dc2626",
                                      cursor:
                                        "pointer",
                                      fontSize:
                                        "12px"
                                    }}
                                  >
                                    Delete
                                  </button>

                                </div>

                              )}

                          </div>

                        </div>

                      );

                    }
                  )

                )}

              </div>


              {/* MESSAGE INPUT */}

              <div
                style={{
                  padding:
                    "16px",
                  borderTop:
                    "1px solid #e5e7eb",
                  background:
                    "white"
                }}
              >

                <div
                  style={{
                    display:
                      "flex",
                    gap:
                      "10px",
                    alignItems:
                      "flex-end"
                  }}
                >

                  <textarea
                    value={
                      messageText
                    }
                    onChange={(
                      event
                    ) =>
                      setMessageText(
                        event.target.value
                      )
                    }
                    onKeyDown={
                      handleMessageKeyDown
                    }
                    placeholder={
                      selectedUser._id ===
                      currentUserId
                        ? "Write a private message to yourself..."
                        : `Message ${selectedUser.name}...`
                    }
                    rows="2"
                    className="form-input"
                    style={{
                      flex: 1,
                      resize:
                        "none"
                    }}
                  />

                  <button
                    className="btn btn-primary"
                    onClick={
                      sendMessage
                    }
                    disabled={
                      sending ||
                      !messageText.trim()
                    }
                  >

                    {sending
                      ? "Sending..."
                      : "Send"}

                  </button>

                </div>

                <div
                  style={{
                    marginTop:
                      "6px",
                    fontSize:
                      "11px",
                    color:
                      "#94a3b8"
                  }}
                >
                  Press Enter to send • Shift + Enter for a new line
                </div>

              </div>

            </>

          )}

        </div>

      </div>

    </div>
  );
}

export default Messages;