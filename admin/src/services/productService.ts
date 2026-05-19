import API from "./api";

export const getProducts = async (keyword = '', pageNumber = 1, hidden = false) => {
  const { data } = await API.get(`/products?keyword=${keyword}&pageNumber=${pageNumber}${hidden ? '&hidden=true' : ''}`);
  return data;
};

export const getProduct = async (id: string) => {
  const { data } = await API.get(`/products/${id}`);
  return data;
};

export const createProduct = async (productData: any) => {
  const { data } = await API.post("/products", productData);
  return data;
};

export const updateProduct = async (
  id: string,
  productData: any
) => {
  const { data } = await API.put(
    `/products/${id}`,
    productData
  );

  return data;
};

export const deleteProduct = async (id: string) => {
  const { data } = await API.delete(`/products/${id}`);
  return data;
};

export const getAllReviews = async () => {
  const { data } = await API.get("/products/reviews/all");
  return data;
};

export const deleteReview = async (id: string) => {
  const { data } = await API.delete(`/products/reviews/${id}`);
  return data;
};