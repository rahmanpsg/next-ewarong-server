import axios from "axios";
class PesananService {
  public END_POINT: string;

  constructor() {
    this.END_POINT = "pesanan/";
  }

  async getAllTransaksi(
    role: string,
    id: string,
    tahun?: number,
    bulan?: number
  ) {
    try {
      const res = await axios.get(
        this.END_POINT + `selesai/${role}/${id}?tahun=${tahun}&bulan=${bulan}`
      );

      return res.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
}

export default new PesananService();
