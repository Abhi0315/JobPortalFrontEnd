// import { useState, useEffect } from "react";
// import axios from "axios";
import "../styles/notificationPopup.css"; // Ensure you have the styles for the notification popup

// const NotificationPopup = ({ isOpen, onClose }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (isOpen) {
//       fetchNotifications();
//     }
//   }, [isOpen]);

//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       setError("");
//       const token = localStorage.getItem("token");

//       const response = await axios.get(
//         "https://prohires.strangled.net/job/list_notifications/",
//         { headers: { Authorization: `Token ${token}` } }
//       );

//       setNotifications(response.data.notifications || []);
//     } catch (err) {
//       console.error("Error fetching notifications:", err);
//       setError("Failed to load notifications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarkAsRead = async (id) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         `https://prohires.strangled.net/job/notifications/${id}/mark_as_read/`,
//         {},
//         { headers: { Authorization: `Token ${token}` } }
//       );

//       // Update the notification locally
//       setNotifications(
//         notifications.map((notif) =>
//           notif.id === id ? { ...notif, is_read: true } : notif
//         )
//       );
//     } catch (err) {
//       console.error("Error marking notification as read:", err);
//     }
//   };

//   const handleMarkAllAsRead = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         "https://prohires.strangled.net/job/notifications/mark_all_as_read/",
//         {},
//         { headers: { Authorization: `Token ${token}` } }
//       );

//       // Update all notifications locally
//       setNotifications(
//         notifications.map((notif) => ({ ...notif, is_read: true }))
//       );
//     } catch (err) {
//       console.error("Error marking all notifications as read:", err);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="notification-overlay" onClick={onClose}>
//       <div className="notification-popup" onClick={(e) => e.stopPropagation()}>
//         <div className="notification-header">
//           <h3>Notifications</h3>
//           {notifications.length > 0 && (
//             <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
//               Mark all as read
//             </button>
//           )}
//           <button className="close-btn" onClick={onClose}>
//             ×
//           </button>
//         </div>

//         <div className="notification-content">
//           {loading ? (
//             <div className="notification-loading">Loading notifications...</div>
//           ) : error ? (
//             <div className="notification-error">{error}</div>
//           ) : notifications.length === 0 ? (
//             <div className="notification-empty">No notifications found</div>
//           ) : (
//             <div className="notification-list">
//               {notifications.map((notification) => (
//                 <div
//                   key={notification.id}
//                   className={`notification-item ${
//                     notification.is_read ? "read" : "unread"
//                   }`}
//                 >
//                   <div className="notification-message">
//                     <h4>{notification.title}</h4>
//                     <p>{notification.message}</p>
//                     <span className="notification-time">
//                       {new Date(notification.created_at).toLocaleString()}
//                     </span>
//                   </div>
//                   {!notification.is_read && (
//                     <button
//                       className="mark-read-btn"
//                       onClick={() => handleMarkAsRead(notification.id)}
//                       title="Mark as read"
//                     >
//                       ✓
//                     </button>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotificationPopup;import { useState, useEffect } from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/notificationPopup.css";

const NotificationPopup = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      // Limit to 6 notifications as requested
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

  const handleDeleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://prohires.strangled.net/job/mark_notification_read/",
        { notification_id: id },
        { headers: { Authorization: `Token ${token}` } }
      );

      // Remove the notification from the list
      setNotifications(notifications.filter((notif) => notif.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
      alert("Failed to delete notification");
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

      // Close the popup after marking all as read
      onClose();

      // Optional: Refetch notifications to update the UI
      fetchNotifications();
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      alert("Failed to mark all notifications as read");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div className="notification-popup" onClick={(e) => e.stopPropagation()}>
        <div className="notification-header">
          <h3>Notifications</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="notification-content">
          {loading ? (
            <div className="notification-loading">Loading notifications...</div>
          ) : error ? (
            <div className="notification-error">{error}</div>
          ) : notifications.length === 0 ? (
            <div className="notification-empty">No notifications found</div>
          ) : (
            <>
              <div className="notification-list">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${
                      notification.is_read ? "read" : "unread"
                    }`}
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
                      onClick={() => handleDeleteNotification(notification.id)}
                      title="Delete notification"
                    >
                      ×
                    </button>
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
  );
};

export default NotificationPopup;
