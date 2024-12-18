export const getBaseUrl = () => {
    const currentUrl = window.location.href;
    if (currentUrl.includes('localhost')) {
        return 'https://newcrmbackend.ddev.site/api'; 
    } else if (currentUrl.includes('test.leadshub.ae')) {
        return 'https://test_backend.leadshub.ae/api';  
    } else {
        return 'https://backend.leadshub.ae/api';  
    }
};