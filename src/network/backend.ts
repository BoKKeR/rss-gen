import axios from "axios";
import Cookies from "js-cookie";

const backend = {
  getRss: async () => {
    const response = await axios.get("/api/rss", {
      params: { user: Cookies.get("user") }
    });
    return response;
  },
  addRss: async (content: any) => {
    const response = await axios.post("/api/rss", content, {
      params: { user: Cookies.get("user") }
    });
    return response;
  },
  clearRss: async () => {
    const response = await axios.delete("/api/rss", {
      params: { user: Cookies.get("user") }
    });
    return response;
  },

  getUUID: async () => {
    const response = await axios.get("/api/uuid");
    return response;
  }
};

export default backend;
