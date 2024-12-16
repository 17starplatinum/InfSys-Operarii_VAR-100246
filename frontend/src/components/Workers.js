import {useEffect, useState} from "react";
import DataTable from "react-data-table-component";
import {ColorEnum, CountryEnum, OrganizationEnum, PositionEnum, StatusEnum, V1APIURL} from "../shared/constants";
import axios from "axios";
import {getAxios, removeKey} from "../shared/utils";
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
      name: "id",
      selector: (item) => item.id
    },
    {
      name: "name",
      selector: (item) => item.name
    },
    {
      name: "salary",
      selector: (item) => item.salary
    },
    {
      name: "rating",
      selector: (item) => item.rating
    },
    {
      name: "position",
      selector: (item) => item.position
    },
    {
      name: "status",
      selector: (item) => item.status
    },
    {
      name: "Actions",
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
        alert(`Error: ${res.statusText}`);
        return false;
      }
      setItems((res.data?.content || []));
    } catch (error) {
      alert(`Error!`);
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
        alert(`Error: ${res.statusText}`);
        return false;
      }
      alert("Item deleted.");
      loadItems();
    } catch (error) {
      alert(`Error!`);
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
              <i className="fa fa-add"></i>&nbsp;Add
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
    coordinates: {x: 0, y: 0},
    organization: null,
    person: {
      eyeColor: "BLACK",
      hairColor: null,
      birthday: null,
      weight: 1,
      nationality: "UNITED_KINGDOM",
      location: {x: 0, y: 0, z: 0},
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
    annualTurnover: 1,
    employeesCount: 1,
    fullName: null,
    organizationType: null,
    postalAddress: {zipCode: "g684grer", town: null},
    officialAddress: {zipCode: "6weg8we5", town: null},
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

  const handleObjectSelect = (objectProperty, value, list) => {
    const focusedObject = list.find(obj => obj.id === Number(value));
    switch (objectProperty) {
      case "person":
        setFormData(prevState => ({
          ...prevState,
          person: focusedObject
        }));
        setErrors(prevErrors => ({...prevErrors, person: ""}))
        break;
      case "organization":
        setFormData(prevState => ({
          ...prevState,
          organization: focusedObject
        }));
        setErrors(prevErrors => ({...prevErrors, organization: ""}))
        break;
      case "coordinates":
        setFormData(prevState => ({
          ...prevState,
          coordinates: focusedObject
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
        setErrors(prevErrors => ({...prevErrors, officialAddress: ""}))
        break;
      case "postalAddress":
        setFormData(prevState => ({
          ...prevState,
          organization: {
            postalAddress: focusedObject
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
      formData = removeKey(formData, "authorities");
      const res = await axios[item ? "put" : "post"](
        `${V1APIURL}/workers${item ? `/${item.id} ` : ""}`,
        formData,
        getAxios()
      );
      if (!(res.status === 200 || res.status === 201)) {
        alert(`Error: ${res.statusText}`);
        return false;
      }
      alert(`Item ${item ? "Updated" : "Created"}`);
      closeForm(true);
    } catch (error) {
      alert(`Error!`);
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
          <h2>{item ? "Edit Item" : "Add Item"}</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <form onSubmit={(e) => submitForm(e)}>
            <div className="mb-4">
              <label htmlFor="Name">name</label>
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
              <label htmlFor="Salary">salary</label>
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
              <label htmlFor="Rating">rating</label>
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
              <label htmlFor="Position">Position</label>
              <select
                className="dropdown-menu-dark"
                name="position"
                onChange={(e) => updateFields('position', e.target.value, schemas[5].properties.position)}
                value={formData.position}
              >
                <option className="dropdown-item" value={PositionEnum.DIRECTOR}>Director</option>
                <option className="dropdown-item" value={PositionEnum.LABORER}>Laborer</option>
                <option className="dropdown-item" value={PositionEnum.BAKER}>Baker</option>
              </select>
              {errors.position && <span className="error">{errors.position}</span>}
            </div>
            <div className="mb-4 dropdown">
              <label htmlFor="Status">Status</label>
              <select
                className="dropdown-menu-dark"
                name="status"
                onChange={(e) => updateFields('status', e.target.value, schemas[5].properties.status)}
                value={formData.status ?? ''}
              >
                <option className="dropdown-item" value=''>Choose...</option>
                <option className="dropdown-item" value={StatusEnum.FIRED}>Fired</option>
                <option className="dropdown-item" value={StatusEnum.HIRED}>Hired</option>
                <option className="dropdown-item" value={StatusEnum.RECOMMENDED_FOR_PROMOTION}>Recommended For
                  Promotion
                </option>
                <option className="dropdown-item" value={StatusEnum.REGULAR}>Regular</option>
              </select>
              {errors.status && <span className="error">{errors.status}</span>}
            </div>
            <hr></hr>
            <fieldset>
              <legend>Coordinates</legend>
              <label className="radio-label">
                <span>Create new</span>
                <input
                  type="radio"
                  name="coordinatesOption"
                  checked={!formData.useExistingCoordinates}
                  onChange={() => updateFields('useExistingCoordinates', false, schemas[5].properties.useExistingCoordinates)}
                />
              </label>
              {!formData.useExistingCoordinates && (
                <div className="mb-4">
                  <label htmlFor="x">Coordinates (X)
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
                  <label htmlFor="y">Coordinates (Y)
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
                <span>Выбрать существующие</span>
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
                  <option value="">Available Coordinates</option>
                  {coordinatesList.map((coords) => (
                    <option key={coords.id} value={coords.id}>
                      X: {coords.x}, Y: {coords.y}
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
                        <legend>Official Address</legend>
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
                              ZipCode
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
                                      <label htmlFor="x">Town (X)
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
                                      <label htmlFor="y">Town (Y)
                                        <input
                                          className="form-control"
                                          name="y"
                                          type="number"
                                          onChange={(e) => updateObjects("officialTown", 'y', e.target.value, schemas[0].properties.y)}
                                          value={formData.organization.officialAddress.town.y}
                                        />
                                        {errors.officialTown_y &&
                                          <span className="error">{errors.officialTown_y}</span>}
                                        <label htmlFor="x">Town (Z)
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
                                    <span>Выбрать существующие</span>
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
                                      <option value="">Available Towns</option>
                                      {locationsList.map((location) => (
                                        <option key={location.id} value={location.id}>
                                          X: {location.x}, Y: {location.y}, Z: {location.z}
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
                            {addressesList.map((address) => (
                              <option key={address.id} value={address.id}>
                                ZipCode: {address.zipCode}
                              </option>
                            ))}
                          </select>
                        )}
                        {errors.officialAddress && <span className="error">{errors.officialAddress}</span>}
                      </fieldset>
                      <label htmlFor="organization_annualTurnover">
                        Annual Turnover
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
                        Employees Count
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
                      <label htmlFor="organization_fullName">Full Name
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
                      <label htmlFor="organization_type">Organization Type
                        <select
                          className="dropdown-menu-dark"
                          name="organization_type"
                          onChange={(e) => updateObjects("organization", "organizationType", e.target.value, schemas[4].properties.organizationType)}
                          value={formData.organization.organizationType ?? ''}
                        >
                          <option className="dropdown-item" value={null}>Choose...</option>
                          <option className="dropdown-item" value={OrganizationEnum.COMMERCIAL}>Commercial</option>
                          <option className="dropdown-item" value={OrganizationEnum.PUBLIC}>Public</option>
                          <option className="dropdown-item" value={OrganizationEnum.GOVERNMENT}>Government</option>
                          <option className="dropdown-item" value={OrganizationEnum.TRUST}>Trust</option>
                          <option className="dropdown-item" value={OrganizationEnum.PRIVATE_LIMITED_COMPANY}>Private
                            Limited
                            Company
                          </option>
                        </select>
                        {errors.organization_organizationType &&
                          <span className="error">{errors.organization_organizationType}</span>}
                      </label>
                      <hr></hr>
                      <fieldset>
                        <legend>Postal Address</legend>
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
                              ZipCode
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
                                      <label htmlFor="x">Town (X)
                                        <input
                                          className="form-control"
                                          name="x"
                                          type="number"
                                          onChange={(e) => updateObjects("postalTown", 'x', e.target.value, schemas[0].properties.x)}
                                          value={formData.organization.postalAddress.town.x}
                                        />
                                        {errors.postalTown_x && <span className="error">{errors.postalTown_x}</span>}
                                      </label>
                                      <label htmlFor="y">Town (Y)
                                        <input
                                          className="form-control"
                                          name="y"
                                          type="number"
                                          onChange={(e) => updateObjects("postalTown", 'y', e.target.value, schemas[0].properties.y)}
                                          value={formData.organization.postalAddress.town.y}
                                        />
                                        {errors.postalTown_y && <span className="error">{errors.postalTown_y}</span>}
                                        <label htmlFor="x">Town (Z)
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
                                    <span>Выбрать существующие</span>
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
                                      <option value="">Available Towns</option>
                                      {locationsList.map((location) => (
                                        <option key={location.id} value={location.id}>
                                          X: {location.x}, Y: {location.y}, Z: {location.z}
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
                                  {addressesList.map((address) => (
                                    <option key={address.id} value={address.id}>
                                      ZipCode: {address.zipCode}
                                    </option>
                                  ))}
                                </select>
                              )}
                              {errors.postalAddress && <span className="error">{errors.postalAddress}</span>}
                            </fieldset>
                          </div>)}
                        <label className="radio-label">
                          <span>Выбрать существующие</span>
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
                            <option value="">Выберите организацию</option>
                            {organizationsList.map((org) => (
                              <option key={org.id} value={org.id}>
                                officialAddress: {org.officialAddress.id}
                                annualTurnover: {org.annualTurnover},
                                employeesCount: {org.employeesCount},
                                fullName: {org.fullName},
                                organizationType: {org.organizationType},
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
                    <legend>Person Data</legend>
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
                <label htmlFor="person_eyeColor">Eye Color
                <select className="dropdown-menu-dark"
                name="person_eyeColor"
                onChange={(e) => updateObjects("person", "eyeColor", e.target.value, schemas[3].properties.eyeColor)}
                 value={formData.person.eyeColor}>
              <option className="dropdown-item" value={ColorEnum.GREEN}>Green</option>
              <option className="dropdown-item" value={ColorEnum.BLACK}>Black</option>
              <option className="dropdown-item" value={ColorEnum.BLUE}>Blue</option>
              <option className="dropdown-item" value={ColorEnum.ORANGE}>Orange</option>
            </select>
          </label>
          {errors.person_eyeColor && <span className="error">{errors.person_eyeColor}</span>}
          <label htmlFor="person_hairColor">Hair Color
            <select className="dropdown-menu-dark"
                    name="person_hairColor"
                    onChange={(e) => updateObjects("person", "hairColor", e.target.value, schemas[3].properties.hairColor)}
                    value={formData.person.hairColor ?? ''}>
              <option className="dropdown-item" value={''}>Choose...</option>
              <option className="dropdown-item" value={ColorEnum.GREEN}>Green</option>
              <option className="dropdown-item" value={ColorEnum.BLACK}>Black</option>
              <option className="dropdown-item" value={ColorEnum.BLUE}>Blue</option>
              <option className="dropdown-item" value={ColorEnum.ORANGE}>Orange</option>
            </select>
          </label>
          {errors.person_hairColor && <span className="error">{errors.person_hairColor}</span>}
          <fieldset>
            <legend>Location</legend>
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
                  Location (X)
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
                  Location (Y)
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
                  Location (Z)
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
                <option value={null}>Choose...</option>
                {locationsList.map((location) => (
                  <option key={location.id} value={location.id}>
                    X: {location.x}, Y: {location.y}, Z: {location.z}
                  </option>
                ))}
              </select>
            )}
            {errors.location && <span className="error">{errors.location}</span>}
          </fieldset>
          <label htmlFor="person_birthday">Birthday
            <input
              className="form-control"
              name="person_birthday"
              type="date"
              onChange={(e) => updateObjects("person", "birthday", e.target.value, schemas[3].properties.birthday)}
              value={formData.person.birthday}
            />
            {errors.person_birthday && <span className="error">{errors.person_birthday}</span>}
          </label>
          <label htmlFor="person_weight">Weight
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
          <label htmlFor="person_nationality">Nationality
            <select className="dropdown-menu-dark"
                    name="person_nationality"
                    onChange={(e) => updateObjects("person", "nationality", e.target.value, schemas[3].properties.nationality)}
                    value={formData.person.nationality}>
              <option className="dropdown-item" value={CountryEnum.UNITED_KINGDOM}>United Kingdom
              </option>
              <option className="dropdown-item" value={CountryEnum.FRANCE}>France</option>
              <option className="dropdown-item" value={CountryEnum.NORTH_KOREA}>North Korea</option>
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
            {peopleList.map((person) => (
              <option key={person.id} value={person.id}>
                EyeColor: {person.eyeColor}
                HairColor: {person.hairColor}
                Location: {person.location.id}
                Birthday: {person.birthday}
                Weight: {person.weight}
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

export const SpecialComponent = () => {
  const [deleteByPersonId, setDeleteByPersonId] = useState(1);
  const [countByPeopleId, setCountByPeopleId] = useState(1);
  const [rating, setRating] = useState(1);
  const [fireByWorkerId, setFireByWorkerId] = useState(1);
  const [transferWorkerIds, setTransferWorkerIds] = useState({workerId: 1, orgId: 1});

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

  const submitForm = async (e, apiString) => {
    e.preventDefault();
    let res, url = `${V1APIURL}/workers/${apiString`/${e.target.value}`}`;
    try {
      if (apiString === "count-by-people" || apiString === "count-by-less-than-rating") {
        res = await axios.get(url, getAxios());
      } else if (apiString !== "delete-by-person") {
        res = await axios.put(url, getAxios());
      } else {
        res = await axios.delete(url, getAxios());
      }

      if (res.status !== 200 || res.status !== 204) {
        alert(`Error: ${res.statusText}`);
        return false;
      }

    } catch (error) {
      alert(`Error!`);
    }
    return false;
  };

  return (
    <div className="container py-5">
      <div className="row">

      </div>
    </div>
  );
}