import React, { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./Messages.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "http://localhost:5000";

function getId(value) {
  if (!value) return "";

  if (typeof value === "string") {
    return value;
  }

  if (value._id) {
    return value._id.toString();
  }

  if (value.id) {
    return value.id.toString();
  }

  return value.toString();
}

function getInitials(name) {
  if (!name) return "?";

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatTime(dateValue) {
  if (!dateValue) return "";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

async function parseResponse(response) {
  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {
      message: text || "Unexpected server response"
    };
  }

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed with status ${response.status}`
    );
  }

  return data;
}

export default function Messages() {
  const token = localStorage.getItem("token");

  const currentUser = useMemo(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  }, []);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  const [messageText, setMessageText] = useState("");
  const [broadcastText, setBroadcastText] = useState("");

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [sending, setSending] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const [onlineUsers, setOnlineUsers] = useState([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const selectedUserRef = useRef(null);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  const isAdmin = currentUser?.role === "admin";

  const currentUserId = getId(currentUser);

  const isUserOnline = (userId) => {
    return onlineUsers.some(
      (onlineId) => getId(onlineId) === getId(userId)
    );
  };

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      setError("");

      const response = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await parseResponse(response);

      const userList = Array.isArray(data.users)
        ? data.users
        : [];

      setUsers(userList);

      if (userList.length > 0 && !selectedUserRef.current) {
        const firstUser =
          userList.find(
            (user) => getId(user) !== currentUserId
          ) || userList[0];

        setSelectedUser(firstUser);
      }
    } catch (err) {
      console.error("Load users error:", err);
      setError(err.message || "Unable to load users.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadConversation = async (userId) => {
    if (!userId) {
      setMessages([]);
      return;
    }

    try {
      setLoadingMessages(true);
      setError("");

      const response = await fetch(
        `${API_URL}/messages/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await parseResponse(response);

      setMessages(
        Array.isArray(data.messages)
          ? data.messages
          : []
      );
    } catch (err) {
      console.error("Load conversation error:", err);
      setError(
        err.message || "Unable to load conversation."
      );
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setError("Please login again.");
      return;
    }

    loadUsers();

    const socket = io(SOCKET_URL, {
      auth: {
        token
      }
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected");
      socket.emit("get-online-users");
    });

    socket.on("online-users", (userIds) => {
      setOnlineUsers(
        Array.isArray(userIds) ? userIds : []
      );
    });

    socket.on("user-online", (userId) => {
      setOnlineUsers((previous) => {
        if (
          previous.some(
            (id) => getId(id) === getId(userId)
          )
        ) {
          return previous;
        }

        return [...previous, userId];
      });
    });

    socket.on("user-offline", (userId) => {
      setOnlineUsers((previous) =>
        previous.filter(
          (id) => getId(id) !== getId(userId)
        )
      );
    });

    socket.on("new-message", (newMessage) => {
      const selected = selectedUserRef.current;

      if (!selected || !newMessage) {
        return;
      }

      const senderId = getId(newMessage.sender);
      const receiverId = getId(newMessage.receiver);
      const selectedId = getId(selected);

      const belongsToConversation =
        (senderId === currentUserId &&
          receiverId === selectedId) ||
        (senderId === selectedId &&
          receiverId === currentUserId);

      if (belongsToConversation) {
        setMessages((previous) => {
          const alreadyExists = previous.some(
            (message) =>
              getId(message) === getId(newMessage)
          );

          if (alreadyExists) {
            return previous;
          }

          return [...previous, newMessage];
        });
      }
    });

    socket.on("message-updated", (updatedMessage) => {
      if (!updatedMessage) return;

      setMessages((previous) =>
        previous.map((message) =>
          getId(message) === getId(updatedMessage)
            ? updatedMessage
            : message
        )
      );
    });

    socket.on("message-deleted", (deletedId) => {
      setMessages((previous) =>
        previous.filter(
          (message) =>
            getId(message) !== getId(deletedId)
        )
      );
    });

    socket.on("community-message", () => {
      const selected = selectedUserRef.current;

      if (selected) {
        loadConversation(getId(selected));
      }
    });

    socket.on("connect_error", (socketError) => {
      console.error(
        "Socket error:",
        socketError.message
      );
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, currentUserId]);

  useEffect(() => {
    if (selectedUser) {
      loadConversation(getId(selectedUser));
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  const selectUser = (user) => {
    setSelectedUser(user);
    setMessages([]);
    setError("");
    setSuccess("");
    setEditingMessageId(null);
    setEditingText("");
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const text = messageText.trim();

    if (!text || !selectedUser) {
      return;
    }

    try {
      setSending(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/messages/send`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            receiverId: getId(selectedUser),
            message: text
          })
        }
      );

      const data = await parseResponse(response);

      if (data.data) {
        setMessages((previous) => {
          const exists = previous.some(
            (message) =>
              getId(message) === getId(data.data)
          );

          return exists
            ? previous
            : [...previous, data.data];
        });
      }

      setMessageText("");
    } catch (err) {
      console.error("Send message error:", err);
      setError(
        err.message || "Unable to send message."
      );
    } finally {
      setSending(false);
    }
  };

  const handleEditMessage = (message) => {
    setEditingMessageId(getId(message));
    setEditingText(message.message || "");
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  const handleSaveEdit = async (messageId) => {
    const text = editingText.trim();

    if (!text) {
      setError("Message cannot be empty.");
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/messages/${messageId}`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            message: text
          })
        }
      );

      const data = await parseResponse(response);

      if (data.data) {
        setMessages((previous) =>
          previous.map((message) =>
            getId(message) === messageId
              ? data.data
              : message
          )
        );
      }

      setEditingMessageId(null);
      setEditingText("");
    } catch (err) {
      console.error("Edit message error:", err);
      setError(
        err.message || "Unable to edit message."
      );
    }
  };

  const handleDeleteMessage = async (messageId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_URL}/messages/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      await parseResponse(response);

      setMessages((previous) =>
        previous.filter(
          (message) =>
            getId(message) !== messageId
        )
      );
    } catch (err) {
      console.error("Delete message error:", err);
      setError(
        err.message || "Unable to delete message."
      );
    }
  };

  const handleBroadcast = async (event) => {
    event.preventDefault();

    const text = broadcastText.trim();

    if (!text) {
      return;
    }

    try {
      setBroadcasting(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_URL}/messages/broadcast`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            message: text
          })
        }
      );

      const data = await parseResponse(response);

      setSuccess(
        data.message ||
          "Community message sent successfully."
      );

      setBroadcastText("");
    } catch (err) {
      console.error("Broadcast error:", err);
      setError(
        err.message ||
          "Unable to send community message."
      );
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="messages-page">
      {error && (
        <div className="messages-alert messages-alert-error">
          {error}
        </div>
      )}

      {success && (
        <div className="messages-alert messages-alert-success">
          {success}
        </div>
      )}

      <div className="messages-container">
        <aside className="messages-sidebar">
          <div className="messages-sidebar-header">
            <h2>Messages</h2>
            <p>Connect with community members</p>
          </div>

          <div className="messages-user-list">
            {loadingUsers ? (
              <div className="messages-loading">
                Loading users...
              </div>
            ) : users.length === 0 ? (
              <div className="messages-empty-small">
                No users found.
              </div>
            ) : (
              users.map((user) => {
                const userId = getId(user);

                return (
                  <button
                    key={userId}
                    type="button"
                    className={`messages-user-item ${
                      selectedUser &&
                      getId(selectedUser) === userId
                        ? "active"
                        : ""
                    }`}
                    onClick={() => selectUser(user)}
                  >
                    <div className="messages-user-avatar">
                      {getInitials(user.name)}

                      {isUserOnline(userId) && (
                        <span className="messages-online-dot" />
                      )}
                    </div>

                    <div className="messages-user-info">
                      <span className="messages-user-name">
                        {user.name}

                        {userId === currentUserId
                          ? " (You)"
                          : ""}
                      </span>

                      <span className="messages-user-email">
                        {user.email}
                      </span>

                      {isUserOnline(userId) && (
                        <span className="messages-user-status">
                          Online
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <main className="messages-conversation">
          {!selectedUser ? (
            <div className="messages-empty">
              <div className="messages-empty-icon">
                💬
              </div>

              <h3>Select a person</h3>

              <p>
                Choose a community member to start
                messaging.
              </p>
            </div>
          ) : (
            <>
              <header className="messages-conversation-header">
                <div className="messages-conversation-user">
                  <div className="messages-conversation-avatar">
                    {getInitials(selectedUser.name)}
                  </div>

                  <div>
                    <h3>
                      {selectedUser.name}

                      {getId(selectedUser) === currentUserId
                        ? " (You)"
                        : ""}
                    </h3>

                    <p>{selectedUser.email}</p>
                  </div>
                </div>

                {isUserOnline(getId(selectedUser)) && (
                  <div className="messages-online-status">
                    <span className="messages-online-status-dot" />
                    Online
                  </div>
                )}
              </header>

              {isAdmin && (
                <div className="messages-broadcast">
                  <div className="messages-broadcast-title">
                    Send message to all community members
                  </div>

                  <form
                    className="messages-broadcast-form"
                    onSubmit={handleBroadcast}
                  >
                    <input
                      type="text"
                      className="messages-broadcast-input"
                      placeholder="Write a community announcement..."
                      value={broadcastText}
                      onChange={(event) =>
                        setBroadcastText(
                          event.target.value
                        )
                      }
                    />

                    <button
                      type="submit"
                      className="messages-broadcast-btn"
                      disabled={
                        broadcasting ||
                        !broadcastText.trim()
                      }
                    >
                      {broadcasting
                        ? "Sending..."
                        : "Send All"}
                    </button>
                  </form>
                </div>
              )}

              <div className="messages-list">
                {loadingMessages ? (
                  <div className="messages-loading">
                    Loading conversation...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="messages-empty">
                    <div className="messages-empty-icon">
                      💬
                    </div>

                    <h3>No messages yet</h3>

                    <p>
                      Start the conversation by
                      sending a message below.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => {
                    const messageId = getId(message);
                    const senderId = getId(
                      message.sender
                    );

                    const isSent =
                      senderId === currentUserId;

                    const canEdit = isSent;
                    const canDelete =
                      isSent || isAdmin;

                    const isEditing =
                      editingMessageId === messageId;

                    return (
                      <div
                        key={messageId}
                        className={`message-row ${
                          isSent
                            ? "sent"
                            : "received"
                        }`}
                      >
                        <div className="message-bubble">
                          {isEditing ? (
                            <div className="message-edit-area">
                              <textarea
                                className="message-edit-input"
                                value={editingText}
                                onChange={(event) =>
                                  setEditingText(
                                    event.target.value
                                  )
                                }
                                rows={3}
                              />

                              <div className="message-edit-buttons">
                                <button
                                  type="button"
                                  className="message-save-btn"
                                  onClick={() =>
                                    handleSaveEdit(
                                      messageId
                                    )
                                  }
                                >
                                  Save
                                </button>

                                <button
                                  type="button"
                                  className="message-cancel-btn"
                                  onClick={
                                    handleCancelEdit
                                  }
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="message-text">
                                {message.message}
                              </p>

                              <div className="message-meta">
                                <span>
                                  {formatTime(
                                    message.createdAt
                                  )}
                                </span>

                                {message.updatedAt &&
                                  message.createdAt !==
                                    message.updatedAt && (
                                    <span>
                                      edited
                                    </span>
                                  )}
                              </div>

                              {(canEdit ||
                                canDelete) && (
                                <div className="message-actions">
                                  {canEdit && (
                                    <button
                                      type="button"
                                      className="message-action-btn"
                                      onClick={() =>
                                        handleEditMessage(
                                          message
                                        )
                                      }
                                    >
                                      Edit
                                    </button>
                                  )}

                                  {canDelete && (
                                    <button
                                      type="button"
                                      className="message-action-btn"
                                      onClick={() =>
                                        handleDeleteMessage(
                                          messageId
                                        )
                                      }
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="messages-input-area">
                <form
                  className="messages-input-form"
                  onSubmit={handleSendMessage}
                >
                  <textarea
                    className="messages-input"
                    placeholder={`Message ${selectedUser.name}...`}
                    value={messageText}
                    onChange={(event) =>
                      setMessageText(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();

                        if (
                          messageText.trim() &&
                          !sending
                        ) {
                          handleSendMessage(event);
                        }
                      }
                    }}
                    rows={1}
                  />

                  <button
                    type="submit"
                    className="messages-send-btn"
                    disabled={
                      sending ||
                      !messageText.trim()
                    }
                  >
                    {sending ? "Sending..." : "Send"}
                  </button>
                </form>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}