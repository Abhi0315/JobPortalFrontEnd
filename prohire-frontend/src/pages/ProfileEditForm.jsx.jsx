import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "react-icons/fi";

import "../styles/ProfileEditForm.css";

const ProfileEditForm = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    profilePicture: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    resume: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://prohires.strangled.net/mainapp/get_user_profile",
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
          firstName: user.name || "",
          lastName: user.last_name || "",
          phoneNumber: user.phone_number || "",
          email: user.email || "",
          profilePicture: user.profile_picture || "",
          address: address.address || "",
          city: address.city || "",
          state: address.state || "",
          country: address.country || "",
          pincode: address.pincode || "",
          resume: user.resume_link || "",
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const startEditing = (fieldName) => {
    setEditingField(fieldName);
    setTempValue(userData[fieldName]);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempValue("");
  };

  const saveEditing = async (fieldName) => {
    try {
      const updatedData = { ...userData, [fieldName]: tempValue };

      await axios.put("/api/user/profile", updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUserData(updatedData);
      setEditingField(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update profile");
    }
  };

  const handleTempChange = (e) => {
    setTempValue(e.target.value);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append(e.target.name, file);

        const response = await axios.put("/api/user/profile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setUserData((prev) => ({
          ...prev,
          [e.target.name]:
            e.target.name === "profilePicture"
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

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError("Please enter your password");
      return;
    }

    try {
      await axios.delete("/api/user/account", {
        data: { password: deletePassword },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      window.location.href = "/";
    } catch (err) {
      setDeleteError("Incorrect password or deletion failed");
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
        <div className="editing-container">
          <div className="input-group">
            {IconComponent && <IconComponent className="input-icon" />}
            <input
              type={type}
              value={tempValue}
              onChange={handleTempChange}
              autoFocus
              placeholder={`Enter ${label.toLowerCase()}`}
              className="edit-input"
            />
          </div>
          <div className="action-buttons">
            <button
              type="button"
              onClick={() => saveEditing(fieldName)}
              className="action-btn save"
              aria-label={`Save ${label}`}
            >
              <FiSave />
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              className="action-btn cancel"
              aria-label="Cancel editing"
            >
              <FiX />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="field-container">
        <div className="field-content">
          {IconComponent && <IconComponent className="field-icon" />}
          <span className={!userData[fieldName] ? "empty-field" : ""}>
            {userData[fieldName] || `No ${label.toLowerCase()} provided`}
          </span>
        </div>
        <button
          type="button"
          onClick={() => startEditing(fieldName)}
          className="edit-btn"
          aria-label={`Edit ${label}`}
        >
          <FiEdit2 />
        </button>
      </div>
    );
  };

  if (loading) return <div className="loading-screen">Loading profile...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="profile-edit-wrapper">
      <div className="profile-header">
        <h1>Profile Settings</h1>
        {success && (
          <div className="success-banner">Profile updated successfully!</div>
        )}
      </div>

      <div className="profile-sections">
        {/* Profile Picture Section */}
        <section className="profile-section picture-section">
          <div className="section-header">
            <h2>Profile Picture</h2>
          </div>
          <div className="picture-container">
            <div className="avatar-wrapper">
              {userData.profilePicture ? (
                <img
                  src={
                    typeof userData.profilePicture === "string"
                      ? userData.profilePicture
                      : URL.createObjectURL(userData.profilePicture)
                  }
                  alt="Profile"
                  className="profile-avatar"
                />
              ) : (
                <div className="avatar-placeholder">
                  <FiUser size={48} />
                </div>
              )}
              <label className="avatar-upload-btn">
                <FiCamera className="camera-icon" />
                <input
                  type="file"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        </section>

        {/* Personal Information Section */}
        <section className="profile-section">
          <div className="section-header">
            <h2>Personal Information</h2>
          </div>
          <div className="form-grid">
            <div className="form-field">
              <label>First Name</label>
              {renderEditableField("firstName", "First Name", "text", FiUser)}
            </div>

            <div className="form-field">
              <label>Last Name</label>
              {renderEditableField("lastName", "Last Name")}
            </div>

            <div className="form-field">
              <label>Email</label>
              <div className="field-container">
                <div className="field-content">
                  <FiMail className="field-icon" />
                  <span>{userData.email}</span>
                </div>
              </div>
            </div>

            <div className="form-field">
              <label>Phone Number</label>
              {renderEditableField(
                "phoneNumber",
                "Phone Number",
                "tel",
                FiPhone
              )}
            </div>
          </div>
        </section>

        {/* Address Information Section */}
        <section className="profile-section">
          <div className="section-header">
            <h2>Address Information</h2>
          </div>
          <div className="form-grid">
            <div className="form-field full-width">
              <label>Address</label>
              {renderEditableField("address", "Address", "text", FiHome)}
            </div>

            <div className="form-field">
              <label>City</label>
              {renderEditableField("city", "City", "text", FiMapPin)}
            </div>

            <div className="form-field">
              <label>State</label>
              {renderEditableField("state", "State")}
            </div>

            <div className="form-field">
              <label>Country</label>
              {renderEditableField("country", "Country")}
            </div>

            <div className="form-field">
              <label>Pincode</label>
              {renderEditableField("pincode", "Pincode")}
            </div>
          </div>
        </section>

        {/* Resume Section */}
        <section className="profile-section">
          <div className="section-header">
            <h2>Resume</h2>
          </div>
          <div className="resume-container">
            {userData.resume ? (
              <div className="resume-card">
                <FiFile className="resume-icon" />
                <div className="resume-details">
                  <div className="resume-name">
                    {(() => {
                      if (typeof userData.resume === "string") {
                        return userData.resume.split("/").pop();
                      } else if (
                        userData.resume instanceof File ||
                        userData.resume?.name
                      ) {
                        return userData.resume.name;
                      }
                      return "Resume";
                    })()}
                  </div>
                  <div className="resume-actions">
                    <a
                      href={
                        typeof userData.resume === "string"
                          ? userData.resume
                          : URL.createObjectURL(userData.resume)
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resume-btn"
                    >
                      <FiEye /> View
                    </a>
                    <a
                      href={
                        typeof userData.resume === "string"
                          ? userData.resume
                          : URL.createObjectURL(userData.resume)
                      }
                      download
                      className="resume-btn"
                    >
                      <FiDownload /> Download
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-resume">
                <FiFile className="no-resume-icon" />
                <span>No resume uploaded</span>
              </div>
            )}
            <label className="resume-upload-btn">
              {userData.resume ? "Update Resume" : "Upload Resume"}
              <input
                type="file"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </section>

        {/* Danger Zone Section */}
        <section className="profile-section danger-zone">
          <div className="section-header">
            <h2>Danger Zone</h2>
          </div>
          <div className="danger-content">
            <div className="danger-warning">
              <FiTrash2 className="danger-icon" />
              <div>
                <h3>Delete Account</h3>
                <p>Permanently delete your account and all associated data.</p>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="delete-btn"
            >
              Delete Account
            </button>
          </div>
        </section>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <div className="modal-header">
              <h3>Confirm Account Deletion</h3>
            </div>
            <div className="modal-body">
              <p className="warning-text">
                This action cannot be undone. All your data will be permanently
                deleted.
              </p>
              <p>Please enter your password to confirm:</p>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter your password"
                className="password-input"
              />
              {deleteError && <div className="error-text">{deleteError}</div>}
            </div>
            <div className="modal-footer">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                  setDeleteError("");
                }}
                className="secondary-btn"
              >
                Cancel
              </button>
              <button onClick={handleDeleteAccount} className="danger-btn">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEditForm;
