import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000/'; // atau sesuai domain kamu
axios.defaults.headers.common['Accept'] = 'application/json';

export default axios;
