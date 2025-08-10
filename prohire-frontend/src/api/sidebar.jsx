import axios from "axios";

export const fetchSidebarData = async () => {
  const token = localStorage.getItem("token"); // Get token from storage

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await axios.get(
    "https://prohires.strangled.net/job/sidebar_menu_list",
    {
      headers: {
        Authorization: `Token ${token}`, // Send token in header
      },
      withCredentials: true, // Optional: if cookies/session are used
    }
  );

  return response.data;
};
