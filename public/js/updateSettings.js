/* eslint-disable */
import axios from 'axios';
import { showAlert } from "./alert";

export const updateSettings = async (data, type) => {
  try {
    // Determine the URL based on the type of update (password or other settings)
    const url = type === 'password' 
        ? '/api/v1/users/updateMyPassword' 
        : '/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      // window.setTimeout(() => {
      //   location.reload(true); // Reload the page to reflect changes
      // }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
