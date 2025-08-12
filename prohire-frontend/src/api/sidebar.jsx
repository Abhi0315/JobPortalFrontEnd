import axios from "axios";

export const fetchSidebarData = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await axios.get(
    "https://prohires.strangled.net/job/sidebar_menu_list",
    {
      headers: {
        Authorization: `Token ${token}`,
      },
      withCredentials: true,
    }
  );

  return response.data;
};
