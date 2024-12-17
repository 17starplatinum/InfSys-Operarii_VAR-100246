import {useEffect, useState} from "react";
import DataTable from "react-data-table-component";
import {ColorEnum, CountryEnum, OrganizationEnum, PositionEnum, StatusEnum, V1APIURL} from "../shared/constants";
import axios from "axios";
import {getAxios, removeKey, removeKeyContains} from "../shared/utils";
import {
  addressSchema,
  coordinatesSchema,
  locationSchema,
  organizationSchema,
  personSchema,
  workerSchema
} from "./validation/ValidationSchemas";
import {validateFields} from "./validation/Validation";

export const WorkersComponent = ({setPage}) => {
  const columns = [
    {
      name: "ID",
      selector: (item) => item.id
    },
    {
      name: "Имя",
      selector: (item) => item.name
    },
    {
      name: "Зарплата",
      selector: (item) => item.salary
    },
    {
      name: "Рейтинг",
      selector: (item) => item.rating
    },
    {
      name: "Позиция",
      selector: (item) => item.position
    },
    {
      name: "Статус",
      selector: (item) => item.status
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
      const res = await axios.get(`${V1APIURL}/workers`, getAxios());
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
      const res = await axios.delete(`${V1APIURL}/workers/${item.id}`, getAxios());
      if (res.status !== 204) {
        alert(`Ошибка: ${res.statusText}`);
        return false;
      }
      alert("Работник удален.");
      loadItems();
    } catch (error) {
      alert(`Ошибка! ${error.status}: ${error.message}`);
    }
  };

  const addItem = () => {
    setItem(null);
    setShowForm(true);
  };

  if (showForm) {
    return <WorkersFormComponent closeForm={closeForm} item={item}/>;
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2>
            Workers{" "}
            <button className="btn btn-primary float-end" onClick={addItem}>
              <i className="fa fa-add"></i>&nbsp;Добавлять
            </button>
          </h2>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <DataTable columns={columns} data={items} pagination/>
        </div>
      </div>
    </div>
  );
};

export const WorkersFormComponent = ({closeForm, item}) => {
  let Validator = require('jsonschema').Validator;
  let [formData, setFormData] = useState({
    name: "Random",
    salary: null,
    rating: 1,
    position: "LABORER",
    status: null,
    coordinates: {id: "", x: 0, y: 0},
    organization: null,
    person: {
      id: "",
      eyeColor: "BLACK",
      hairColor: null,
      birthday: null,
      weight: 1,
      nationality: "UNITED_KINGDOM",
      location: {id: "", x: 0, y: 0, z: 0}
    },
    useExistingCoordinates: false,
    useExistingOrganization: false,
    useExistingPerson: false,
    useExistingOfficialAddress: false,
    useExistingPostalAddress: false,
    useExistingLocation: false,
    useExistingOfficialTown: false,
    useExistingPostalTown: false
  });

  let organization = {
    id: "",
    annualTurnover: 1,
    employeesCount: 1,
    fullName: null,
    organizationType: null,
    postalAddress: {id: "", zipCode: "g684grer", town: null},
    officialAddress: {id: "", zipCode: "6weg8we5", town: null},
  };

  const [useOrganization, setUseOrganization] = useState(false);
  const [useOfficialTown, setUseOfficialTown] = useState(false);
  const [usePostalTown, setUsePostalTown] = useState(false);
  let v = new Validator();

  let schemas = [locationSchema, coordinatesSchema, addressSchema, personSchema, organizationSchema, workerSchema];
  schemas.forEach(schema => v.addSchema(schema, schema.id));

  const [coordinatesList, setCoordinatesList] = useState([]);
  const [organizationsList, setOrganizationsList] = useState([]);
  const [peopleList, setPeopleList] = useState([]);
  const [addressesList, setAddressesList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
  }, []);

  useEffect(() => {
    if (item) {
      setFormData({...item});
    }
  }, [item]);

  useEffect(() => {
    if (formData.useExistingCoordinates && coordinatesList.length === 0) {
      getCoordinates();
    }
  }, [formData.useExistingCoordinates, coordinatesList.length]);

  useEffect(() => {
    if (formData.useExistingOrganization && organizationsList.length === 0) {
      getOrganizations();
    }
  }, [formData.useExistingOrganization, organizationsList.length]);

  useEffect(() => {
    if (formData.useExistingPerson && peopleList.length === 0) {
      getPeople();
    }
  }, [formData.useExistingPerson, peopleList.length]);

  useEffect(() => {
    if ((formData.useExistingOfficialAddress || formData.useExistingPostalAddress) && addressesList.length === 0) {
      getAddresses();
    }
  }, [formData.useExistingOfficialAddress, formData.useExistingPostalAddress, addressesList.length]);

  useEffect(() => {
    if ((formData.useExistingLocation || formData.useExistingOfficialTown || formData.useExistingPostalTown) && locationsList.length === 0) {
      getLocations();
    }
  }, [formData.useExistingOfficialTown, formData.useExistingPostalTown, formData.useExistingLocation, locationsList.length]);

  const getCoordinates = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common = {
        "Authorization": `Bearer ${token}`
      };
      const response = await axios.get(`${V1APIURL}/coordinates`, getAxios());
      setCoordinatesList(response.data.content || []);
    } catch (error) {
      alert("An error occurred while retrieving coordinates: ", error);
    }
  };

  const getOrganizations = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common = {
        "Authorization": `Bearer ${token}`
      };
      const response = await axios.get(`${V1APIURL}/orgs`, getAxios());
      setOrganizationsList(response.data.content || []);
    } catch (error) {
      alert("An error occurred while retrieving organizations: ", error);
    }
  };

  const getPeople = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common = {
        "Authorization": `Bearer ${token}`
      };
      const response = await axios.get(`${V1APIURL}/people`, getAxios());
      setPeopleList(response.data.content || []);
    } catch (error) {
      alert("An error occurred while retrieving people: ", error);
    }
  };

  const getAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common = {
        "Authorization": `Bearer ${token}`
      };
      const response = await axios.get(`${V1APIURL}/addresses`, getAxios());
      setAddressesList(response.data.content || []);
    } catch (error) {
      alert("An error occurred while retrieving addresses: ", error);
    }
  };

  const getLocations = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common = {
        "Authorization": `Bearer ${token}`
      };
      const response = await axios.get(`${V1APIURL}/locations`, getAxios());
      setLocationsList(response.data.content || []);
    } catch (error) {
      alert("An error occurred while retrieving locations: ", error);
    }
  };

  const changeOrganizationState = (e, state) => {
    e.preventDefault();
    setUseOrganization((state !== null));
    setFormData(prevState => ({
      ...prevState,
      organization: state
    }));
  }

  const changeOfficialTownState = (e, state) => {
    e.preventDefault();
    setUseOfficialTown((state !== null));
    setFormData(prevState => ({
      ...prevState,
      organization: {
        ...prevState.organization,
        officialAddress: {
          ...prevState.organization.officialAddress,
          town: state
        }
      }
    }));
  }

  const changePostalTownState = (e, state) => {
    e.preventDefault();
    setUsePostalTown((state !== null));
    setFormData(prevState => ({
      ...prevState,
      organization: {
        ...prevState.organization,
        postalAddress: {
          ...prevState.organization.postalAddress,
          town: state
        }
      }
    }));
  }

  const handleObjectSelect = (objectProperty, value, list) => {
    const focusedObject = list.find(obj => obj.id === Number(value));
    switch (objectProperty) {
      case "person":
        setFormData(prevState => ({
          ...prevState,
          person: focusedObject,
        }));
        setFormData(prevState => ({
          ...prevState,
          person: {
            ...prevState.person,
            id: focusedObject.id
          }
        }));
        setErrors(prevErrors => ({...prevErrors, person: ""}))
        break;
      case "organization":
        setFormData(prevState => ({
          ...prevState,
          organization: focusedObject
        }));
        setFormData(prevState => ({
          ...prevState,
          organization: {
            ...prevState.organization,
            id: focusedObject.id
          }
        }));
        setErrors(prevErrors => ({...prevErrors, organization: ""}))
        break;
      case "coordinates":
        setFormData(prevState => ({
          ...prevState,
          coordinates: focusedObject
        }));
        setFormData(prevState => ({
          ...prevState,
          coordinates: {
            ...prevState.coordinates,
            id: focusedObject.id
          }
        }));
        setErrors(prevErrors => ({...prevErrors, coordinates: ""}))
        break;
      case "officialAddress":
        setFormData(prevState => ({
          ...prevState,
          organization: {
            officialAddress: focusedObject
          }
        }));
        setFormData(prevState => ({
          ...prevState,
          organization: {
            ...prevState.organization,
            officialAddress: {
              ...prevState.organization.officialAddress,
              id: focusedObject.id
            }
          }
        }));
        setErrors(prevErrors => ({...prevErrors, officialAddress: ""}))
        break;
      case "postalAddress":
        setFormData(prevState => ({
          ...prevState,
          organization: {
            postalAddress: focusedObject
          }
        }));
        setFormData(prevState => ({
          ...prevState,
          organization: {
            ...prevState.organization,
            officialAddress: {
              ...prevState.organization.postalAddress,
              id: focusedObject.id
            }
          }
        }));
        setErrors(prevErrors => ({...prevErrors, postalAddress: ""}))
        break;
      case "officialTown":
        setFormData(prevState => ({
          ...prevState,
          organization: {
            officialAddress: {
              town: focusedObject
            }
          }
        }));
        setFormData(prevState => ({
          ...prevState,
          organization: {
            ...prevState.organization,
            officialAddress: {
              ...prevState.organization.officialAddress,
              town: {
                ...prevState.organization.officialAddress.town,
                id: focusedObject.id
              }
            }
          }
        }));
        setErrors(prevErrors => ({...prevErrors, officialTown: ""}))
        break;
      case "postalTown":
        setFormData(prevState => ({
          ...prevState,
          organization: {
            postalAddress: {
              town: focusedObject
            }
          }
        }));
        setFormData(prevState => ({
          ...prevState,
          organization: {
            ...prevState.organization,
            officialAddress: {
              ...prevState.organization.officialAddress,
              town: {
                ...prevState.organization.officialAddress.town,
                id: focusedObject.id
              }
            }
          }
        }));
        setErrors(prevErrors => ({...prevErrors, postalTown: ""}))
        break;
      default:
        break;
    }
  };

  const updateFields = (field, value, schema) => {
    if (field === "salary" || field === "rating") {
      value = Number(value);
    }
    setFormData({...formData, [field]: value});
    validateFields(v, value, schema)
  };


  const submitForm = async (e) => {
    e.preventDefault();
    const isValid = validateWorker();
    if (!isValid) {
      alert('Не получилось создать Worker.');
      return;
    }
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common = {
        'Authorization': `Bearer ${token}`
      };
      // Request body cleanup
      formData = removeKey(formData, "authorities");
      removeKeyContains(formData, "useExisting");

      const res = await axios[item ? "put" : "post"](
        `${V1APIURL}/workers${item ? `/${item.id} ` : ""}`,
        formData,
        getAxios()
      );
      if (!(res.status === 200 || res.status === 201)) {
        alert(`Ошибка: ${res.statusText}`);
        return false;
      }
      alert(`Работник ${item ? "обновлен" : "создан"}.`);
      closeForm(true);
    } catch (error) {
      alert(`Ошибка! ${error.status}: ${error.message}`);
    }
    return false;
  };

  const validateWorker = () => {
    let errorMsg = validateFields(v, formData, schemas[5], true);
    if (errorMsg.length === 0) {
      return true;
    }
    setErrors(prevState => ({
      ...prevState,
      [errorMsg]: errorMsg
    }))
    console.log(errorMsg);
    return false;
  }

  const updateObjects = (objectProperty, field, value, schema) => {
    switch (objectProperty) {
      case "coordinates":
        value = Number(value)
        setFormData(prevState => ({
          ...prevState,
          coordinates: {
            ...prevState.coordinates,
            [field]: value
          }
        }));
        break;
      case "organization":
        if (field === "annualTurnover" || field === "employeesCount") {
          value = Number(value)
        }
        setFormData(prevState => ({
          ...prevState,
          organization: {
            ...prevState.organization,
            [field]: value
          }
        }));
        break;
      case "person":
        if (field === "weight") {
          value = Number(value)
        }
        setFormData(prevState => ({
          ...prevState,
          person: {
            ...prevState.person,
            [field]: value
          }
        }));
        break;
      case "officialAddress":
        setFormData(prevState => ({
          ...prevState,
          organization: {
            ...prevState.organization,
            officialAddress: {
              ...prevState.organization.officialAddress,
              [field]: value
            }
          }
        }));
        break;
      case "postalAddress":
        setFormData(prevState => ({
          ...prevState,
          organization: {
            ...prevState.organization,
            postalAddress: {
              ...prevState.organization.postalAddress,
              [field]: value
            }
          }
        }));
        break;
      case "officialTown":
        value = Number(value)
        setFormData(prevState => ({
          ...prevState,
          organization: {
            ...prevState.organization,
            officialAddress: {
              ...prevState.organization.officialAddress,
              town: {
                ...prevState.organization.officialAddress.town,
                [field]: value
              }
            }
          }
        }));
        break;
      case "postalTown":
        value = Number(value)
        setFormData(prevState => ({
          ...prevState,
          organization: {
            ...prevState.organization,
            postalAddress: {
              ...prevState.organization.postalAddress,
              town: {
                ...prevState.organization.postalAddress.town,
                [field]: value
              }
            }
          }
        }));
        break;
      case "location":
        value = Number(value)
        setFormData(prevState => ({
          ...prevState,
          person: {
            ...prevState.person,
            location: {
              ...prevState.person.location,
              [field]: value
            }
          }
        }));
        break;
      default:
        break;
    }

    let errorMsg = validateFields(v, value, schema).toString();
    if (errorMsg !== '') {
      setErrors(prevErrors => ({
        ...prevErrors,
        [`${objectProperty}_${field}`]: errorMsg
      }));
    }
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2>{item ? "Редактировать" : "Добавить"}{" работника"}</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <form onSubmit={(e) => submitForm(e)}>
            <div className="mb-4">
              <label htmlFor="Name">Имя</label>
              <input
                className="form-control"
                name="name"
                type="text"
                minLength="1"
                onChange={(e) => updateFields('name', e.target.value, schemas[5].properties.name)}
                value={formData.name}
              />
              {errors.name && <span className="Error">{errors.name}</span>}
            </div>
            <div className="mb-4">
              <label htmlFor="Salary">Зарплата</label>
              <input
                className="form-control"
                name="salary"
                type="number"
                onChange={(e) => updateFields('salary', e.target.value, schemas[5].properties.salary)}
                value={formData.salary ?? 1}
                step={0.01}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="Rating">Рейтинг</label>
              <input
                className="form-control"
                name="rating"
                type="number"
                min={1}
                pattern="[0-9]*"
                onChange={(e) => updateFields('rating', e.target.value, schemas[5].properties.rating)}
                value={formData.rating}
              />
              {errors.rating && <span className="error">{errors.rating}</span>}
            </div>
            <div className="mb-4 dropdown">
              <label htmlFor="Position">Позиция</label>
              <select
                className="dropdown-menu-dark"
                name="position"
                onChange={(e) => updateFields('position', e.target.value, schemas[5].properties.position)}
                value={formData.position}
              >
                <option className="dropdown-item" value={PositionEnum.DIRECTOR}>Директор</option>
                <option className="dropdown-item" value={PositionEnum.LABORER}>Пролетариат</option>
                <option className="dropdown-item" value={PositionEnum.BAKER}>Пекарь</option>
              </select>
              {errors.position && <span className="error">{errors.position}</span>}
            </div>
            <div className="mb-4 dropdown">
              <label htmlFor="Status">Статус</label>
              <select
                className="dropdown-menu-dark"
                name="status"
                onChange={(e) => updateFields('status', e.target.value, schemas[5].properties.status)}
                value={formData.status ?? ''}
              >
                <option className="dropdown-item" value=''>Выбрать...</option>
                <option className="dropdown-item" value={StatusEnum.FIRED}>Уволенный</option>
                <option className="dropdown-item" value={StatusEnum.HIRED}>Нанятый</option>
                <option className="dropdown-item" value={StatusEnum.RECOMMENDED_FOR_PROMOTION}>Рекомендован для повышения
                </option>
                <option className="dropdown-item" value={StatusEnum.REGULAR}>Постоянный</option>
              </select>
              {errors.status && <span className="error">{errors.status}</span>}
            </div>
            <hr></hr>
            <fieldset>
              <h4>Координаты</h4>
              <label className="radio-label">
                <span>Создать новую</span>
                <input
                  type="radio"
                  name="coordinatesOption"
                  checked={!formData.useExistingCoordinates}
                  onChange={() => updateFields('useExistingCoordinates', false, schemas[5].properties.useExistingCoordinates)}
                />
              </label>
              {!formData.useExistingCoordinates && (
                <div className="mb-4">
                  <label htmlFor="x">X
                    <input
                      className="form-control"
                      name="x"
                      type="number"
                      onChange={(e) => updateObjects("coordinates", 'x', e.target.value, schemas[1].properties.x)}
                      value={formData.coordinates.x}
                      step={0.01}
                      max={990}
                    />
                    {errors.coordinates_x && <span className="error">{errors.coordinates_x}</span>}
                  </label>
                  <label htmlFor="y">Y
                    <input
                      className="form-control"
                      name="y"
                      type="number"
                      onChange={(e) => updateObjects("coordinates", 'y', e.target.value, schemas[1].properties.y)}
                      value={formData.coordinates.y}
                      max={27}
                    />
                    {errors.coordinates_y && <span className="error">{errors.coordinates_y}</span>}
                  </label>
                </div>
              )}
              <label className="radio-label">
                <span>Выбрать существующего</span>
                <input
                  type="radio"
                  name="coordinatesOption"
                  checked={formData.useExistingCoordinates}
                  onChange={() => updateFields('useExistingCoordinates', true, schemas[5].properties.useExistingCoordinates)}
                />
              </label>
              {formData.useExistingCoordinates && (
                <select
                  onChange={(e) => handleObjectSelect("coordinates", e.target.value, coordinatesList)}
                  required
                >
                  Доступные координаты
                  {coordinatesList.map((coords) => (
                    <option key={coords.id} value={coords.id}>
                      ID: {coords.id}, X: {coords.x}, Y: {coords.y}
                    </option>
                  ))}
                </select>
              )}
              {errors.coordinates && <span className="error">{errors.coordinates}</span>}
            </fieldset>
            <hr></hr>
            <div className="mb-4">
              <h3>Организация</h3>
              {useOrganization ? null :
                <button
                  className="btn btn-primary" onClick={(e) =>
                  changeOrganizationState(e, organization)}>Добавить
                </button>
              }
              {useOrganization && (
                <fieldset>
                  <label className="radio-label">
                    <span>Создать новую</span>
                    <input
                      type="radio"
                      name="organizationOption"
                      checked={!formData.useExistingOrganization}
                      onChange={() => updateFields('useExistingOrganization', false, schemas[5].properties.useExistingOrganization)}
                    />
                    {useOrganization ? <button
                      className="btn btn-danger" onClick={(e) =>
                      changeOrganizationState(e, null)}>Закрыть
                    </button> : null}
                  </label>
                  {!formData.useExistingOrganization && (
                    <div className="mb-4">
                      <fieldset>
                        <legend>Юридический адрес</legend>
                        <label className="radio-label">
                          <span>Создать новую</span>
                          <input
                            type="radio"
                            name="officialAddressOption"
                            checked={!formData.useExistingOfficialAddress}
                            onChange={() => updateFields('useExistingOfficialAddress', false, schemas[5].properties.useExistingOfficialAddress)}
                          />
                        </label>
                        {!formData.useExistingOfficialAddress && (
                          <div className="mb-4">
                            <label htmlFor="organization_officialAddress">
                              Почтовый индекс
                              <input
                                className="form-control"
                                name="organization_officialAddress_zipCode"
                                type="text"
                                onChange={(e) => updateObjects("officialAddress", "zipCode", e.target.value, schemas[2].properties.zipCode)}
                                value={formData.organization.officialAddress.zipCode}
                              />
                              {errors.officialAddress_zipCode &&
                                <span className="error">{errors.officialAddress_zipCode}</span>}
                            </label>
                            <div className="mb-4">
                              <h6>Городок юрадреса</h6>
                              {useOfficialTown ? null :
                                <button
                                  className="btn btn-primary" onClick={(e) =>
                                  changeOfficialTownState(e, {x: 0, y: 0, z: 0})}>Добавить
                                </button>
                              }
                              {useOfficialTown && (
                                <fieldset>
                                  <label className="radio-label">
                                    <span>Создать новую</span>
                                    <input
                                      type="radio"
                                      name="officialAddressTownOption"
                                      checked={!formData.useExistingOfficialTown}
                                      onChange={() => updateFields('useExistingOfficialTown', false, schemas[5].properties.useExistingOfficialTown)}
                                    />
                                    {useOfficialTown ?
                                      <button
                                        className="btn btn-danger" onClick={(e) =>
                                        changeOfficialTownState(e, null)}>Закрыть
                                      </button> :
                                      null}
                                  </label>
                                  {!formData.useExistingOfficialTown && (
                                    <div className="mb-4">
                                      <label htmlFor="x">X
                                        <input
                                          className="form-control"
                                          name="x"
                                          type="number"
                                          onChange={(e) => updateObjects("officialTown", 'x', e.target.value, schemas[0].properties.x)}
                                          value={formData.organization.officialAddress.town.x}
                                        />
                                        {errors.officialTown_x &&
                                          <span className="error">{errors.officialTown_x}</span>}
                                      </label>
                                      <label htmlFor="y">Y
                                        <input
                                          className="form-control"
                                          name="y"
                                          type="number"
                                          onChange={(e) => updateObjects("officialTown", 'y', e.target.value, schemas[0].properties.y)}
                                          value={formData.organization.officialAddress.town.y}
                                        />
                                        {errors.officialTown_y &&
                                          <span className="error">{errors.officialTown_y}</span>}
                                        <label htmlFor="z">Z
                                          <input
                                            className="form-control"
                                            name="z"
                                            type="number"
                                            onChange={(e) => updateObjects("officialTown", 'z', e.target.value, schemas[0].properties.z)}
                                            value={formData.organization.officialAddress.town.z}
                                          />
                                          {errors.officialTown_z &&
                                            <span className="error">{errors.officialTown_z}</span>}
                                        </label>
                                      </label>
                                    </div>
                                  )}
                                  <label className="radio-label">
                                    <span>Выбрать существующего</span>
                                    <input
                                      type="radio"
                                      name="officialAddressTownOption"
                                      checked={formData.useExistingOfficialTown}
                                      onChange={() => updateFields('useExistingOfficialTown', true, schemas[5].properties.useExistingOfficialTown)}
                                    />
                                  </label>
                                  {formData.useExistingOfficialTown && (
                                    <select
                                      onChange={(e) => handleObjectSelect("officialTown", e.target.value, locationsList)}
                                      required
                                    >
                                      Доступные городки
                                      <option value="">Выбрать...</option>
                                      {locationsList.map((location) => (
                                        <option key={location.id} value={location.id}>
                                          ID: {location.id}, X: {location.x}, Y: {location.y}, Z: {location.z}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                  {errors.officialTown && <span className="error">{errors.officialTown}</span>}
                                </fieldset>
                              )}
                            </div>
                          </div>
                        )}
                        <label className="radio-label">
                          <span>Выбрать существующего</span>
                          <input
                            type="radio"
                            name="officialAddressOption"
                            checked={formData.useExistingOfficialAddress}
                            onChange={() => updateFields("useExistingOfficialAddress", true, schemas[5].properties.useExistingOfficialAddress)}
                          />
                        </label>
                        {formData.useExistingOfficialAddress && (
                          <select
                            onChange={(e) => handleObjectSelect("officialAddress", e.target.value, addressesList)}
                            required
                          >
                            Доступные адреса
                            {addressesList.map((address) => (
                              <option key={address.id} value={address.id}>
                                ID: {address.id}, Почтовый индекс: {address.zipCode}
                              </option>
                            ))}
                          </select>
                        )}
                        {errors.officialAddress && <span className="error">{errors.officialAddress}</span>}
                      </fieldset>
                      <label htmlFor="organization_annualTurnover">
                        Годовой оборот
                        <input
                          className="form-control"
                          name="organization_annualTurnover"
                          type="number"
                          onChange={(e) => updateObjects("organization", 'annualTurnover', e.target.value, schemas[4].properties.annualTurnover)}
                          value={formData.organization.annualTurnover}
                        />
                        {errors.organization_annualTurnover &&
                          <span className="error">{errors.organization_annualTurnover}</span>}
                      </label>
                      <label htmlFor="organization_employeesCount">
                        Количество работников
                        <input
                          className="form-control"
                          name="organization_employeesCount"
                          type="number"
                          min={1}
                          pattern="[0-9]*"
                          onChange={(e) => updateObjects("organization", 'employeesCount', e.target.value, schemas[4].properties.employeesCount)}
                          value={formData.organization.employeesCount}
                        />
                        {errors.organization_employeesCount &&
                          <span className="error">{errors.organization_employeesCount}</span>}
                      </label>
                      <label htmlFor="organization_fullName">
                        Полное название
                        <input
                          className="form-control"
                          name="organization_fullName"
                          type="text"
                          maxLength="1576"
                          onChange={(e) => updateObjects("organization", 'fullName', e.target.value, schemas[4].properties.fullName)}
                          value={formData.organization.fullName}
                        />
                        {errors.organization_fullName &&
                          <span className="error">{errors.organization_fullName}</span>}
                      </label>
                      <label htmlFor="organization_type">
                        Тип организации
                        <select
                          className="dropdown-menu-dark"
                          name="organization_type"
                          onChange={(e) => updateObjects("organization", "organizationType", e.target.value, schemas[4].properties.organizationType)}
                          value={formData.organization.organizationType ?? ''}
                        >
                          <option className="dropdown-item" value={OrganizationEnum.COMMERCIAL}>Коммерческий
                          </option>
                          <option className="dropdown-item" value={OrganizationEnum.PUBLIC}>Госсектор</option>
                          <option className="dropdown-item" value={OrganizationEnum.GOVERNMENT}>Власть
                          </option>
                          <option className="dropdown-item" value={OrganizationEnum.TRUST}>Трест</option>
                          <option className="dropdown-item"
                                  value={OrganizationEnum.PRIVATE_LIMITED_COMPANY}>ООО
                          </option>
                        </select>
                        {errors.organization_organizationType &&
                          <span className="error">{errors.organization_organizationType}</span>}
                      </label>
                      <hr></hr>
                      <fieldset>
                        <legend>Почтовый адрес</legend>
                        <label className="radio-label">
                          <span>Создать новую</span>
                          <input
                            type="radio"
                            name="postalAddressOption"
                            checked={!formData.useExistingPostalAddress}
                            onChange={() => updateFields('useExistingPostalAddress', false, schemas[5].properties.useExistingPostalAddress)}
                          />
                        </label>
                        {!formData.useExistingPostalAddress && (
                          <div className="mb-4">
                            <label htmlFor="organization_postalAddress">
                              Почтовый индекс
                              <input
                                className="form-control"
                                name="organization_postalAddress_zipCode"
                                type="text"
                                onChange={(e) => updateObjects("postalAddress", "zipCode", e.target.value, schemas[2].properties.zipCode)}
                                value={formData.organization.postalAddress.zipCode}
                              />
                              {errors.postalAddress_zipCode &&
                                <span className="error">{errors.postalAddress_zipCode}</span>}
                            </label>
                            <div className="mb-4">
                              <h6>Городок почтового адреса</h6>
                              {usePostalTown ? null :
                                <button
                                  className="btn btn-primary" onClick={(e) =>
                                  changePostalTownState(e, {x: 0, y: 0, z: 0})}>Добавить
                                </button>}
                              {usePostalTown && (
                                <fieldset>
                                  <label className="radio-label">
                                    <span>Создать новую</span>
                                    <input
                                      type="radio"
                                      name="postalAddressTownOption"
                                      checked={!formData.useExistingPostalTown}
                                      onChange={() => updateFields('useExistingPostalTown', false, schemas[5].properties.useExistingPostalTown)}
                                    />
                                    {usePostalTown ?
                                      <button
                                        className="btn btn-danger" onClick={(e) =>
                                        changePostalTownState(e, null)}>Закрыть
                                      </button> :
                                      null}
                                  </label>
                                  {!formData.useExistingPostalTown && (
                                    <div className="mb-4">
                                      <label htmlFor="x">X
                                        <input
                                          className="form-control"
                                          name="x"
                                          type="number"
                                          onChange={(e) => updateObjects("postalTown", 'x', e.target.value, schemas[0].properties.x)}
                                          value={formData.organization.postalAddress.town.x}
                                        />
                                        {errors.postalTown_x && <span className="error">{errors.postalTown_x}</span>}
                                      </label>
                                      <label htmlFor="y">Y
                                        <input
                                          className="form-control"
                                          name="y"
                                          type="number"
                                          onChange={(e) => updateObjects("postalTown", 'y', e.target.value, schemas[0].properties.y)}
                                          value={formData.organization.postalAddress.town.y}
                                        />
                                        {errors.postalTown_y && <span className="error">{errors.postalTown_y}</span>}
                                        <label htmlFor="z">Z
                                          <input
                                            className="form-control"
                                            name="z"
                                            type="number"
                                            onChange={(e) => updateObjects("postalTown", 'z', e.target.value, schemas[0].properties.z)}
                                            value={formData.organization.postalAddress.town.z}
                                          />
                                          {errors.postalTown_z &&
                                            <span className="error">{errors.postalTown_z}</span>}
                                        </label>
                                      </label>
                                    </div>
                                  )}
                                  <label className="radio-label">
                                    <span>Выбрать существующего</span>
                                    <input
                                      type="radio"
                                      name="postalAddressTownOption"
                                      checked={formData.useExistingPostalTown}
                                      onChange={() => updateFields('useExistingPostalTown', true, schemas[5].properties.useExistingPostalTown)}
                                    />
                                  </label>
                                  {formData.useExistingPostalTown && (
                                    <select
                                      onChange={(e) => handleObjectSelect("postalTown", e.target.value, locationsList)}
                                      required
                                    >
                                      Доступные городки
                                      <option value="">Выбрать...</option>
                                      {locationsList.map((location) => (
                                        <option key={location.id} value={location.id}>
                                          ID: {location.id}, X: {location.x}, Y: {location.y}, Z: {location.z}
                                        </option>
                                      ))}
                                    </select>
                                  )}
                                  {errors.postalTown && <span className="error">{errors.postalTown}</span>}
                                </fieldset>
                                )}
                                </div>
                          </div>)}
                              <label className="radio-label">
                                <span>Выбрать существующего</span>
                                <input
                                  type="radio"
                                  name="postalAddressOption"
                                  checked={formData.useExistingPostalAddress}
                                  onChange={() => updateFields("useExistingPostalAddress", true, schemas[5].properties.useExistingPostalAddress)}
                                />
                              </label>
                              {formData.useExistingPostalAddress && (
                                <select
                                  onChange={(e) => handleObjectSelect("postalAddress", e.target.value, addressesList)}
                                  required
                                >
                                  Доступные адреса
                                  {addressesList.map((address) => (
                                    <option key={address.id} value={address.id}>
                                      ID: {address.id}, Почтовый индекс: {address.zipCode}
                                    </option>
                                  ))}
                                </select>
                              )}
                              {errors.postalAddress && <span className="error">{errors.postalAddress}</span>}
                            </fieldset>
                          </div>)}
                        <label className="radio-label">
                          <span>Выбрать существующего</span>
                          <input
                            type="radio"
                            name="organizationOption"
                            checked={formData.useExistingOrganization}
                            onChange={() => updateFields('useExistingOrganization', true, schemas[5].properties.useExistingOrganization)}
                          />
                        </label>
                        {formData.useExistingOrganization && (
                          <select
                            onChange={(e) => handleObjectSelect("organization", e.target.value, organizationsList)}>
                            Доступные организации
                            <option value="">Выбрать...</option>
                            {organizationsList.map((org) => (
                              <option key={org.id} value={org.id}>
                                ID: {org.id}, 
                                officialAddress: {org.officialAddress.id}, 
                                annualTurnover: {org.annualTurnover}, 
                                employeesCount: {org.employeesCount}, 
                                postalAddress: {org.postalAddress.id}
                              </option>
                            ))}
                          </select>
                        )}
                        {errors.organization && <span className="error">{errors.organization}</span>}
                      </fieldset>
                      )}
                    </div>
                    <hr></hr>
                    <fieldset>
                    <h4>Человек</h4>
                    <label className="radio-label">
                    <span>Создать новую</span>
                    <input
                    type="radio"
                    name="personOption"
                    checked={!formData.useExistingPerson}
                          onChange={() => updateFields('useExistingPerson', false, schemas[5].properties.useExistingPerson)}
                />
                </label>
              {!formData.useExistingPerson && (
                <div className="mb-4">
                <label htmlFor="person_eyeColor">
                  Цвет глаз
                <select className="dropdown-menu-dark"
                name="person_eyeColor"
                onChange={(e) => updateObjects("person", "eyeColor", e.target.value, schemas[3].properties.eyeColor)}
                 value={formData.person.eyeColor}>
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
                    onChange={(e) => updateObjects("person", "hairColor", e.target.value, schemas[3].properties.hairColor)}
                    value={formData.person.hairColor ?? ''}>
              <option className="dropdown-item" value={''}>Выбрать...</option>
              <option className="dropdown-item" value={ColorEnum.GREEN}>Зеленый</option>
              <option className="dropdown-item" value={ColorEnum.BLACK}>Черный</option>
              <option className="dropdown-item" value={ColorEnum.BLUE}>Синий</option>
              <option className="dropdown-item" value={ColorEnum.ORANGE}>Оранжевый</option>
            </select>
          </label>
                  {errors.person_hairColor && <span className="error">{errors.person_hairColor}</span>}
          <fieldset>
            <legend>Локация</legend>
            <label className="radio-label">
              <span>Создать новую</span>
              <input
                type="radio"
                name="locationOption"
                checked={!formData.useExistingLocation}
                onChange={() => updateFields('useExistingLocation', false, schemas[5].properties.useExistingLocation)}
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
                    value={formData.person.location.x}
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
                    value={formData.person.location.y}
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
                    value={formData.person.location.z}
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
                onChange={() => updateFields("useExistingLocation", true, schemas[5].properties.useExistingLocation)}
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
                    X: {location.x}, Y: {location.y}, Z: {location.z}
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
              onChange={(e) => updateObjects("person", "birthday", e.target.value, schemas[3].properties.birthday)}
              value={formData.person.birthday}
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
              onChange={(e) => updateObjects("person", "weight", e.target.value, schemas[3].properties.weight)}
              value={formData.person.weight}
            />
            {errors.person_weight && <span className="error">{errors.person_weight}</span>}
          </label>
          <label htmlFor="person_nationality">
            Национальность
            <select className="dropdown-menu-dark"
                    name="person_nationality"
                    onChange={(e) => updateObjects("person", "nationality", e.target.value, schemas[3].properties.nationality)}
                    value={formData.person.nationality}>
              <option className="dropdown-item" value={CountryEnum.UNITED_KINGDOM}>Великобритания
              </option>
              <option className="dropdown-item" value={CountryEnum.FRANCE}>Франция</option>
              <option className="dropdown-item" value={CountryEnum.NORTH_KOREA}>Северная Корея</option>
            </select>
            {errors.person_nationality && <span className="error">{errors.person_nationality}</span>}
          </label>
        </div>
        )}
        <label className="radio-label">
          <span>Выбрать существующего</span>
          <input
            type="radio"
            name="personOption"
            checked={formData.useExistingPerson}
            onChange={() => updateFields('useExistingPerson', true, schemas[5].properties.useExistingPerson)}
          />
        </label>
        {formData.useExistingPerson && (
          <select
            onChange={(e) => handleObjectSelect("person", e.target.value, peopleList)}
            required
          >
            Доступные человеки
            {peopleList.map((person) => (
              <option key={person.id} value={person.id}>
                ID: {person.id},
                EyeColor: {person.eyeColor},
                HairColor: {person.hairColor},
                Location: {person.location.id},
                Birthday: {person.birthday},
                Weight: {person.weight},
                Nationality: {person.nationality}
              </option>
            ))}
          </select>
        )}{errors.person && <span className="error">{errors.person}</span>}
      </fieldset>
      <hr></hr>
      <div className="mb-4">
        <div className="mb-4">
          <button className="btn btn-primary" type="submit">
            <i className="fa fa-send"></i>&nbsp;Отправить
          </button>
          <button
            className="btn btn-secondary mz-2"
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
}

export const SpecialComponent = () => {
  const [deleteByPersonId, setDeleteByPersonId] = useState(1);
  const [countByPeopleId, setCountByPeopleId] = useState(1);
  const [rating, setRating] = useState(1);
  const [fireByWorkerId, setFireByWorkerId] = useState(1);
  const [transferWorkerIds, setTransferWorkerIds] = useState({orgId: 1, workerId: 1});
  const [workersByPerson, setWorkersByPerson] = useState(0);
  const [workersByRating, setWorkersByRating] = useState(0);

  useEffect(() => {
  }, []);

  useEffect(() => {
    if (deleteByPersonId) {
      setDeleteByPersonId(deleteByPersonId);
    }
    if (countByPeopleId) {
      setCountByPeopleId(countByPeopleId);
    }
    if (rating) {
      setRating(rating);
    }
    if (fireByWorkerId) {
      setFireByWorkerId(fireByWorkerId);
    }
    if (transferWorkerIds) {
      setTransferWorkerIds(transferWorkerIds);
    }
  }, [deleteByPersonId, countByPeopleId, rating, fireByWorkerId, transferWorkerIds]);

  const updateDeleteByPersonId = (e) => {
    setDeleteByPersonId(e.target.value);
  };
  const updateCountByPeopleId = (e) => {
    setCountByPeopleId(e.target.value);
  };
  const updateRating = (e) => {
    setRating(e.target.value);
  };
  const updateFireByWorkerId = (e) => {
    setFireByWorkerId(e.target.value);
  };
  const updateTransferWorkerIds = (e) => {
    setTransferWorkerIds({...transferWorkerIds, [e.target.name]: e.target.value});
  };
  const apiDict = {
    "delete-by-person": deleteByPersonId,
    "count-by-people": countByPeopleId,
    "count-by-less-than-rating": rating,
    "fire-worker-from-org": fireByWorkerId,
    "transfer-worker-to-another-organization": transferWorkerIds
  };

  const paramDict = {
    "delete-by-person": "personId",
    "count-by-people": "personId",
    "count-by-less-than-rating": "rating",
    "fire-worker-from-org": "workerId",
    "transfer-worker-to-another-organization": "orgId"
  };

  const submitForm = async (e, apiStr: string) => {
    e.preventDefault();
    let res;
    let url = `${V1APIURL}/workers/`;
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common = {
        "Authorization": `Bearer ${token}`
      };

      url += (apiStr === "transfer-worker-to-another-organization") ?
        `${apiStr}?${paramDict[apiStr]}=${apiDict[apiStr].orgId}&${paramDict["fire-worker-from-org"]}=${apiDict[apiStr].workerId}`
        : `${apiStr}?${paramDict[apiStr]}=${apiDict[apiStr]}`

      switch (apiStr) {
        case "transfer-worker-to-another-organization":
        case "fire-worker-from-org":
          res = await axios.put(url, getAxios());
          break;
        case "count-by-people" || "count-by-less-than-rating":
          res = await axios.get(url, getAxios());
          if(apiStr === "count-by-people") {
            setWorkersByPerson(res.data);
          } else {
            setWorkersByRating(res.data);
          }
          break;
        case "delete-by-person":
          res = await axios.delete(url, getAxios());
          break;
        default:
          break;
      }
      if (!(res.status === 200 || res.status === 204)) {
        alert(`Ошибка: ${res.statusText}`);
        return false;
      }
      alert("Операция проведена успешно. Проверьте соответствующие объекты.")
    } catch (error) {
      alert(`Ошибка! ${error.status}: ${error.message}`);
    }
    return false;
  };

  return (
    <div className="container py-5">
      <div className="row">
        <h3>Специальные ??????? операции</h3>
        <br/>
        <h4>
          Удалить рабочего через ID человека
        </h4>
        <form className="special" onSubmit={(e) => submitForm(e, "delete-by-person")}>
          <input
            className="form-control"
            name="delete_by_person_id"
            type="number"
            min={1}
            onChange={(e) => updateDeleteByPersonId(e)}
            value={deleteByPersonId}
          />
          <button className="btn btn-danger" type="submit">
            <i className="fa fa-send"></i>&nbsp;Удалить
          </button>
        </form>
        <h4>
          Считать количество рабочих по человеку
        </h4>
        <form className="special" onSubmit={(e) => submitForm(e, "count-by-people")}>
          <input
            className="form-control"
            name="count_by_people_id"
            type="number"
            min={1}
            onChange={(e) => updateCountByPeopleId(e)}
            value={countByPeopleId}
          />
          <button className="btn btn-primary" type="submit">
            <i className="fa fa-send"></i>&nbsp;Считать
          </button>
          <label>Количество работников: {workersByPerson}</label>
        </form>
        <h4>
          Считать количество рабочих с зарплатой меньше, чем указанного
        </h4>
        <form className="special" onSubmit={(e) => submitForm(e, "count-by-less-than-rating")}>
          <input
            className="form-control"
            name="count_by_rating"
            type="number"
            min={1}
            onChange={(e) => updateRating(e)}
            value={rating}
          />
          <button className="btn btn-primary" type="submit">
            <i className="fa fa-send"></i>&nbsp;Считать
          </button>
          <label>Количество работников: {workersByRating}</label>
        </form>
        <h4>
          Уволить работника по его ID
        </h4>
        <form className="special" onSubmit={(e) => submitForm(e, "fire-worker-from-org")}>
          <input
            className="form-control"
            name="fire_worker_by_id"
            type="number"
            min={1}
            onChange={(e) => updateFireByWorkerId(e)}
            value={fireByWorkerId}
          />
          <button className="btn btn-secondary" type="submit">
            <i className="fa fa-send"></i>&nbsp;Уволить
          </button>
        </form>
        <h4>
          Перевести работника (по ID) с текущей организации в другую (по ID)
        </h4>
        <form className="special" onSubmit={(e) => submitForm(e, "transfer-worker-to-another-organization")}>
          <label>Работник</label>
          <input
            className="form-control"
            name="transfer_worker_organization_dest"
            type="number"
            min={1}
            onChange={(e) => updateTransferWorkerIds(e)}
            value={transferWorkerIds.orgId}
          />
          <label>Организация, к которому вы хотите перевести работника</label>
          <input
            className="form-control"
            name="transfer_worker"
            type="number"
            min={1}
            onChange={(e) => updateTransferWorkerIds(e)}
            value={transferWorkerIds.workerId}
          />
          <button className="btn btn-primary" type="submit">
            <i className="fa fa-send"></i>&nbsp;Перевести
          </button>
        </form>
      </div>
    </div>
  );
}