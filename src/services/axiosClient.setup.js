import axios from "axios";
import { toast } from "react-toastify";

// const BEARER = "BEARER "
export const baseUrl = "http://27.76.236.63:9999"

const axiosClient = axios.create({
  headers: {
    "Content-Type": "application/json",
    // Authorization:
    //   window.location.origin.includes('localhost') ? (BEARER + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImQ4ZGM4ODQ2LWY2NjQtNDliNC1iYTExLTA1NjJjZjliMWI5ZiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJuZ2FuaHQiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL2FjY2Vzc2NvbnRyb2xzZXJ2aWNlLzIwMTAvMDcvY2xhaW1zL2lkZW50aXR5cHJvdmlkZXIiOiJBU1AuTkVUIElkZW50aXR5IiwiQXNwTmV0LklkZW50aXR5LlNlY3VyaXR5U3RhbXAiOiI0MWM2M2U0NC1kNThiLTQwMzEtOTUwNC00YzkxZDYxOWQ3ODIiLCJTZWN1cml0eVN0YW1wIjoiNDFjNjNlNDQtZDU4Yi00MDMxLTk1MDQtNGM5MWQ2MTlkNzgyIiwibmJmIjoxNjY1MTkyNDk4LCJleHAiOjE2NjUyNzg4OTgsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MTEyMDEvIiwiYXVkIjoiMDk5MTUzYzI2MjUxNDliYzhlY2IzZTg1ZTAzZjAwMjIifQ.xIkPbb0iBfL7rW71ZOCyhg7938qou3301fedYcP6lgU") : '',
  },
  // baseURL: window.location.origin.includes('localhost') ? `http://eos.harmonyes.com.vn:1888/` : ``,
  // baseURL: `http://localhost:9999/`,
  baseURL: baseUrl,
  // baseURL: `http://localhost:1062/`,
  withCredentials: true,
});
axiosClient.interceptors.response.use(
  (res) => {
    return res.data
  },
  (er) => {
    toast.error('Có lỗi xảy ra trong quá trình xử lý vui lòng liên hệ kỹ thuật!')
  }
);
export default axiosClient;
