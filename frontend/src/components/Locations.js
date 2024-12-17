import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { V1APIURL } from "../shared/constants";
import axios from "axios";
import {getAxios} from "../shared/utils";
import {locationSchema} from "./validation/ValidationSchemas";
import {validateFields} from "./validation/Validation";

export const LocationsComponent = ({ setPage }) => {
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
      name: "Z",
      selector: (item) => item.z,
    },
    {
      name: "Действия",
      grow: 1,
      cell: (item) => (
        <>
          <button
            className="btn btn-primary mx-2"
            onClick={() => editItem(item)}
          >
            <i className="fa fa-edit"></i>
          </button>
          <button className="btn btn-danger" onClick={() => deleteItem(item)}>
            <i className="fa fa-trash"></i>
          </button>
        </>
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
      const res = await axios.get(`${V1APIURL}/locations`, getAxios());
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
        `${V1APIURL}/locations/${item.id}`,
        getAxios()
      );
      if (res.status !== 204) {
        alert(`Ошибка: ${res.statusText}`);
        return false;
      }
      alert("Локация успешно удалена.");
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
    return <LocationsFormComponent closeForm={closeForm} item={item} />;
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2>
            Locations{" "}
            <button className="btn btn-primary float-end" onClick={addItem}>
              <i className="fa fa-add"></i>&nbsp;Добавлять
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

export const LocationsFormComponent = ({ closeForm, item }) => {
  let [formData, setFormData] = useState({x: 0, y: 0, z: 0});
  const [errors, setErrors] = useState([]);

  let Validator = require('jsonschema').Validator;
  let v = new Validator();
  v.addSchema(locationSchema, locationSchema.id);

  useEffect(() => {
  }, []);

  useEffect(() => {
    if (item) {
      setFormData({...item});
    }
  }, [item]);

  const validateLocation = () => {
    let errorMsg = validateFields(v, formData,  locationSchema, true);
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
        [`$location_${field}`]: errorMsg
      }));
    }
  }

    const submitForm = async (e) => {
      e.preventDefault();
      const isValid = validateLocation();
      if (!isValid) {
        alert('Не получилось создать локацию.');
        return;
      }
      try {
        const token = localStorage.getItem("token");
        axios.defaults.headers.common = {
          'Authorization': `Bearer ${token}`
        };
        delete formData.createdBy.authorities;
        const res = await axios[item? "put" : "post"](
            `${V1APIURL}/locations${item ?`/${item.id} `: ""}`,
            formData,
            getAxios()
        );
        if (!(res.status === 200 || res.status === 201)) {
          alert(`Ошибка: ${res.statusText}`);
          return false;
        }
        alert(`Локация ${item ? "обновлена" : "удалена"}.`);
        closeForm(true);
      } catch (error) {
        alert(`Ошибка! ${error.status}: ${error.message}`);
      }
      return false;
    };

    return (
        <div className="container py-5">
          <div className="row">
            <h2>{item ? "Edit Location" : "Add Location"}</h2>
            <div className="col-12">
              <form onSubmit={(e) => submitForm(e)}>
                <div className="py-5">
                  <label htmlFor="location_x">
                    X
                    <input
                        className="form-control"
                        name="location_x"
                        type="number"
                        onChange={(e) => updateForm("x", e.target.value, locationSchema.properties.x)}
                        value={formData.x}
                    />
                    {errors.location_x && <span className="error">{errors.location_x}</span>}
                  </label>
                  <label htmlFor="location_y">
                    Y
                    <input
                        className="form-control"
                        name="location_y"
                        type="number"
                        onChange={(e) => updateForm("y", e.target.value, locationSchema.properties.y)}
                        value={formData.y}
                    />
                    {errors.location_y && <span className="error">{errors.location_y}</span>}
                  </label>
                  <label htmlFor="location_z">
                    Z
                    <input
                        className="form-control"
                        name="location_z"
                        type="number"
                        onChange={(e) => updateForm("z", e.target.value, locationSchema.properties.z)}
                        value={formData.z}
                    />
                    {errors.location_z && <span className="error">{errors.location_z}</span>}
                  </label>
                </div>
                <div className="mb-4">
                  <div className="mb-4">
                    <button className="btn btn-primary" type="submit">
                      <i className="fa fa-send"></i>&nbsp;Submit
                    </button>
                    <button
                        className="btn btn-secondary mz-2"
                        type="button"
                        onClick={() => closeForm(null)}
                    >
                      <i className="fa fa-cancel"></i>&nbsp;Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
    );
}
