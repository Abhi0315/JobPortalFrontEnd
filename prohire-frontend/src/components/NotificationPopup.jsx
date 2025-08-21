import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/NotificationPopup.css";

const NotificationPopup = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://prohires.strangled.net/job/list_notifications/",
        { headers: { Authorization: `Token ${token}` } }
      );

      const limitedNotifications = (response.data.notifications || []).slice(
        0,
        6
      );
      setNotifications(limitedNotifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const playDeleteSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        // Silent catch for autoplay restrictions
      });
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      setDeletingId(id);
      playDeleteSound();

      // Wait for animation to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      const token = localStorage.getItem("token");
      await axios.post(
        "https://prohires.strangled.net/job/mark_notification_read/",
        { notification_id: id },
        { headers: { Authorization: `Token ${token}` } }
      );

      setNotifications(notifications.filter((notif) => notif.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
      alert("Failed to delete notification");
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://prohires.strangled.net/job/mark_all_notifications_read/",
        {},
        { headers: { Authorization: `Token ${token}` } }
      );

      onClose();
      fetchNotifications();
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      alert("Failed to mark all notifications as read");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <audio ref={audioRef} src="/sounds/delete-sound.mp3" preload="auto" />
      <div className="notification-overlay" onClick={onClose}>
        <div
          className="notification-popup"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="notification-header">
            <h3>Notifications</h3>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>

          <div className="notification-content">
            {loading ? (
              <div className="notification-loading">
                <div className="loading-spinner"></div>
                <div>Loading notifications...</div>
              </div>
            ) : error ? (
              <div className="notification-error">{error}</div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <div className="empty-icon">🔔</div>
                <div>No notifications found</div>
              </div>
            ) : (
              <>
                <div className="notification-list">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${
                        notification.is_read ? "read" : "unread"
                      } ${deletingId === notification.id ? "deleting" : ""}`}
                    >
                      <div className="notification-message">
                        <h4>{notification.title}</h4>
                        <p>{notification.message}</p>
                        <span className="notification-time">
                          {new Date(notification.created_at).toLocaleString()}
                        </span>
                      </div>
                      <button
                        className="delete-notification-btn"
                        onClick={() =>
                          handleDeleteNotification(notification.id)
                        }
                        title="Delete notification"
                        disabled={deletingId === notification.id}
                      >
                        ×
                      </button>
                      {deletingId === notification.id && (
                        <div className="sound-effect"></div>
                      )}
                    </div>
                  ))}
                </div>

                {notifications.length > 0 && (
                  <div className="notification-footer">
                    <button
                      className="mark-all-read-btn"
                      onClick={handleMarkAllAsRead}
                    >
                      Mark all as read
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPopup;
