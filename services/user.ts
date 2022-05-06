import axios from "axios";

class UserService {
  public END_POINT: string;

  constructor() {
    this.END_POINT = `user/`;
  }

  async get(id: string) {
    try {
      const res = await axios.get(this.END_POINT + id);

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  async getAll(role: string) {
    try {
      const res = await axios.get(this.END_POINT + `role/${role}`);

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  async post(role: string, formData: FormData) {
    try {
      let data: any = {};
      formData.forEach((value, key) => (data[key] = value));

      const res = await axios.post(this.END_POINT + role, data);

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  async put(formData: FormData, id: string) {
    try {
      let data: any = {};
      formData.forEach((value, key) => (data[key] = value));

      const res = await axios.put(this.END_POINT + id, data);

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  async putStatus(aktif: boolean, id: string) {
    try {
      const res = await axios.put(this.END_POINT + "status/" + id, { aktif });

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }

  async delete(id: string) {
    try {
      const res = await axios.delete(this.END_POINT + id);

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
}

export default new UserService();
