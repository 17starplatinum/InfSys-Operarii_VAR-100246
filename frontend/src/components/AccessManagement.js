import {useEffect, useState} from "react";
import DataTable from "react-data-table-component";
import {V1APIURL} from "../shared/constants";
import axios from "axios";
import {getAxios} from "../shared/utils";

export const AccessManagement = ({ setPage }) => {
  const columns = [
    {
      name: "ID",
      selector: (item) => item.id,
    },
    {
      name: "Пользователь",
      selector: (item) => item.username,
    },
    {
      name: "Действия",
      grow: 1,
      cell: (item) => (
        <div className="">
          <button
            className="btn btn-primary mx-2"
            onClick={() => approve(item)}
          >
            <i className="fa fa-edit"></i>
          </button>
          <button className="btn btn-danger" onClick={() => reject(item)}>
            <i className="fa fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      let token = localStorage.getItem("token");
      axios.defaults.headers.common = {
        "Authorization": `Bearer ${token}`
      }
      const res = await axios.get(`${V1APIURL}/auth/admin-requests`, getAxios());
      if (res.status !== 200) {
        alert(`Ошибка: ${res.statusText}`);
        return false;
      }
      setItems(res.data || []);
    } catch (error) {
      alert(`Ошибка! ${error.status}: ${error.message}`);
    }
  };

  const reject = async (item) => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common = {
        "Authorization": `Bearer ${token}`
      };
      const res = await axios.post(
        `${V1APIURL}/auth/reject-admin/${item.id}`,
        getAxios()
      );
      if (res.status !== 200) {
        alert(`Ошибка: ${res.statusText}`);
        return false;
      }
      alert("Пользователь успешно отклонен.");
      loadItems();
    } catch (error) {
      alert(`Ошибка! ${error.status}: ${error.message}`);
    }
  };

  const approve = async (item) => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common = {
        "Authorization": `Bearer ${token}`
      };
      const res = await axios.post(
        `${V1APIURL}/auth/approve-admin/${item.id}`,
        getAxios()
      );
      if (res.status !== 200) {
        alert(`Ошибка: ${res.statusText}`);
        return false;
      }
      alert("Пользователь успешно допущен.");
      loadItems();
    } catch (error) {
      alert(`Ошибка! ${error.status}: ${error.message}`);
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2>Access Management</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <DataTable columns={columns} data={items} pagination />
        </div>
      </div>
    </div>
  );
};

export const RequestAdminAccess = ({ setPage }) => {
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common = {
        "Authorization": `Bearer ${token}`
      };
      const res = await axios.post(
        `${V1APIURL}/auth/request-admin`,
        getAxios()
      );
      if (!(res.status === 200 || res.status === 201)) {
        alert(`Ошибка: ${res.statusText}`);
        return false;
      }
      alert(`Запрос успешно отправлен. Дождитесь отмашки админа.`);
      setPage(true);
    } catch (error) {
      alert(`Ошибка! ${error.status}: ${error.message}`);
    }
    return false;
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2>Запрос для прав админа</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <form onSubmit={submitForm}>
            <div className="mb-4">
              <button className="btn btn-primary" type="submit">
                <i className="fa fa-send"></i>&nbsp;Спросить за доступ
              </button>
              <button
                className="btn btn-secondary mx-2"
                type="button"
                onClick={() => setPage("dashboard")}
              >
                <i className="fa fa-cancel"></i>&nbsp;Отменить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
