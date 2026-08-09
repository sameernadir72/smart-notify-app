import { Platform, PermissionsAndroid } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { api } from '../api/axiosConfig';

async function requestNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
}

async function sendFcmTokenToBackend(fcmToken) {
  if (!fcmToken) return;
  try {
    await api.patch('/users/fcm-token', { fcm_token: fcmToken });
  } catch (error) {
    console.error('Failed to register FCM token with backend', error);
  }
}

export async function registerForPushNotifications() {
  try {
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      console.log('Push notification permission not granted');
      return;
    }

    const fcmToken = await messaging().getToken();
    await sendFcmTokenToBackend(fcmToken);

    messaging().onTokenRefresh(newToken => {
      sendFcmTokenToBackend(newToken);
    });
  } catch (error) {
    console.error('Failed to register for push notifications', error);
  }
}
