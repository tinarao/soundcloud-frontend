import axios from "axios";
import { BASIC_API_URL } from "./consts";

class Storage {
  async getAudioFile(slug: string) {
    // http://localhost:5129/api/Track/file/dont-kill-the-party-by-tinarao
    const route = BASIC_API_URL + "track/file/" + slug;
    const response = await axios(route, { validateStatus: () => true });

    return response.data;
  }
}

export const storage = new Storage();
