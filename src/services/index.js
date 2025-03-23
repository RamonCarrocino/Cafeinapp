import {createContext, useContext} from 'react';
import axios from 'axios';

import {config} from '../assets/others';

export const Context = createContext();
export const useAuth = () => useContext(Context);

const api = axios.create({
  timeout: 30000,
  baseURL: config.baseUrl,
});

export {api};
