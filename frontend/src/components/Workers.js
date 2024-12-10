import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { V1APIURL, CountryEnum, ColorEnum, StatusEnum, PositionEnum, OrganizationEnum } from "../shared/constants";
import axios from "axios";
import { getAxios } from "../shared/utils";
import { jsonschema } from "jsonschema";
import { locationValidation } from "./validation/LocationValidation";
import { coordinatesValidation } from "./validation/CoordinatesValidation";
import { addressValidation } from "./validation/AddressValidation";
import { personValidation } from "./validation/PersonValidation";
import { organizationValidation } from "./validation/OrganizationValidation";
import { workerValidation } from "./validation/WorkerValidation";


export const WorkersComponent = ({ setPage }) => {
  const columns = [
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
    return <WorkersFormComponent closeForm={closeForm} item={item} />;
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
          <DataTable columns={columns} data={items} pagination />
        </div>
      </div>
    </div>
  );
};

export const WorkersFormComponent = ({ closeForm, item }) => {
  let Validator = require('jsonschema').Validator;
  const [formData, setFormData] = useState({
    name: "",
    salary: null,
    rating: 0,
    position: "",
    status: null,
    coordinates: {x: null, y: null},
    organization: {
      annualTurnover: 0,
      employeesCount: 0,
      fullName: null,
      type: null,
      postalAddress: {zipCode: "", town: {x: 0, y: null, z: 0}},
      officialAddress: {zipCode: "", town: {x: 0, y: null, z: 0}},
    },
    person: {
      eyeColor: "",
      hairColor: null,
      birthday: null,
      weight: 0,
      nationality: "",
      location: {x: 0, y: null, z: 0},
    },
    useExistingCoordinates: false,
    useExistingOrganization: false,
    useExistingPerson: false,
    useExistingOfficialAddress: false,
    useExistingPostalAddress: false,
    useExistingLocation: false,
    useExistingTown: false
  });

  let v = new Validator();
  let locationSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    $id: "/Location",
    type: "object",
    "properties": {
      "x": {"type": "number"},
      "y": {"type": ["integer", "null"]},
      "z": {"type": "integer"}
    },
    "required": ["x", "z"]
  };
  let addressSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    "id": "/Address",
    "type": "object",
    "properties": {
      "zipCode": {"type": "string"},
      "town": {"$ref": "/Location"}
    },
    "required": ["zipCode"]
  };
  let coordinatesSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    "id": "/Coordinates",
    "type": "object",
    "properties": {
      "x": {
        "type": "number",
        "maximum": 960
      },
      "y": {
        "type": "integer",
        "maximum": 12
      }
    }
  };
  let personSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    "id": "/Person",
    "type": "object",
    "properties": {
      "eyeColor": {
        "type": "string",
        "enum": [`${ColorEnum.GREEN}`, `${ColorEnum.BLACK}`, `${ColorEnum.BLUE}`, `${ColorEnum.ORANGE}`]
      },
      "hairColor": {
        "type": ["string", "null"],
        "enum": ["", `${ColorEnum.GREEN}`, `${ColorEnum.BLACK}`, `${ColorEnum.BLUE}`, `${ColorEnum.ORANGE}`]
      },
      "birthday": {
        "type": ["string", "null"],
        "format": "date"
      },
      "location": {"$ref": "/Location"},
      "weight": {
        "type": "number",
        "exclusiveMinimum": 0
      },
      "nationality": {
        "type": "string",
        "enum": [`${CountryEnum.UNITED_KINGDOM}`, `${CountryEnum.FRANCE}`, `${CountryEnum.NORTH_KOREA}`]
      },
      "required": ["eyeColor", "location", "weight", "nationality"]
    }
  }
  let organizationSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    "id": "/Organization",
    "type": "object",
    "properties": {
      "officialAddress": {"$ref": "/Address"},
      "annualTurnover": {
        "type": "number",
        "exclusiveMinimum": 0
      },
      "employeesCount": {
        "type": "integer",
        "exclusiveMinimum": 0
      },
      "fullName": {
        "type": ["string", "null"],
        "minLength": 1,
        "maxLength": 1576
      },
      "type": {
        "type": ["string", "null"],
        "enum": ["", `${OrganizationEnum.COMMERCIAL}`, `${OrganizationEnum.PUBLIC}`, `${OrganizationEnum.GOVERNMENT}`, `${OrganizationEnum.TRUST}`, `${OrganizationEnum.PRIVATE_LIMITED_COMPANY}`]
      },
      "postalAddress": {"$ref": "/Address"}
    },
    "required": ["officialAddress", "annualTurnover", "fullName", "postalAddress"]
  };
  let workerSchema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    "id": "/Worker",
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "minLength": 1
      },
      "coordinates": {"$ref": "/Coordinates"},
      "organization": {
          "nullable": true,
          "allOf": [{"$ref": "/Organization"}]
      },
      "salary": {
        "type": ["number", "null"],
        "exclusiveMinimum": 0
      },
      "rating": {
        "type": ["integer", "null"],
        "exclusiveMinimum": 0
      },
      "position": {
        "type": "string",
        "enum": [`${PositionEnum.DIRECTOR}`, `${PositionEnum.LABORER}`, `${PositionEnum.BAKER}`]
      },
      "status": {
        "type": ["string", "null"],
        "enum": ["", `${StatusEnum.FIRED}`, `${StatusEnum.HIRED}`, `${StatusEnum.RECOMMENDED_FOR_PROMOTION}`,`${StatusEnum.REGULAR}`]
      },
      "person": {"$ref": "/Person"}
    },
    "required": ["name", "coordinates", "position", "person"]
  };
  let schemas = [locationSchema, coordinatesSchema, addressSchema, personSchema, organizationSchema, workerSchema];
  schemas.forEach(schema => v.addSchema(schema, schema.id));
  const [coordinatesList, setCoordinatesList] = useState([]);
  const [organizationsList, setOrganizationsList] = useState([]);
  const [peopleList, setPeopleList] = useState([]);
  const [addressesList, setAddressesList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [errors, setErrors] = useState({});




  v.validate(formData.organization.officialAddress, addressSchema);
  v.validate(formData.organization.postalAddress, addressSchema);
  v.validate(formData.organization.officialAddress.town, locationSchema);
  v.validate(formData.organization.postalAddress.town, locationSchema);

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
  }, [formData.useExistingCoordinates]);

  useEffect(() => {
    if (formData.useExistingOrganization && organizationsList.length === 0) {
      getOrganizations();
    }
  }, [formData.useExistingOrganization]);

  useEffect(() => {
    if (formData.useExistingPerson && organizationsList.length === 0) {
      getPeople();
    }
  }, [formData.useExistingPerson]);

  useEffect(() => {
    if ((formData.useExistingOfficialAddress || formData.useExistingPostalAddress) && addressesList.length === 0) {
      getAddresses();
    }
  }, [formData.useExistingOfficialAddress, formData.useExistingPostalAddress]);

  useEffect(() => {
    if (formData.useExistingLocation && locationsList.length === 0) {
      getLocations();
    }
  }, [formData.useExistingLocation]);

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

  const handleCoordinatesSelect = (value) => {
    const focusedCoordinates = coordinatesList.find(coords => coords.id === Number(value));
    setFormData(prevState => ({
      ...prevState,
      coordinates: focusedCoordinates
    }));
    setErrors(prevErrors => ({...prevErrors, coordinates: ""}));
  };

  const handleOrganizationSelect = (value) => {
    const focusedOrganization = organizationsList.find(org => org.id === Number(value));
    setFormData(prevState => ({
      ...prevState,
      organization: focusedOrganization
    }));
    setErrors(prevErrors => ({...prevErrors, organization: ""}));
  };

  const handlePersonSelect = (value) => {
    const focusedPerson = peopleList.find(person => person.id === Number(value));
    setFormData(prevState => ({
      ...prevState,
      person: focusedPerson
    }));
    setErrors(prevErrors => ({...prevErrors, person: ""}));
  };

  const handleOfficialAddressSelect = (value) => {
    const focusedAddress = addressesList.find(addr => addr.id === Number(value));
    setFormData(prevState => ({
      ...prevState,
      officialAddress: focusedAddress
    }));
    setErrors(prevErrors => ({...prevErrors, officialAddress: ""}))
  };

  const handlePostalAddressSelect = (value) => {
    const focusedAddress = addressesList.find(addr => addr.id === Number(value));
    setFormData(prevState => ({
      ...prevState,
      postalAddress: focusedAddress
    }));
    setErrors(prevErrors => ({...prevErrors, postalAddress: ""}))
  };

  const handleLocationSelect = (value) => {
    const focusedLocation = locationsList.find(location => location.id === Number(value));
    setFormData(prevState => ({
      ...prevState,
      location: focusedLocation
    }));
    setErrors(prevErrors => ({...prevErrors, location: ""}))
  };

  const handleTownSelect = (value) => {
    const focusedLocation = locationsList.find(town => town.id === Number(value));
    setFormData(prevState => ({
      ...prevState,
      town: focusedLocation
    }));
    setErrors(prevErrors => ({...prevErrors, town: ""}))
  };

  const updateForm = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const isValid = validateFields();
    if (!isValid) {
      alert('Не получилось создать Worker.');
      return;
    }
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common = {
        'Authorization': `Bearer ${token}`
      };
      const res = await axios.post(
          `${V1APIURL}/workers${item ? `/${item.id}` : ""}`,
          formData,
          getAxios()
      );
      if (res.status !== 200 || res.status !== 201) {
        alert(`Error: ${res.statusText}`);
        return false;
      }
      alert(`Item ${item ? "Updated" : "Deleted"}`);
      closeForm(true);
    } catch (error) {
      alert(`Error!`);
    }
    return false;
  };

  const validateFields = () => {
    let errorMsg = v.validate(formData, workerSchema, {nestedErrors: true}).toString()
      if(errorMsg === "") {
        return true;
      }
      console.log(errorMsg);
      return false;
  };


    return (
        <div className="container py-5">
          <div className="row">
            <div className="col-12">
              <h2>{item ? "Edit Item" : "Add Item"}</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <form onSubmit={submitForm}>
                <div className="mb-4">
                  <label htmlFor="Name">name</label>
                  <input
                      className="form-control"
                      name="name"
                      type="text"
                      onChange={updateForm}
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
                      onChange={updateForm}
                      value={formData.salary}
                      step={0.01}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="Rating">rating</label>
                  <input
                      className="form-control"
                      name="rating"
                      type="number"
                      onChange={updateForm}
                      value={formData.rating}
                  />
                  {errors.rating && <span className="error">{errors.rating}</span>}
                </div>
                <div className="mb-4 dropdown">
                  <label htmlFor="Position">Position</label>
                  <select
                      className="dropdown-menu-dark"
                      name="position"
                      onChange={updateForm}
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
                      onChange={updateForm}
                      value={formData.status}
                  >
                    <option className="dropdown-item" value=""></option>
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
                <div className="mb-4">
                  <h3>Coordinates</h3>
                </div>
                <div className="mb-4">
                  <label htmlFor="x">Coordinates ID (X)</label>
                  <input
                      className="form-control"
                      name="x"
                      type="number"
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            coordinates: {...formData.coordinates, x: e.target.value},
                          })
                      }
                      value={formData.coordinates.x}
                  />
                  {errors.coordinates_x && <span className="error">{errors.coordinates_x}</span>}
                </div>
                <div className="mb-4">
                  <label htmlFor="y">Location ID (Y)</label>
                  <input
                      className="form-control"
                      name="y"
                      type="number"
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            coordinates: {...formData.coordinates, y: e.target.value},
                          })
                      }
                      value={formData.coordinates.y}
                  />
                  {errors.coordinates_y && <span className="error">{errors.coordinates_y}</span>}
                </div>
                <hr></hr>
                <div className="mb-4">
                  <h3>Organization Data</h3>
                </div>
                <div className="mb-4">
                  <label htmlFor="organization_annualTurnover">
                    Annual Turnover
                  </label>
                  <input
                      className="form-control"
                      name="organization_annualTurnover"
                      type="number"
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization: {
                              ...formData.organization,
                              annualTurnover: e.target.value,
                            },
                          })
                      }
                      value={formData.organization.annualTurnover}
                  />
                  {errors.organization_annualTurnover && <span className="error">{errors.organization_annualTurnover}</span>}
                </div>
                <div className="mb-4">
                  <label htmlFor="organization_employeesCount">
                    Employees Count
                  </label>
                  <input
                      className="form-control"
                      name="organization_employeesCount"
                      type="number"
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization: {
                              ...formData.organization,
                              employeesCount: e.target.value,
                            },
                          })
                      }
                      value={formData.organization.employeesCount}
                  />
                  {errors.organization_employeesCount && <span className="error">{errors.organization_employeesCount}</span>}
                </div>
                <div className="mb-4">
                  <label htmlFor="organization_fullName">Full Name</label>
                  <input
                      className="form-control"
                      name="organization_fullName"
                      type="text"
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization: {
                              ...formData.organization,
                              fullName: e.target.value,
                            },
                          })
                      }
                      value={formData.organization.fullName}
                  />
                  {errors.organization_fullName && <span className="error">{errors.organization_fullName}</span>}
                </div>
                <div className="mb-4 dropdown">
                  <label htmlFor="organization_type">Organization Type</label>
                  <select
                      className="dropdown-menu-dark"
                      name="organization_type"
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization: {
                              ...formData.organization,
                              type: e.target.value,
                            },
                          })
                      }
                      value={formData.organization.type}
                  >
                    <option className="dropdown-item" value={OrganizationEnum.COMMERCIAL}>Commercial</option>
                    <option className="dropdown-item" value={OrganizationEnum.PUBLIC}>Public</option>
                    <option className="dropdown-item" value={OrganizationEnum.GOVERNMENT}>Government</option>
                    <option className="dropdown-item" value={OrganizationEnum.TRUST}>Trust</option>
                    <option className="dropdown-item" value={OrganizationEnum.PRIVATE_LIMITED_COMPANY}>Private Limited
                      Company
                    </option>
                  </select>
                  {errors.organization_type && <span className="error">{errors.organization_type}</span>}
                </div>
                <hr></hr>
                <div className="mb-4">
                  <label htmlFor="organization_postalAddress_zipCode">
                    Organization Postal Address Zip Code
                  </label>
                  <input
                      className="form-control"
                      name="organization_postalAddress_zipCode"
                      type="text"
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization: {
                              ...formData.organization,
                              postalAddress: {
                                ...formData.organization.postalAddress,
                                zipCode: e.target.value,
                              },
                            },
                          })
                      }
                      value={formData.organization.postalAddress.zipCode}
                  />
                  {errors.address_zipCode && <span className="error">{errors.organization_address_zipCode}</span>}

                </div>
                <div className="mb-4">
                  <label htmlFor="organization_postalAddress_town_x">
                    Town (X)
                  </label>
                  <input
                      className="form-control"
                      name="organization_postalAddress_town_x"
                      type="number"
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization: {
                              ...formData.organization,
                              postalAddress: {
                                ...formData.organization.postalAddress,
                                town: {
                                  ...formData.organization.postalAddress.town,
                                  x: e.target.value,
                                },
                              },
                            },
                          })
                      }
                      value={formData.organization.postalAddress.town.x}
                  />
                  {errors.location_x && <span className="error">{errors.location_x}</span>}
                </div>
                <div className="mb-4">
                  <label htmlFor="organization_postalAddress_town_y">
                    Town (Y)
                  </label>
                  <input
                      className="form-control"
                      name="organization_postalAddress_town_y"
                      type="number"
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization: {
                              ...formData.organization,
                              postalAddress: {
                                ...formData.organization.postalAddress,
                                town: {
                                  ...formData.organization.postalAddress.town,
                                  y: e.target.value,
                                },
                              },
                            },
                          })
                      }
                      value={formData.organization.postalAddress.town.y}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="organization_postalAddress_town_z">
                    Town (Z)
                  </label>
                  <input
                      className="form-control"
                      name="organization_postalAddress_town_z"
                      type="number"
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization: {
                              ...formData.organization,
                              postalAddress: {
                                ...formData.organization.postalAddress,
                                town: {
                                  ...formData.organization.postalAddress.town,
                                  z: e.target.value,
                                },
                              },
                            },
                          })
                      }
                      value={formData.organization.postalAddress.town.z}
                  />
                </div>
                <hr></hr>
                <div className="mb-4">
                  <label htmlFor="organization_officialAddress_zipCode">
                    Organization Official Address Zip Code
                  </label>
                  <input
                      className="form-control"
                      name="organization_officialAddress_zipCode"
                      type="text"
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization: {
                              ...formData.organization,
                              officialAddress: {
                                ...formData.organization.officialAddress,
                                zipCode: e.target.value,
                              },
                            },
                          })
                      }
                      value={formData.organization.officialAddress.zipCode}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="organization_officialAddress_town_x">
                    Town (X)
                  </label>
                  <input
                      className="form-control"
                      name="organization_officialAddress_town_x"
                      type="number"
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization: {
                              ...formData.organization,
                              officialAddress: {
                                ...formData.organization.officialAddress,
                                town: {
                                  ...formData.organization.officialAddress.town,
                                  x: e.target.value,
                                },
                              },
                            },
                          })
                      }
                      value={formData.organization.officialAddress.town.x}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="organization_officialAddress_town_y">
                    Town (Y)
                  </label>
                  <input
                      className="form-control"
                      name="organization_officialAddress_town_y"
                      type="number"
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization: {
                              ...formData.organization,
                              officialAddress: {
                                ...formData.organization.officialAddress,
                                town: {
                                  ...formData.organization.officialAddress.town,
                                  y: e.target.value,
                                },
                              },
                            },
                          })
                      }
                      value={formData.organization.officialAddress.town.y}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="organization_officialAddress_town_z">
                    Town (Z)
                  </label>
                  <input
                      className="form-control"
                      name="organization_officialAddress_town_z"
                      type="number"
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            organization: {
                              ...formData.organization,
                              officialAddress: {
                                ...formData.organization.officialAddress,
                                town: {
                                  ...formData.organization.officialAddress.town,
                                  z: e.target.value,
                                },
                              },
                            },
                          })
                      }
                      value={formData.organization.officialAddress.town.z}
                  />
                </div>
                <hr></hr>
                <div className="mb-4">
                  <h3>Person Data</h3>
                </div>
                <div className="mb-4 dropdown">
                  <label htmlFor="person_eyeColor">Eye Color</label>
                  <select className="dropdown-menu-dark" name="person_eyeColor"
                          onChange={(e) => setFormData({
                            ...formData,
                            person: {
                              ...formData.person,
                              eyeColor: e.target.value,
                            },
                          })
                          }
                          value={formData.person.eyeColor}>
                    <option className="dropdown-item" value={ColorEnum.GREEN}>Green</option>
                    <option className="dropdown-item" value={ColorEnum.BLACK}>Black</option>
                    <option className="dropdown-item" value={ColorEnum.BLUE}>Blue</option>
                    <option className="dropdown-item" value={ColorEnum.ORANGE}>Orange</option>
                  </select>
                </div>
                <div className="mb-4 dropdown">
                  <label htmlFor="person_hairColor">Hair Color</label>
                  <select className="dropdown-menu-dark" name="person_hairColor"
                          onChange={(e) => setFormData({
                            ...formData,
                            person: {
                              ...formData.person,
                              hairColor: e.target.value,
                            },
                          })
                          }
                          value={formData.person.hairColor}>
                    <option className="dropdown-item" value={""}></option>
                    <option className="dropdown-item" value={ColorEnum.GREEN}>Green</option>
                    <option className="dropdown-item" value={ColorEnum.BLACK}>Black</option>
                    <option className="dropdown-item" value={ColorEnum.BLUE}>Blue</option>
                    <option className="dropdown-item" value={ColorEnum.ORANGE}>Orange</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="person_birthday">Birthday</label>
                  <input
                      className="form-control"
                      name="person_birthday"
                      type="date"
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            person: {
                              ...formData.person,
                              birthday: e.target.value,
                            },
                          })
                      }
                      value={formData.person.birthday}
                  />
                </div>
                <div className="mb-4 dropdown">
                  <label htmlFor="person_nationality">Nationality</label>
                  <select className="dropdown-menu-dark" name="person_nationality"
                          onChange={(e) => setFormData({
                            ...formData,
                            person: {
                              ...formData.person,
                              nationality: e.target.value,
                            },
                          })
                          }
                          value={formData.person.nationality}>
                    <option className="dropdown-item" value={CountryEnum.UNITED_KINGDOM}>United Kingdom</option>
                    <option className="dropdown-item" value={CountryEnum.FRANCE}>France</option>
                    <option className="dropdown-item" value={CountryEnum.NORTH_KOREA}>North Korea</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="person_weight">Weight</label>
                  <input
                      className="form-control"
                      name="person_weight"
                      type="text"
                      step={0.01}
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            person: {
                              ...formData.person,
                              weight: e.target.value,
                            },
                          })
                      }
                      value={formData.person.weight}
                  />
                </div>
                <hr></hr>
                <div className="mb-4">
                  <label htmlFor="person_location_x">
                    Person Location X
                  </label>
                  <input
                      className="form-control"
                      name="person_postalAddress_x"
                      type="number"
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            person: {
                              ...formData.person,
                              location: {
                                ...formData.person.location,
                                x: e.target.value,
                              },
                            },
                          })
                      }
                      value={formData.person.location.x}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="person_location_y">
                    Person Location Y
                  </label>
                  <input
                      className="form-control"
                      name="person_postalAddress_y"
                      type="number"
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            person: {
                              ...formData.person,
                              location: {
                                ...formData.person.location,
                                y: e.target.value,
                              },
                            },
                          })
                      }
                      value={formData.person.location.y}
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="person_location_z">
                    Person Location Z
                  </label>
                  <input
                      className="form-control"
                      name="person_postalAddress_z"
                      type="number"
                      onChange={(e) =>
                          setFormData({
                            ...formData,
                            person: {
                              ...formData.person,
                              location: {
                                ...formData.person.location,
                                z: e.target.value,
                              },
                            },
                          })
                      }
                      value={formData.person.location.z}
                  />
                </div>
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
        // alert(`Item ${item ? "Updated" : "Deleted"}`);

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