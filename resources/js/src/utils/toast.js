import toast from 'react-hot-toast';

export const showSuccess = (message) => {
  toast.success(message, {
    style: {
      background: '#16a34a', // hijau
      color: '#fff',
      borderRadius: '8px',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#16a34a',
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    style: {
      background: '#dc2626', // merah
      color: '#fff',
      borderRadius: '8px',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#dc2626',
    },
  });
};

export const showInfo = (message) => {
  toast(message, {
    style: {
      background: '#2563eb', // biru
      color: '#fff',
      borderRadius: '8px',
    },
  });
};
