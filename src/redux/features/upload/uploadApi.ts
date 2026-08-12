import { baseApi } from '../../api/baseApi';

/**
 * Image upload goes through the Express server, which holds the Cloudinary secret.
 * The browser never sees those credentials.
 */
export const uploadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<
      { success: boolean; data: { url: string; public_id: string } },
      { file: File; folder?: string }
    >({
      query: ({ file, folder }) => {
        const formData = new FormData();
        formData.append('file', file);
        if (folder) formData.append('folder', folder);

        return {
          url: '/upload',
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
