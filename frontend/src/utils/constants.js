export const API_URL = "https://farmer-and-buyer-web-app-deploy.onrender.com/api";

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
};

export const ORDER_STATUS_LABELS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
  COMPLETED: 'Completed'
};

export const ORDER_STATUS_COLORS = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  REJECTED: 'danger',
  CANCELLED: 'secondary',
  COMPLETED: 'success'
};

export const ROLES = {
  FARMER: 'FARMER',
  BUYER: 'BUYER'
};