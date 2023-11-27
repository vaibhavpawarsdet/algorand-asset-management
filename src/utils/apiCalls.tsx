import axios from 'axios';
import converter from 'xml-js';
// post call
export async function Post(url: string, data: object) {
  try {
    const response = await axios({ method: 'POST', url: url, data: data, headers: { 'Authorization': 'Barer ' + sessionStorage.getItem('token') } })
    return response
  }
  catch (error: any) {
    console.error(error);
    // return error.response
  }
};

// Get by id Call
export async function Get(url: string, id: string) {
  try {
    const response = await axios({ method: 'GET', url: url + id, headers: { 'Authorization': 'Barer ' + sessionStorage.getItem('token') } })
    return response
  }
  catch (error: any) {
    console.error(error);
    // return error.response
  }
};

// Get all Call
export async function GetAll(url: string) {
  try {
    const response = await axios({ method: 'GET', url: url, headers: { 'Authorization': 'Barer ' + sessionStorage.getItem('token') } })
    return response
  }
  catch (error: any) {
    console.error(error.name);
    console.log(error);
    console.error(error.status);

    //  return error.response
  }
};

// put call
export async function Put(url: string, id: string, data: object) {
  try {
    const response = await axios({ method: 'put', url: url + id, data: data, headers: { 'Authorization': 'Barer ' + sessionStorage.getItem('token') } })
    return response
  }
  catch (error: any) {
    console.error(error);
    //  return error.response
  }
};

// delete Call
export async function Delete(url: string, id: string, data?: object) {
  try {
    const response = await axios({ method: 'delete', url: url + id, data: data, headers: { 'Authorization': 'Barer ' + sessionStorage.getItem('token') } })
    return response
  }
  catch (error: any) {
    console.error(error);
    //  return error.response
  }
};
