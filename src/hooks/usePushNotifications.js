import { useEffect } from 'react';

/**
 * Registers for push notifications on native iOS/Android.
 * Silently skips on web (Vercel) where the plugin is unavailable.
 */
export function usePushNotifications() {
  useEffect(() => {
    async function register() {
      try {
        const { PushNotifications } = await import('@capacitor/push-notifications');

        // Check/request permission
        let permStatus = await PushNotifications.checkPermissions();
        if (permStatus.receive === 'prompt') {
          permStatus = await PushNotifications.requestPermissions();
        }
        if (permStatus.receive !== 'granted') return;

        // Register with APNS / FCM
        await PushNotifications.register();

        // Log token (in production send this to your backend)
        PushNotifications.addListener('registration', (token) => {
          console.log('[Push] Device token:', token.value);
        });

        PushNotifications.addListener('registrationError', (err) => {
          console.warn('[Push] Registration error:', err.error);
        });

        // Handle foreground notifications
        PushNotifications.addListener('pushNotificationReceived', (notification) => {
          console.log('[Push] Received:', notification);
        });

        // Handle notification tap (app was backgrounded)
        PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
          console.log('[Push] Action performed:', action);
        });
      } catch {
        // Plugin not available on web — silently skip
      }
    }

    register();
  }, []);
}
