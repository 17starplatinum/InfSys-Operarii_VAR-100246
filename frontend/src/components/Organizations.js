import {useEffect, useState} from "react";
import DataTable from "react-data-table-component";
import {OrganizationEnum, V1APIURL} from "../shared/constants";
import axios from "axios";
import {getAxios, removeKey} from "../shared/utils";
import {
  addressSchema,
  locationSchema,
  organizationSchema
} from "./validation/ValidationSchemas";
import {validateFields} from "./validation/Validation";

export const OrganizationsComponent = ({setPage}) => {
  const columns = [
    {
      name: "id",
      selector: (item) => item.id,
    },
    {
      name: "annualTurnover",
      selector: (item) => item.annualTurnover,
    },
    {
      name: "employeesCount",
      selector: (item) => item.employeesCount,
    },
    {
      name: "fullName",
      selector: (item) => item.fullName,
    },
    {
      name: "organizationType",
      selector: (item) => item.organizationType,
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
      const res = await axios.get(`${V1APIURL}/orgs`, getAxios());
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
      const res = await axios.delete(`${V1APIURL}/orgs/${item.id}`, getAxios());
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
    return <OrganizationsFormComponent closeForm={closeForm} item={item}/>;
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2>
            Organizations{" "}
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

export const OrganizationsFormComponent = ({closeForm, item}) => {
  let [formData, setFormData] = useState({
    annualTurnover: 1,
    employeesCount: 1,
    fullName: null,
    organizationType: null,
    postalAddress: {zipCode: "g684grer", town: {x: 0, y: 0, z: 0}},
    officialAddress: {zipCode: "6weg8we5", town: {x: 0, y: 0, z: 0}},
  });

  const [locationsList, setLocationsList] = useState([]);
  const [addressesList, setAddressesList] = useState([]);

  const [errors, setErrors] = useState([]);
  let Validator = require('jsonschema').Validator;
  let v = new Validator();
  let schemas = [locationSchema, addressSchema, organizationSchema];
  schemas.forEach(schema => v.addSchema(schema, schema.id));

  useEffect(() => {
  }, []);

  useEffect(() => {
    if (item) {
      setFormData({...item});
    }
  }, [item]);

  useEffect(() => {
    if (formData.useExistingLocation && locationsList.length === 0) {
      getLocations();
    }
  }, [formData.useExistingLocation, locationsList.length]);

  useEffect(() => {
    if ((formData.useExistingOfficialAddress || formData.useExistingPostalAddress) && addressesList.length === 0) {
      getAddresses();
    }
  }, [formData.useExistingOfficialAddress, formData.useExistingPostalAddress, addressesList.length]);

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
      case "officialAddress":
        setFormData(prevState => ({
          ...prevState,
          officialAddress: focusedObject
        }));
        setErrors(prevErrors => ({...prevErrors, officialAddress: ""}))
        break;
      case "postalAddress":
        setFormData(prevState => ({
          ...prevState,
          postalAddress: focusedObject
        }));
        setErrors(prevErrors => ({...prevErrors, postalAddress: ""}))
        break;
      case "officialTown":
        setFormData(prevState => ({
          ...prevState,
          officialAddress: {
            town: focusedObject
          }
        }));
        setErrors(prevErrors => ({...prevErrors, officialTown: ""}))
        break;
      case "postalTown":
        setFormData(prevState => ({
          ...prevState,
          postalAddress: {
            town: focusedObject
          }
        }));
        setErrors(prevErrors => ({...prevErrors, postalTown: ""}))
        break;
      default:
        break;
    }
  };

  const validateOrganization = () => {
    let errorMsg = validateFields(v, formData, schemas[2], true);
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

  const updateFields = (field, value, schema) => {
      if(field === "annualTurnover" || field === "employeesCount") {
          value = Number(value);
      }
    setFormData({...formData, [field]: value});
    let errorMsg = validateFields(v, value, schema).toString();
    if (errorMsg !== '') {
      setErrors(prevErrors => ({
        ...prevErrors,
        [`$organization_${field}`]: errorMsg
      }));
    }
  };

  const updateObjects = (objectProperty, field, value, schema) => {
    switch (objectProperty) {
      case "officialAddress":
        setFormData(prevState => ({
          ...prevState,
          officialAddress: {
            ...prevState.officialAddress,
            [field]: value
          }
        }));
        break;
      case "postalAddress":
        setFormData(prevState => ({
          ...prevState,
          postalAddress: {
            ...prevState.postalAddress,
            [field]: value
          }
        }));
        break;
      case "officialTown":
        value = Number(value)
        setFormData(prevState => ({
          ...prevState,
          officialAddress: {
            ...prevState.officialAddress,
            town: {
              ...prevState.officialAddress.town,
              [field]: value
            }
          }
        }));
        break;
      case "postalTown":
        value = Number(value)
        setFormData(prevState => ({
          ...prevState,
          postalAddress: {
            ...prevState.postalAddress,
            town: {
              ...prevState.postalAddress.town,
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

  const submitForm = async (e) => {
    e.preventDefault();
    const isValid = validateOrganization();
    if (!isValid) {
      alert('Не получилось создать Organization.');
      return;
    }
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common = {
        'Authorization': `Bearer ${token}`
      };
      formData = removeKey(formData, "authorities");
      const res = await axios[item ? "put" : "post"](
        `${V1APIURL}/orgs${item ? `/${item.id}` : ""}`,
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

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2>{item ? "Edit Organization" : "Add Organization"}</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                  <fieldset>
                      <legend>Official Address</legend>
                      <label className="radio-label">
                          <span>Создать новую</span>
                          <input
                            type="radio"
                            name="officialAddressOption"
                            checked={!formData.useExistingOfficialAddress}
                            onChange={() => updateFields('useExistingOfficialAddress', false, schemas[2].properties.useExistingOfficialAddress)}
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
                                  onChange={(e) => updateObjects("officialAddress", "zipCode", e.target.value, schemas[1].properties.zipCode)}
                                  value={formData.officialAddress.zipCode}
                                />
                                {errors.officialAddress_zipCode &&
                                  <span className="error">{errors.officialAddress_zipCode}</span>}
                            </label>
                            <fieldset>
                                <legend>Official Address Town</legend>
                                <label className="radio-label">
                                    <span>Создать новую</span>
                                    <input
                                      type="radio"
                                      name="officialAddressTownOption"
                                      checked={!formData.useExistingOfficialTown}
                                      onChange={() => updateFields('useExistingOfficialTown', false, schemas[2].properties.useExistingOfficialTown)}
                                    />
                                </label>
                                {!formData.useExistingOfficialTown && (
                                  <div className="mb-4">
                                      <label htmlFor="x">Town (X)
                                          <input
                                            className="form-control"
                                            name="x"
                                            type="number"
                                            onChange={(e) => updateObjects("officialTown", 'x', e.target.value, schemas[0].properties.x)}
                                            value={formData.officialAddress.town.x}
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
                                            value={formData.officialAddress.town.y}
                                          />
                                          {errors.officialTown_y &&
                                            <span className="error">{errors.officialTown_y}</span>}
                                          <label htmlFor="x">Town (Z)
                                              <input
                                                className="form-control"
                                                name="z"
                                                type="number"
                                                onChange={(e) => updateObjects("officialTown", 'z', e.target.value, schemas[0].properties.z)}
                                                value={formData.officialAddress.town.z}
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
                                      onChange={() => updateFields('useExistingOfficialTown', true, schemas[2].properties.useExistingOfficialTown)}
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
                                {errors.officialTown &&
                                  <span className="error">{errors.officialTown}</span>}
                            </fieldset>
                        </div>
                      )}
                      <label className="radio-label">
                          <span>Выбрать существующего</span>
                          <input
                            type="radio"
                            name="officialAddressOption"
                            checked={formData.useExistingOfficialAddress}
                            onChange={() => updateFields("useExistingOfficialAddress", true, schemas[2].properties.useExistingOfficialAddress)}
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
                        onChange={(e) => updateFields('annualTurnover', e.target.value, schemas[2].properties.annualTurnover)}
                        value={formData.annualTurnover}
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
                        onChange={(e) => updateFields('employeesCount', e.target.value, schemas[2].properties.employeesCount)}
                        value={formData.employeesCount}
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
                        onChange={(e) => updateFields('fullName', e.target.value, schemas[2].properties.fullName)}
                        value={formData.fullName}
                      />
                      {errors.organization_fullName &&
                        <span className="error">{errors.organization_fullName}</span>}
                  </label>
                  <label htmlFor="organization_type">Organization Type
                      <select
                        className="dropdown-menu-dark"
                        name="organization_type"
                        onChange={(e) => updateFields("organizationType", e.target.value, schemas[2].properties.organizationType)}
                        value={formData.organizationType ?? ''}
                      >
                          <option className="dropdown-item" value={null}>Choose...</option>
                          <option className="dropdown-item" value={OrganizationEnum.COMMERCIAL}>Commercial
                          </option>
                          <option className="dropdown-item" value={OrganizationEnum.PUBLIC}>Public</option>
                          <option className="dropdown-item" value={OrganizationEnum.GOVERNMENT}>Government
                          </option>
                          <option className="dropdown-item" value={OrganizationEnum.TRUST}>Trust</option>
                          <option className="dropdown-item"
                                  value={OrganizationEnum.PRIVATE_LIMITED_COMPANY}>Private
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
                            onChange={() => updateFields('useExistingPostalAddress', false, schemas[2].properties.useExistingPostalAddress)}
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
                                  onChange={(e) => updateObjects("postalAddress", "zipCode", e.target.value, schemas[1].properties.zipCode)}
                                  value={formData.postalAddress.zipCode}
                                />
                                {errors.postalAddress_zipCode &&
                                  <span className="error">{errors.postalAddress_zipCode}</span>}
                            </label>
                            <fieldset>
                                <legend>Postal Address Town</legend>
                                <label className="radio-label">
                                    <span>Создать новую</span>
                                    <input
                                      type="radio"
                                      name="postalAddressTownOption"
                                      checked={!formData.useExistingPostalTown}
                                      onChange={() => updateFields('useExistingPostalTown', false, schemas[2].properties.useExistingPostalTown)}
                                    />
                                </label>
                                {!formData.useExistingPostalTown && (
                                  <div className="mb-4">
                                      <label htmlFor="x">Town (X)
                                          <input
                                            className="form-control"
                                            name="x"
                                            type="number"
                                            onChange={(e) => updateObjects("postalTown", 'x', e.target.value, schemas[0].properties.x)}
                                            value={formData.postalAddress.town.x}
                                          />
                                          {errors.postalTown_x &&
                                            <span className="error">{errors.postalTown_x}</span>}
                                      </label>
                                      <label htmlFor="y">Town (Y)
                                          <input
                                            className="form-control"
                                            name="y"
                                            type="number"
                                            onChange={(e) => updateObjects("postalTown", 'y', e.target.value, schemas[0].properties.y)}
                                            value={formData.postalAddress.town.y}
                                          />
                                          {errors.postalTown_y &&
                                            <span className="error">{errors.postalTown_y}</span>}
                                          <label htmlFor="x">Town (Z)
                                              <input
                                                className="form-control"
                                                name="z"
                                                type="number"
                                                onChange={(e) => updateObjects("postalTown", 'z', e.target.value, schemas[0].properties.z)}
                                                value={formData.postalAddress.town.z}
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
                                      onChange={() => updateFields('useExistingPostalTown', true, schemas[2].properties.useExistingPostalTown)}
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
                        </div>
                      )}
                      <label className="radio-label">
                          <span>Выбрать существующего</span>
                          <input
                            type="radio"
                            name="postalAddressOption"
                            checked={formData.useExistingPostalAddress}
                            onChange={() => updateFields("useExistingPostalAddress", true, schemas[2].properties.useExistingPostalAddress)}
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
                  <hr></hr>
                  <div className="mb-4">
                      <button className="btn btn-primary" type="submit">
                          <i className="fa fa-send"></i>&nbsp;Submit
                      </button>
                      <button
                        className="btn btn-secondary mx-2"
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
};
