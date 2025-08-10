import axios from "axios";

export const fetchSidebarData = async () => {
  const response = await axios.get("http://127.0.0.1:8000/job/sidebar_menu_list");
  return response.data;
};