import React, {useState, useEffect} from "react";
import axios from "axios";
import {getAxios} from "../shared/utils";
import {V1APIURL} from "../shared/constants";
import DataTable from "react-data-table-component";

export const ImportHistoryComponent = ({ setPage, admin }) => {
  const columns = [
    {
      name: "ID",
      selector: (item) => item.id,
    },
    {
      name: "Статус",
      selector: (item) => item.status,
    },
    {
      name: "Добавлено объектов",
      selector: (item) => item.addedObjectsCount,
    },
    {
      name: "Пользователь",
      selector: (item) => item.username,
    },
    {
      name: "Дата и время",
      selector: (item) => new Date(item.timestamp).toLocaleString(),
    },
    {
      name: "Файл",
      selector: (item) => item.downloadUrl ? (
        <a href={item.downloadUrl} target="_blank" rel="noopener noreferrer">
          Скачать
        </a>
      ) : (
        <span>Нет файла</span>
      )
    }
  ];
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [item, setItem] = useState();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      let res;
      const currentUser = await axios.get(`${V1APIURL}/auth/current`, getAxios());
      if(!admin) {
        res = await axios.get(`${V1APIURL}/import/history`, getAxios());
      } else {
        res = await axios.get(`${V1APIURL}/import/history?userId=${currentUser.data.id}`, getAxios());
      }

      if (currentUser.data.role !== 'ADMIN') {
        res.data.filter((operation) => operation.username = currentUser.data.username)
      }
      if (res.status !== 200) {
        alert(`Ошибка: ${res.statusText}`);
        return false;
      }
      setItems((res.data || []));
    } catch (error) {
      alert(`Ошибка! ${error.status}: ${error.message}`);
    }
  };

  const closeForm = (data) => {
    if (data) {
      loadItems();
    }
    setShowForm(false);
  };

  const addItem = () => {
    setItem(null);
    setShowForm(true);
  };

  if (showForm) {
    return <ImportOperationComponent closeForm={closeForm} item={item} />;
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2>
            Импорты{" "}
            <button className="btn btn-primary float-end" onClick={addItem}>
              <i className="fa fa-add"></i>&nbsp;Импортировать
            </button>
          </h2>
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

export const ImportOperationComponent = ({closeForm}) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Пожалуйста, выберите файл для импорта.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      setError('');
      const token = localStorage.getItem('token');
      axios.defaults.headers.common = {
        'Authorization': `Bearer ${token}`
      }
      const res = await axios.post(`${V1APIURL}/import`, formData, getAxios());
      if (res.status !== 200) {
        alert(`Ошибка: ${res.statusText}`);
        return false;
      }

      const addedObjects = res.addedObjectsCount || 0;
      alert(`Импорт выполнен успешно! Добавлено объектов: ${addedObjects}`);
      closeForm(true);
    } catch (err) {
      console.error('Ошибка:', err);
      setError(`Не удалось импортировать файл. Причина: ${err.message}`);
    }
  };
  return (
    <div className="container py-5">
      <div className="container-md">
        <h2>Импорт работников</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Выберите файл (.json):
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
            />
          </label>
          {error && <span className="error">{error}</span>}
          <div className="button-group">
            <button className="btn btn-primary" type="submit">
              <i className="fa fa-send"></i>&nbsp;Отправить
            </button>
            <button
              className="btn btn-secondary mx-2"
              type="button"
              onClick={() => closeForm(null)}
            >
              <i className="fa fa-cancel"></i>&nbsp;Отменить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};