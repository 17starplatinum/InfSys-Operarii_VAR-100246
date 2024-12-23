import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {V1APIURL} from "./shared/constants";
import axios from "axios";
import {getAxios} from "./shared/utils";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [hasRequestedAdminRole, setHasRequestedAdminRole] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser();
    }
  }, []);

  const saveCurrentPath = (path) => {
    localStorage.setItem('currentPath', path);
  };

  const getCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await axios.get(`${V1APIURL}/auth/current`, getAxios());

      if (res.status !== 200) {
        throw new Error('Не удалось загрузить данные текущего пользователя.');
      }

      setUser(res.data);
      setRole(res.data.role);
    } catch (error) {
      console.error('Ошибка при получении текущего пользователя:', error);
      logout();
    }
  };

  const login = (token) => {
    const userData = parseJwt(token);
    setUser(userData);
    setRole(userData.role);
    localStorage.setItem('token', token);

    getCurrentUser();

  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setRequestStatus(null);
    setHasRequestedAdminRole(false);
    localStorage.removeItem('token');
    navigate('/');
  };

  const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  };

  const updateUser = async (updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${V1APIURL}/auth/current`, JSON.stringify(updatedData), getAxios());

      if (response !== 200) {
        throw new Error(response.status || 'Ошибка при обновлении данных пользователя');
      }

      const {token: newToken, user: updatedUser} = await response.json();

      localStorage.setItem('token', newToken);

      setUser(updatedUser);

      alert('Имя пользователя успешно обновлено.');
    } catch (error) {
      if (error.message.includes('already exists')) {
        alert('Имя пользователя уже занято. Попробуйте другое.');
      } else if (error.message.includes('Validation failed')) {
        alert('Некорректное имя пользователя. Проверьте формат.');
      } else {
        alert('Не удалось обновить имя пользователя.');
      }
      console.error('Ошибка при обновлении имени пользователя:', error);
    }
  };


  return (
    <UserContext.Provider value={{
      user,
      role,
      login,
      logout,
      requestAdminRole,
      requestStatus,
      hasRequestedAdminRole,
      checkRequestStatus,
      updateUser,
      saveCurrentPath,
    }}>
      {children}
    </UserContext.Provider>
  );
}