export const getBaseUrl = () => {
  const currentUrl = window.location.href;
  if (currentUrl.includes('localhost')) {
    return 'http://10.99.1.93:8000/api';
    // return 'http://10.99.1.56:8000/api';
    return 'https://newcrmbackend.ddev.site/api';
    return 'http://10.99.1.53:8000/api';
  } else if (currentUrl.includes('testcrm.leadshub.ae')) {
    return 'https://testcrmbackend.leadshub.ae/api';
  } else if (currentUrl.includes('leadshub.ae')) {
    return 'https://backend.leadshub.ae/api';
  } else {
    return 'http://10.99.1.93:8000/api';
  }
};
