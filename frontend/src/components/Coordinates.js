import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { V1APIURL } from "../shared/constants";
import axios from "axios";
import {getAxios, removeKey} from "../shared/utils";
import {coordinatesSchema} from "./validation/ValidationSchemas";
import {validateFields} from "./validation/Validation";

export const CoordinatesComponent = ({ setPage }) => {
  const columns = [
    {
      name: "ID",
      selector: (item) => item.id,
    },
    {
      name: "X",
      selector: (item) => item.x,
    },
    {
      name: "Y",
      selector: (item) => item.y,
    },
    {
      name: "Действия",
      grow: 1,
      cell: (item) => (
        <div className="">
          <button
            className="btn btn-primary mx-2"
            onClick={() => editItem(item)}
          >
            <i className="fa fa-edit"></i>
          </button>
          <button className="btn btn-danger" onClick={() => deleteItem(item)}>
            <i className="fa fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [item, setItem] = useState();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await axios.get(`${V1APIURL}/coordinates`, getAxios());
      if (res.status !== 200) {
        alert(`Ошибка: ${res.statusText}`);
        return false;
      }
      setItems((res.data?.content || []));
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

  const editItem = (item) => {
    setItem(item);
    setShowForm(true);
  };

  const deleteItem = async (item) => {
    try {
      const res = await axios.delete(
        `${V1APIURL}/coordinates/${item.id}`,
        getAxios()
      );
      if (res.status !== 204) {
        alert(`Ошибка: ${res.statusText}`);
        return false;
      }
      alert("Координаты успешно удалены.");
      await loadItems();
    } catch (error) {
      alert(`Ошибка! ${error.status}: ${error.message}`);
    }
  };

  const addItem = () => {
    setItem(null);
    setShowForm(true);
  };

  if (showForm) {
    return <CoordinatesFormComponent closeForm={closeForm} item={item} />;
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2>
            Coordinates{" "}
            <button className="btn btn-primary float-end" onClick={addItem}>
              <i className="fa fa-add"></i>&nbsp;Add
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

export const CoordinatesFormComponent = ({ closeForm, item }) => {
  let [formData, setFormData] = useState({ x: 0, y: 0 });
  const [errors, setErrors] = useState([]);
  let Validator = require('jsonschema').Validator;
  let v = new Validator();
  v.addSchema(coordinatesSchema, coordinatesSchema.id);

  useEffect(() => {
  }, []);

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    }
  }, [item]);

  const validateCoordinates = () => {
    let errorMsg = validateFields(v, formData,  coordinatesSchema, true);
    if(errorMsg.length === 0) {
      return true;
    }
    setErrors(prevState => ({
      ...prevState,
      [errorMsg]: errorMsg
    }))
    console.log(errorMsg);
    return false;
  }

  const updateForm = (field, value, schema) => {
    value = Number(value);
    setFormData({...formData, [field]: value});
    let errorMsg = validateFields(v, value, schema).toString();
    if (errorMsg !== '') {
      setErrors(prevErrors => ({
        ...prevErrors,
        [`$coordinates_${field}`]: errorMsg
      }));
    }
  }

  const submitForm = async (e) => {
    e.preventDefault();
    const isValid = validateCoordinates();
    if (!isValid) {
      alert('Не получилось создать Coordinates.');
      return;
    }
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common = {
        'Authorization': `Bearer ${token}`
      };
      formData = removeKey(formData, "authorities");
      const res = await axios[item? "put" : "post"](
        `${V1APIURL}/coordinates${item ? `/${item.id}` : ""}`,
        formData,
        getAxios()
      );
      if (!(res.status === 200 || res.status === 201)) {
        alert(`Ошибка: ${res.statusText}`);
        return false;
      }
      alert(`Координаты ${item ? "обновлены" : "созданы"}.`);
      closeForm(true);
    } catch (error) {
      alert(`Ошибка! ${error.status}: ${error.message}`);
    }
    return false;
  };

  return (
    <div className="container py-5">
      <div className="row">
        <h2>{item ? "Редактировать" : "Добавить"}{" координат"}</h2>
        <div className="col-12">
          <form onSubmit={(e) => submitForm(e)}>
            <div className="py-5">
              <label htmlFor="coordinates_x">X
                  <input
                      className="form-control"
                      name="coordinates_x"
                      type="number"
                      onChange={(e) => updateForm("x", e.target.value, coordinatesSchema.properties.x)}
                      value={formData.x}
                      step={0.01}
                      max={990}
                  />
                {errors.coordinates_x && <span className="error">{errors.coordinates_x}</span>}
              </label>
              <label htmlFor="coordinates_y">Y
                  <input
                      className="form-control"
                      name="coordinates_y"
                      type="number"
                      onChange={(e) => updateForm("y", e.target.value, coordinatesSchema.properties.y)}
                      value={formData.y}
                      max={27}
                  />
                {errors.coordinates_y && <span className="error">{errors.coordinates_y}</span>}
              </label>
              <div className="mb-4">
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
