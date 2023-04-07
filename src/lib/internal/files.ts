export const getUserAvatarURL = (id: string, avatar: string) => `http://127.0.0.1:8090/api/files/_pb_users_auth_/${id}/${avatar}`;
export const getVendorAvatarURL = (id: string, avatar: string) => `http://127.0.0.1:8090/api/files/vendors/${id}/${avatar}`;
export const getProductsAvatarURL = (id: string, avatar: string) => `http://127.0.0.1:8090/api/files/products/${id}/${avatar}`;