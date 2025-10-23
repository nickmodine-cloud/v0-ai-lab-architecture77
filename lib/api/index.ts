import apiClient from './client';
import { hypothesesAPI } from './hypotheses';
import { experimentsAPI } from './experiments';
import { notificationsAPI } from './notifications';
import { authAPI } from './auth';
import { settingsAPI } from './settings';
import { adminAPI } from './admin';
import { ceoAPI } from './ceo';
import { iamAPI } from './iam';

export const api = {
  hypotheses: hypothesesAPI,
  experiments: experimentsAPI,
  notifications: notificationsAPI,
  auth: authAPI,
  settings: settingsAPI,
  admin: adminAPI,
  ceo: ceoAPI,
  iam: iamAPI,
};

export default apiClient;
export * from './types';