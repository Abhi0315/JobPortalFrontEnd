import axios from "axios";

export const fetchSidebarData = async () => {
  const response = await axios.get("https://prohires.strangled.net/job/sidebar_menu_list");
  return response.data;
};