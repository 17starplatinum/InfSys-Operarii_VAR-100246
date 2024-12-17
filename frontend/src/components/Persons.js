import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {ColorEnum, CountryEnum, V1APIURL} from "../shared/constants";
import axios from "axios";
import {getAxios, removeKey, removeKeyContains} from "../shared/utils";
import {personSchema, locationSchema} from "./validation/ValidationSchemas";
import {validateFields} from "./validation/Validation";

export const PersonsComponent = ({ setPage }) => {
  const columns = [
    {
      name: "ID",
      selector: (item) => item.id,
    },
    {
      name: "Цвет глаз",
      selector: (item) => item.eyeColor,
    },
    {
      name: "Цвет волос",
      selector: (item) => item.hairColor,
    },
    {
      name: "День рождения",
      selector: (item) => item.birthday,
    },
    {
      name: "Вес",
      selector: (item) => item.weight,
    },
    {
      name: "Национальность",
      selector: (item) => item.nationality,
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
      const res = await axios.get(`${V1APIURL}/people`, getAxios());
      if (res.status !== 200) {
        alert(`Ошибка: ${res.statusText}`);
        return false;
      }
      setItems(res.data?.content || []);
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
        `${V1APIURL}/people/${item.id}`,
        getAxios()
      );
      if (res.status !== 204) {
        alert(`Ошибка: ${res.statusText}`);
        return false;
      }
      alert("Человек успешно удален.");
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
    return <PersonsFormComponent closeForm={closeForm} item={item} />;
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2>
            Человеки{" "}
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

export const PersonsFormComponent = ({ closeForm, item }) => {
  let [formData, setFormData] = useState({
    eyeColor: "BLACK",
    hairColor: null,
    birthday: null,
    weight: 1,
    nationality: "UNITED_KINGDOM",
    location: { x: 0, y: 0, z: 0 },
    useExistingLocation: false
  });
  const [errors, setErrors] = useState([]);
  let Validator = require('jsonschema').Validator;
  let v = new Validator();
  let schemas = [locationSchema, personSchema];
  schemas.forEach(schema => v.addSchema(schema, schema.id));

  const [locationsList, setLocationsList] = useState([]);

  useEffect(() => {}, []);

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    }
  }, [item]);

  useEffect(() => {
    if (formData.useExistingLocation && locationsList.length === 0) {
      getLocations();
    }
  }, [formData.useExistingLocation, locationsList.length]);

  const getLocations = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common = {
        "Authorization": `Bearer ${token}`
      };
      const response = await axios.get(`${V1APIURL}/locations`, getAxios());
      setLocationsList(response.data.content || []);
    } catch (error) {
      alert("Возникла ошибка при получении локации: ", error);
    }
  };

  const handleObjectSelect = (objectProperty, value, list) => {
    const focusedObject = list.find(obj => obj.id === Number(value));
    setFormData(prevState => ({
      ...prevState,
      location: focusedObject
    }));
    setErrors(prevErrors => ({...prevErrors, location: ""}))
  };

  const validatePerson = () => {
    let errorMsg = validateFields(v, formData,  schemas[1], true);
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

  const updateFields = (field, value, schema) => {
    setFormData({ ...formData, [field]: value });
    let errorMsg = validateFields(v, value, schema).toString();
    if (errorMsg !== '') {
      setErrors(prevErrors => ({
        ...prevErrors,
        [`$person_${field}`]: errorMsg
      }));
    }
  };

  const updateObjects = (objectProperty, field, value, schema) => {
    value = Number(value);
    setFormData(prevState => ({
      ...prevState,
      location: {
        ...prevState.location,
        [field]: value
      }
    }));
    let errorMsg = validateFields(v, value, schema).toString();
    if(errorMsg !== '') {
      setErrors(prevErrors => ({
        ...prevErrors,
        [`${objectProperty}_${field}`]: errorMsg
      }));
    }
  }

  const submitForm = async (e) => {
    e.preventDefault();
    const isValid = validatePerson();
    if (!isValid) {
      alert('Не получилось создать человека.');
      return;
    }
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common = {
        'Authorization': `Bearer ${token}`
      };
      formData = removeKey(formData, "authorities");
      removeKeyContains("useExisting");
      const res = await axios[item? "put" : "post"](
        `${V1APIURL}/people${item ? `/${item.id}` : ""}`,
        formData,
        getAxios()
      );
      if (!(res.status === 200 || res.status === 201)) {
        alert(`Ошибка: ${res.statusText}`);
        return false;
      }
      alert(`Человек успешно ${item ? "обновлен" : "создан"}.`);
      closeForm(true);
    } catch (error) {
      alert(`Ошибка! ${error.status}: ${error.message}`);
    }
    return false;
  };

  return (
    <div className="container py-5">
      <div className="row">
        <h2>{item ? "Редактировать" : "Создать"}{" человека"}</h2>
        <div className="col-12">
            <form onSubmit={(e) => submitForm(e)}>
              <div className="py-5">
                <label htmlFor="person_eyeColor">
                  Цвет глаз
                  <select className="dropdown-menu-dark"
                          name="person_eyeColor"
                          onChange={(e) => updateFields("eyeColor", e.target.value, schemas[1].properties.eyeColor)}
                          value={formData.eyeColor}>
                    <option className="dropdown-item" value={ColorEnum.GREEN}>Зеленый</option>
                    <option className="dropdown-item" value={ColorEnum.BLACK}>Черный</option>
                    <option className="dropdown-item" value={ColorEnum.BLUE}>Синий</option>
                    <option className="dropdown-item" value={ColorEnum.ORANGE}>Оранжевый</option>
                  </select>
                </label>
                {errors.person_eyeColor && <span className="error">{errors.person_eyeColor}</span>}
                <label htmlFor="person_hairColor">
                  Цвет волос
                  <select className="dropdown-menu-dark"
                          name="person_hairColor"
                          onChange={(e) => updateFields("hairColor", e.target.value, schemas[1].properties.hairColor)}
                          value={formData.hairColor ?? ''}>
                    <option className="dropdown-item" value={''}>Выбрать...</option>
                    <option className="dropdown-item" value={ColorEnum.GREEN}>Зеленый</option>
                    <option className="dropdown-item" value={ColorEnum.BLACK}>Черный</option>
                    <option className="dropdown-item" value={ColorEnum.BLUE}>Синий</option>
                    <option className="dropdown-item" value={ColorEnum.ORANGE}>Оранжевый</option>
                  </select>
                </label>
                {errors.person_hairColor && <span className="error">{errors.person_hairColor}</span>}
                <fieldset>
                  <h4>Локация</h4>
                  <label className="radio-label">
                    <span>Создать новую</span>
                    <input
                        type="radio"
                        name="locationOption"
                        checked={!formData.useExistingLocation}
                        onChange={() => updateFields('useExistingLocation', false, schemas[1].properties.useExistingLocation)}
                    />
                  </label>
                  {!formData.useExistingLocation && (
                      <div className="mb-4">
                        <label htmlFor="person_location_x">
                          X
                          <input
                              className="form-control"
                              name="person_location_x"
                              type="number"
                              onChange={(e) => updateObjects("location", "x", e.target.value, schemas[0].properties.x)}
                              value={formData.location.x}
                          />
                          {errors.location_x && <span className="error">{errors.location_x}</span>}
                        </label>
                        <label htmlFor="person_location_y">
                          Y
                          <input
                              className="form-control"
                              name="person_location_y"
                              type="number"
                              onChange={(e) => updateObjects("location", "y", e.target.value, schemas[0].properties.y)}
                              value={formData.location.y}
                          />
                          {errors.location_y && <span className="error">{errors.location_y}</span>}
                        </label>
                        <label htmlFor="person_location_z">
                          Z
                          <input
                              className="form-control"
                              name="person_location_z"
                              type="number"
                              onChange={(e) => updateObjects("location", "z", e.target.value, schemas[0].properties.z)}
                              value={formData.location.z}
                          />
                          {errors.location_z && <span className="error">{errors.location_z}</span>}
                        </label>
                      </div>
                  )}
                  <label className="radio-label">
                    <span>Выбрать существующего</span>
                    <input
                        type="radio"
                        name="locationOption"
                        checked={formData.useExistingLocation}
                        onChange={() => updateFields("useExistingLocation", true, schemas[1].properties.useExistingLocation)}
                    />
                  </label>
                  {formData.useExistingLocation && (
                      <select
                          onChange={(e) => handleObjectSelect("location", e.target.value, locationsList)}
                          required
                      >
                        Доступные локации
                        {locationsList.map((location) => (
                            <option key={location.id} value={location.id}>
                              ID: {location.id}, X: {location.x}, Y: {location.y}, Z: {location.z}
                            </option>
                        ))}
                      </select>
                  )}
                  {errors.location && <span className="error">{errors.location}</span>}
                </fieldset>
                <label htmlFor="person_birthday">
                  День рождения
                  <input
                      className="form-control"
                      name="person_birthday"
                      type="date"
                      onChange={(e) => updateFields("birthday", e.target.value, schemas[1].properties.birthday)}
                      value={formData.birthday}
                  />
                  {errors.person_birthday && <span className="error">{errors.person_birthday}</span>}
                </label>
                <label htmlFor="person_weight">
                  Вес
                  <input
                      className="form-control"
                      name="person_weight"
                      type="number"
                      step={0.01}
                      onChange={(e) => updateFields("weight", e.target.value, schemas[1].properties.weight)}
                      value={formData.weight}
                  />
                  {errors.person_weight && <span className="error">{errors.person_weight}</span>}
                </label>
                <label htmlFor="person_nationality">
                  Национальность
                  <select className="dropdown-menu-dark"
                          name="person_nationality"
                          onChange={(e) => updateFields("nationality", e.target.value, schemas[1].properties.nationality)}
                          value={formData.nationality}>
                    <option className="dropdown-item" value={CountryEnum.UNITED_KINGDOM}>Великобритания
                    </option>
                    <option className="dropdown-item" value={CountryEnum.FRANCE}>Франция</option>
                    <option className="dropdown-item" value={CountryEnum.NORTH_KOREA}>Северная Корея</option>
                  </select>
                  {errors.person_nationality && <span className="error">{errors.person_nationality}</span>}
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
