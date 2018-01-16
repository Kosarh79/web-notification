const featureDetection = function featureDetection() {
  if (!('serviceWorker' in navigator)) {
    // Service Worker isn't supported on this browser, disable or hide UI.
    return false;
  }

  if (!('PushManager' in window)) {
    // Push isn't supported on this browser, disable or hide UI.
    return false;
  }
  return true;
};

const urlBase64ToUint8Array = function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

const getSWRegistration = function getSWRegistration() {
  return navigator.serviceWorker.register('service_worker.js').then((registration) => {
    console.log('Service worker successfully registered.');
    console.info(registration);
    return registration;
  }).catch((err) => {
    console.error('Unable to register service worker.', err);
  });
};

const askPermission = function askPermission() {
  return new Promise(function(resolve, reject) {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function(permissionResult) {
    if (permissionResult !== 'granted') {
      throw new Error('We weren\'t granted permission.');
    }
  });
};

const getNotificationPermissionState = function getNotificationPermissionState() {
  if (navigator.permissions) {
    return navigator.permissions.query({name: 'notifications'}).then((result) => {
      console.info(result);
      return result.state;
    });
  }

  return new Promise((resolve) => {
    resolve(Notification.permission);
  });
}

const subscribeUserToPush = function subscribeUserToPush(action) {
  return getSWRegistration()
  .then(registration => {
    if(action === 'unsubscribe'){
      return registration.pushManager.getSubscription()
      .then(subscription => {
        return subscription.unsubscribe()
        .then(result =>{
          console.log('unsubscribed ' + result);
        });
      });
    }
    else {
      const public_key = 'BIw61P6Lu0WTAsfksy3qBUc4wg295qUNDbU1LEHVdXjoSpTdYdLdnbZvrdvqO58sVLOBRZ41IYlSWXM_Yk_Hy00';
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(public_key)
      };
      return registration.pushManager.subscribe(subscribeOptions)
      .then(function(pushSubscription) {
        console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
        return pushSubscription;
      });
    }
  });
};
if (featureDetection()) {
  //notification();
  //askPermission();
  //  getNotificationPermissionState();
  getNotificationPermissionState();
  subscribeUserToPush();
}
