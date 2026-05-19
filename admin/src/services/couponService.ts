import API from "./api";

export interface Coupon {
  _id?: string;
  code: string;
  discount: number;
  expireAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export const couponService = {
  getCoupons: async () => {
    const { data } = await API.get<Coupon[]>("/coupons");
    return data;
  },

  createCoupon: async (couponData: Partial<Coupon>) => {
    const { data } = await API.post<Coupon>("/coupons", couponData);
    return data;
  },

  updateCoupon: async (id: string, couponData: Partial<Coupon>) => {
    const { data } = await API.put<Coupon>(`/coupons/${id}`, couponData);
    return data;
  },

  deleteCoupon: async (id: string) => {
    const { data } = await API.delete<{ message: string }>(`/coupons/${id}`);
    return data;
  },
};
