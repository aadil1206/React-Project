import axios from 'axios';
const HOST = import.meta.env.VITE_USER_API;

export const adminLogin = async function (data) {
  return await axios.post(HOST + '/admin/sign-in', data);
};

export const userForgotPassword = async function (data) {
  return await axios.post(HOST + '/admin/forgot-password-mail?email=' + data);
};

export const userResetpassword = async function (data) {
  return await axios.post(HOST + '/admin/reset-password', data);
};
