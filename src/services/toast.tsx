import Swal from 'sweetalert2';
const Toast = () => {
    const toast = Swal.mixin({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 5000,
        showCloseButton: true,
        timerProgressBar: true,
    });
    const success = (message: string) => {
        toast.fire({
            icon: 'success',
            title: message,
        });
    };
    const error = (message: string) => {
        toast.fire({
            icon: 'error',
            title: message,
        });
    };
    const info = (message: string) => {
        toast.fire({
            icon: 'info',
            title: message,
        });
    };
    const warning = (message: string) => {
        toast.fire({
            icon: 'warning',
            title: message,
        });
    };

    return { success, error, info, warning };
};

export default Toast;
