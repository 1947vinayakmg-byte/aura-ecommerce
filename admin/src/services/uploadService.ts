import API from "./api";


export const uploadImage =
  async (file: File) => {

    const formData =
      new FormData();

    formData.append(
      "image",
      file
    );

    const { data } =
      await API.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

    return data.imageUrl;
};

export const uploadMultipleImages = async (files: FileList) => {
  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.append("images", files[i]);
  }

  const { data } = await API.post(
    "/upload/multiple",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data.imageUrls;
};