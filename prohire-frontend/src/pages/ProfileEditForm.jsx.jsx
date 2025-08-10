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
          firstName: user.username.split("@")[0] || "",
          lastName: "",
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
        <div className="editing-field">
          <div className="input-with-icon">
            {IconComponent && <IconComponent className="field-icon" />}
            <input
              type={type}
              value={tempValue}
              onChange={handleTempChange}
              autoFocus
              placeholder={`Enter ${label.toLowerCase()}`}
            />
          </div>
          <div className="edit-controls">
            <button
              type="button"
              onClick={() => saveEditing(fieldName)}
              className="save-btn"
              aria-label={`Save ${label}`}
            >
              <FiSave />
            </button>
            <button
              type="button"
              onClick={cancelEditing}
              className="cancel-btn"
              aria-label="Cancel editing"
            >
              <FiX />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="display-field">
        <div className="content-with-icon">
          {IconComponent && <IconComponent className="field-icon" />}
          <span>
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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="profile-edit-container">
      <div className="profile-header">
        <h2>My Profile</h2>
        {success && (
          <div className="success-message">
            <div className="success-content">
              ✓ Profile updated successfully!
            </div>
          </div>
        )}
      </div>

      <div className="profile-card">
        <div className="card-section personal-info">
          <h3>
            <FiUser /> Personal Information
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name</label>
              {renderEditableField("firstName", "First Name", "text", FiUser)}
            </div>

            <div className="form-group">
              <label>Last Name</label>
              {renderEditableField("lastName", "Last Name")}
            </div>

            <div className="form-group">
              <label>Email</label>
              <div className="display-field">
                <div className="content-with-icon">
                  <FiMail className="field-icon" />
                  <span>{userData.email}</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              {renderEditableField(
                "phoneNumber",
                "Phone Number",
                "tel",
                FiPhone
              )}
            </div>
          </div>
        </div>

        <div className="card-section profile-picture-section">
          <h3>
            <FiUser /> Profile Picture
          </h3>
          <div className="profile-picture-upload">
            <div className="picture-preview-container">
              {userData.profilePicture ? (
                <img
                  src={
                    typeof userData.profilePicture === "string"
                      ? userData.profilePicture
                      : URL.createObjectURL(userData.profilePicture)
                  }
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <div className="profile-image-placeholder">
                  <FiUser size={48} />
                </div>
              )}
            </div>
            <div className="file-upload-wrapper">
              <label htmlFor="profilePicture" className="file-upload-label">
                Change Photo
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="card-section address-info">
          <h3>
            <FiHome /> Address Information
          </h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Address</label>
              {renderEditableField("address", "Address", "text", FiHome)}
            </div>

            <div className="form-group">
              <label>City</label>
              {renderEditableField("city", "City", "text", FiMapPin)}
            </div>

            <div className="form-group">
              <label>State</label>
              {renderEditableField("state", "State")}
            </div>

            <div className="form-group">
              <label>Country</label>
              {renderEditableField("country", "Country")}
            </div>

            <div className="form-group">
              <label>Pincode</label>
              {renderEditableField("pincode", "Pincode")}
            </div>
          </div>
        </div>

        <div className="card-section resume-section">
          <h3>
            <FiFile /> Resume
          </h3>
          <div className="resume-upload">
            {userData.resume ? (
              <div className="resume-info">
                <FiFile className="resume-icon" />
                <span className="resume-name">
                  {typeof userData.resume === "string"
                    ? userData.resume
                    : userData.resume.name}
                </span>
              </div>
            ) : (
              <div className="no-resume">No resume uploaded</div>
            )}
            <div className="file-upload-wrapper">
              <label htmlFor="resume" className="file-upload-label">
                {userData.resume ? "Update Resume" : "Upload Resume"}
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="danger-zone">
        <h3>
          <FiTrash2 /> Danger Zone
        </h3>
        <p>Permanently delete your account and all associated data.</p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="delete-account-btn"
        >
          <FiTrash2 /> Delete Account
        </button>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Delete Account</h3>
            <p>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <p>Please enter your password to confirm:</p>
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter your password"
              className="password-input"
            />
            {deleteError && <div className="delete-error">{deleteError}</div>}
            <div className="modal-buttons">
              <button onClick={handleDeleteAccount} className="confirm-delete">
                Delete Account
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                  setDeleteError("");
                }}
                className="cancel-delete"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEditForm;
