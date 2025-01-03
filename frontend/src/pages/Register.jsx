import axios from "axios";
import { useState } from "react";
import { V1APIURL } from "../shared/constants";

export const RegisterPage = ({ setPage, setUser }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const updateForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${V1APIURL}/auth/register`, formData);
      if (res.status !== 200) {
        alert(`Ошибка при регистрации: ${res.statusText}`);
        return false;
      }
      alert("Регистрация произошла успешно.");
      setPage("login")
      return true;
    } catch (error) {
      alert(`Ошибка. ${error.status}: ${error.message}`);
    }
    return false;
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6 col-lg-4 offset-lg-4 offset-md-3 py-5">
          <form onSubmit={submitForm}>
            <div className="mb-4">
              <h2>Регистрация</h2>
            </div>
            <div className="mb-4">
              <label htmlFor="username">Имя пользователя</label>
              <input
                className="form-control"
                name="username"
                type="text"
                onChange={updateForm}
                required={true}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password">Пароль</label>
              <input
                className="form-control"
                name="password"
                type="password"
                onChange={updateForm}
                required={true}
              />
            </div>
            <div className="mb-4 text-center">
              <button className="btn btn-primary" type="submit">
                <i className="fa fa-sign-in"></i>&nbsp;Зарегистрироваться
              </button>
            </div>
          </form>
          <div className="mb-4 text-center">
            <button className="btn btn-link" onClick={() => setPage("login")}>
              <i className="fa fa-user"></i>&nbsp;Войти
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
