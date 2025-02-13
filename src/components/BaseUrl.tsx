export const getBaseUrl = () => {
    const currentUrl = window.location.href;
    if (currentUrl.includes('localhost')) {
        // return 'https://newcrmbackend.ddev.site/api'; 
        return 'http://127.0.0.1:8000/api';
    } else if (currentUrl.includes('test.leadshub.ae')) {
        return 'https://test2.leadshub.ae/api';  
    } else {return 'http://10.99.1.93:8000/api'; 
        return 'https://backend.leadshub.ae/api';  
    }
};