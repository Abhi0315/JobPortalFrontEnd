import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ProfileEditForm.css";
import {
  FiEdit2,
  FiSave,
  FiX,
  FiTrash2,
  FiUser,
  FiMail,
  FiPhone,
  FiHome,
  FiMapPin,
  FiFile,
  FiCamera,
  FiDownload,
  FiEye,
  FiChevronRight,
  FiUpload,
  FiCheck,
} from "react-icons/fi";

const ProfileEditForm = () => {
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    profile_picture: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    resume_link: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [activeSection, setActiveSection] = useState("personal");

  // Fetch user profile
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://prohires.strangled.net/mainapp/get_user_profile/",
          {
            headers: {
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );

        const user = response.data.data;
        const address =
          user.addresses && user.addresses.length > 0 ? user.addresses[0] : {};

        setUserData({
          first_name: user.name || "",
          last_name: user.last_name || "",
          phone_number: user.phone_number || "",
          email: user.email || "",
          profile_picture: user.profile_picture || "",
          address: address.address || "",
          city: address.city || "",
          state: address.state || "",
          country: address.country || "",
          pincode: address.pincode || "",
          resume_link: user.resume_link || "",
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Editing
  const startEditing = (fieldName) => {
    setEditingField(fieldName);
    setTempValue(userData[fieldName]);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue("");
  };

  // Save field update
  const saveEditing = async (fieldName) => {
    try {
      const formData = new FormData();
      formData.append(fieldName, tempValue);

      await axios.put(
        "https://prohires.strangled.net/mainapp/update_user_profile/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      setUserData((prev) => ({ ...prev, [fieldName]: tempValue }));
      setEditingField(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  // Handle temp input
  const handleTempChange = (e) => {
    setTempValue(e.target.value);
  };

  // Handle file upload
  const handleFileChange = async (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append(fieldName, file);

        await axios.put(
          "https://prohires.strangled.net/mainapp/update_user_profile/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Token ${localStorage.getItem("token")}`,
            },
          }
        );

        setUserData((prev) => ({
          ...prev,
          [fieldName]:
            fieldName === "profile_picture"
              ? URL.createObjectURL(file)
              : file.name,
        }));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } catch (err) {
        setError("Failed to upload file");
      }
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError("Please enter your password");
      return;
    }

    try {
      await axios.delete(
        "https://prohires.strangled.net/mainapp/delete_user_profile/",
        {
          data: { password: deletePassword },
          headers: {
            Authorization: `Token ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      setDeleteError(
        err.response?.data?.message || "Incorrect password or deletion failed"
      );
    }
  };

  const renderEditableField = (
    fieldName,
    label,
    type = "text",
    IconComponent
  ) => {
    if (editingField === fieldName) {
      return (
        <div className="editing-field-container">
          <div className="editing-input-group">
            {IconComponent && (
              <div className="input-icon-container">
                <IconComponent className="input-icon" />
              </div>
            )}
            <input
              type={type}
              value={tempValue}
              onChange={handleTempChange}
              autoFocus
              className={`editing-input ${IconComponent ? "with-icon" : ""}`}
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </div>
          <div className="editing-action-buttons">
            <button
              type="button"
              onClick={() => saveEditing(fieldName)}
              className="action-button save-button"
              aria-label={`Save ${label}`}
            >
              <FiCheck className="action-icon" />
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              className="action-button cancel-button"
              aria-label="Cancel editing"
            >
              <FiX className="action-icon" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="field-display-container">
        <div className="field-content">
          {IconComponent && <IconComponent className="field-icon" />}
          <span
            className={`field-value ${!userData[fieldName] ? "empty" : ""}`}
          >
            {userData[fieldName] || `No ${label.toLowerCase()} provided`}
          </span>
        </div>
        <button
          type="button"
          onClick={() => startEditing(fieldName)}
          className="edit-button"
          aria-label={`Edit ${label}`}
        >
          <FiEdit2 className="edit-icon" />
        </button>
      </div>
    );
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  if (error)
    return (
      <div className="error-container">
        <div className="error-message">
          <svg className="error-icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <p>{error}</p>
        </div>
      </div>
    );

  return (
    <div className="profile-edit-fullscreen">
      {/* Success Notification */}
      {success && (
        <div className="success-notification">
          <div className="success-content">
            <FiCheck className="success-icon" />
            <p>Profile updated successfully</p>
          </div>
        </div>
      )}
      <div className="profile-layout-container">
        {/* Sidebar Navigation */}
        <div className="profile-sidebar">
          <div className="sidebar-content">
            <div className="profile-summary">
              <div className="avatar-container">
                {userData.profile_picture ? (
                  <img
                    src={
                      typeof userData.profile_picture === "string"
                        ? userData.profile_picture
                        : URL.createObjectURL(userData.profile_picture)
                    }
                    alt="Profile"
                    className="profile-avatar"
                  />
                ) : (
                  <div className="avatar-placeholder">
                    <FiUser className="placeholder-icon" />
                  </div>
                )}
                <label className="avatar-upload-label">
                  <FiCamera className="camera-icon" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "profile_picture")}
                    className="avatar-upload-input"
                  />
                </label>
              </div>
              <h2 className="profile-name">
                {userData.first_name} {userData.last_name}
              </h2>
              <p className="profile-email">{userData.email}</p>
            </div>

            <nav className="sidebar-navigation">
              <button
                onClick={() => setActiveSection("personal")}
                className={`nav-button ${
                  activeSection === "personal" ? "active" : ""
                }`}
              >
                <span>Personal Information</span>
                <FiChevronRight className="nav-icon" />
              </button>

              <button
                onClick={() => setActiveSection("address")}
                className={`nav-button ${
                  activeSection === "address" ? "active" : ""
                }`}
              >
                <span>Address Information</span>
                <FiChevronRight className="nav-icon" />
              </button>

              <button
                onClick={() => setActiveSection("resume")}
                className={`nav-button ${
                  activeSection === "resume" ? "active" : ""
                }`}
              >
                <span>Resume</span>
                <FiChevronRight className="nav-icon" />
              </button>

              <button
                onClick={() => setActiveSection("danger")}
                className={`nav-button danger ${
                  activeSection === "danger" ? "active" : ""
                }`}
              >
                <span>Danger Zone</span>
                <FiChevronRight className="nav-icon" />
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main-content">
          <div className="profile-section-container">
            {/* Personal Information Section */}
            {activeSection === "personal" && (
              <div className="section-content">
                <div className="section-header">
                  <h2 className="section-title">Personal Information</h2>
                  <p className="section-description">
                    Update your personal details and contact information.
                  </p>
                </div>

                <div className="form-fields">
                  <div className="form-field">
                    <label className="field-label">First Name</label>
                    {renderEditableField(
                      "first_name",
                      "First Name",
                      "text",
                      FiUser
                    )}
                  </div>

                  <div className="form-field">
                    <label className="field-label">Last Name</label>
                    {renderEditableField("last_name", "Last Name")}
                  </div>

                  <div className="form-field">
                    <label className="field-label">Email</label>
                    <div className="email-display">
                      <div className="field-content">
                        <FiMail className="field-icon" />
                        <span className="field-value">{userData.email}</span>
                      </div>
                      <span className="email-tag">Primary</span>
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Phone Number</label>
                    {renderEditableField(
                      "phone_number",
                      "Phone Number",
                      "tel",
                      FiPhone
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Address Information Section */}
            {activeSection === "address" && (
              <div className="section-content">
                <div className="section-header">
                  <h2 className="section-title">Address Information</h2>
                  <p className="section-description">
                    Update your current address details.
                  </p>
                </div>

                <div className="form-fields">
                  <div className="form-field full-width">
                    <label className="field-label">Address</label>
                    {renderEditableField("address", "Address", "text", FiHome)}
                  </div>

                  <div className="form-grid">
                    <div className="form-field">
                      <label className="field-label">City</label>
                      {renderEditableField("city", "City", "text", FiMapPin)}
                    </div>

                    <div className="form-field">
                      <label className="field-label">State</label>
                      {renderEditableField("state", "State")}
                    </div>

                    <div className="form-field">
                      <label className="field-label">Country</label>
                      {renderEditableField("country", "Country")}
                    </div>

                    <div className="form-field">
                      <label className="field-label">Pincode</label>
                      {renderEditableField("pincode", "Pincode")}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Resume Section */}
            {activeSection === "resume" && (
              <div className="section-content">
                <div className="section-header">
                  <h2 className="section-title">Resume Management</h2>
                  <p className="section-description">
                    Upload or update your resume for job applications.
                  </p>
                </div>

                <div className="resume-section">
                  {userData.resume_link ? (
                    <div className="resume-card">
                      <div className="resume-icon-container">
                        <FiFile className="resume-icon" />
                      </div>
                      <div className="resume-details">
                        <h3 className="resume-title">
                          {typeof userData.resume_link === "string"
                            ? userData.resume_link.split("/").pop()
                            : userData.resume_link.name || "Resume"}
                        </h3>
                        <p className="resume-date">
                          Last updated: {new Date().toLocaleDateString()}
                        </p>
                        <div className="resume-actions">
                          <a
                            href={
                              typeof userData.resume_link === "string"
                                ? userData.resume_link
                                : URL.createObjectURL(userData.resume_link)
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resume-button view"
                          >
                            <FiEye className="button-icon" />
                            View
                          </a>
                          <a
                            href={
                              typeof userData.resume_link === "string"
                                ? userData.resume_link
                                : URL.createObjectURL(userData.resume_link)
                            }
                            download
                            className="resume-button download"
                          >
                            <FiDownload className="button-icon" />
                            Download
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-resume">
                      <FiFile className="empty-resume-icon" />
                      <h3 className="empty-resume-title">No resume uploaded</h3>
                      <p className="empty-resume-description">
                        Upload your resume to apply for jobs.
                      </p>
                    </div>
                  )}

                  <div className="resume-upload-wrapper">
                    <label className="resume-upload-label">
                      <FiUpload className="upload-icon" />
                      <span className="upload-text">
                        {userData.resume_link
                          ? "Update Resume"
                          : "Upload Resume"}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e, "resume_link")}
                        className="resume-upload-input"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Danger Zone Section */}
            {activeSection === "danger" && (
              <div className="section-content">
                <div className="section-header">
                  <h2 className="section-title">Danger Zone</h2>
                  <p className="section-description">
                    Actions in this section are irreversible.
                  </p>
                </div>

                <div className="danger-zone-card">
                  <div className="danger-content">
                    <FiTrash2 className="danger-icon" />
                    <div className="danger-text">
                      <h3 className="danger-title">Delete Account</h3>
                      <p className="danger-description">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="danger-button"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="modal-icon-container">
              <FiTrash2 className="modal-icon" />
            </div>
            <div className="modal-content">
              <h3 className="modal-title">Delete Account</h3>
              <p className="modal-description">
                This will permanently delete your account and all associated
                data. Please enter your password to confirm.
              </p>
            </div>
            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="form-input"
                  placeholder="Enter your password"
                />
                {deleteError && <p className="form-error">{deleteError}</p>}
              </div>
              <div className="modal-buttons">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword("");
                    setDeleteError("");
                  }}
                  className="modal-button secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="modal-button danger"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEditForm;
