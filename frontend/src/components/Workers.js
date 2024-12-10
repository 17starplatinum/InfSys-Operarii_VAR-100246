import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { V1APIURL, CountryEnum, ColorEnum, StatusEnum, PositionEnum, OrganizationEnum } from "../shared/constants";
import axios from "axios";
import { getAxios } from "../shared/utils";
// import { jsonschema } from "jsonschema"
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
      weight: "",
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

  const validateFields = (field, value) => {
    let errorMsg = workerValidation(field, value);
    setErrors(prevError => ({
      ...prevError,
      [field]: errorMsg
    }));
    return errorMsg;
  };

  const validateCoordinates = (field, value) => {
    let errorMsg = "";
    if (!formData.useExistingCoordinates) {
      errorMsg = coordinatesValidation(field, value);
      setErrors(prevErrors => ({
        ...prevErrors,
        [`coordinates_${field}`]: errorMsg
      }));
    }
    return errorMsg;
  };

  const validateOrganization = (field, value) => {
    let errorMsg = "";
    if (!formData.useExistingOrganization) {
      errorMsg = organizationValidation(field, value);
      setErrors(prevErrors => ({
        ...prevErrors,
        [`organization_${field}`]: errorMsg
      }));
    }
    return errorMsg;
  }

  const validatePerson = (field, value) => {
    let errorMsg = "";
    if (!formData.useExistingPerson) {
      errorMsg = personValidation(field, value);
      setErrors(prevErrors => ({
        ...prevErrors,
        [`person_${value}`]: errorMsg
      }));
    }
    return errorMsg;
  };

  const validateAddress = (field, value) => {
    let errorMsg;
    if (!(formData.useExistingOfficialAddress || formData.useExistingPostalAddress)) {
      errorMsg = addressValidation(field, value);
      setErrors(prevErrors => ({
        ...prevErrors,
        [`address_${value}`]: errorMsg
      }));
    }
  };

  const validateLocation = (field, value) => {
    let errorVar = "";
    let errorMsg = errorVar + " не должен быть пустым";
    if (!formData.useExistingLocation) {
      errorVar = locationValidation(field, value);
      if(errorVar.trim() === "") {
        errorMsg = "";
      }
      setErrors(prevErrors => ({
        ...prevErrors,
        [`location_${field}`]: errorMsg
      }));
    }
    return errorMsg;
  };

  const validateAllFields = () => {
    let valid = true;
    let newErrors = {};

    if (validateFields("name", formData.name) !== "") {
      newErrors.name = validateFields("name", formData.name);
      valid = false;
    }

    if (formData.salary === "" || isNaN(formData.salary) || Number(formData.salary) <= 0) {
      newErrors.area = "Зарплата должна быть больше 0";
      valid = false;
    }

    if (formData.rating === "" || isNaN(formData.rating) || Number(formData.rating) <= 0) {
      newErrors.population = "Рейтинг должно быть больше 0";
      valid = false;
    }

    if (!formData.position || !Object.values(PositionEnum).includes(formData.position.trim())) {
      newErrors.government = "Позиция работника обязательна";
      valid = false;
    }

    if (!formData.coordinates) {
      newErrors.coordinates = "Координаты обязательны";
      valid = false;
    } else {
      if (!formData.useExistingCoordinates) {
        if ((isNaN(formData.coordinates.x) && formData.coordinates.x === "") || Number(formData.coordinates.x) > 990) {
          newErrors.coordinates_x = "X должно быть числом не больше 990";
          valid = false;
        }
        if ((isNaN(formData.coordinates.y) && formData.coordinates.y === "") || Number(formData.coordinates.y) > 12) {
          newErrors.coordinates_y = "Y должно быть числом не больше 12";
          valid = false;
        }
      }
    }

    if (!formData.useExistingOrganization) {
      if (!formData.useExistingOfficialAddress) {
        if (!formData.organization.officialAddress.zipCode || formData.organization.officialAddress.zipCode.trim() === "") {
          newErrors.organization_officialAddress_zipCode = "Почтовый индекс не должен быть пустым";
          valid = false;
        }
        if (!formData.useExistingTown && formData.organization.officialAddress.town !== null) {
          if (!formData.organization.officialAddress.town.x || isNaN(formData.organization.officialAddress.town.x)) {
            newErrors.person_location_x = "X не должен быть пустым"
          }
          if (!formData.organization.officialAddress.town.z || isNaN(formData.organization.officialAddress.town.z)) {
            newErrors.person_location_z = "Z не должен быть пустым"
          }
        }
      }
      if ((!formData.organization.annualTurnover || isNaN(formData.organization.annualTurnover) || Number(formData.organization.annualTurnover) <= 0)) {
        newErrors.organization_annualTurnover = "Годовой оборот должен быть положительным числом и не может быть null";
        valid = false;
      }
      if (isNaN(formData.organization.employeesCount) || Number(formData.organization.employeesCount) <= 0) {
        newErrors.organization_employeesCount = "Число работников должно быть положительным числом";
        valid = false;
      }
      if (formData.organization.fullName.trim() === "" || formData.organization.fullName.toString().length > 1576) {
        newErrors.organization_fullName = "Полное название не должно быть пустым и не должно превышать 1576 символов по длине";
        valid = false;
      }
      if (!(formData.organization.type === null || formData.organization.type.trim() === "" || Object.values(OrganizationEnum).includes(formData.organization.type.trim()))) {
        newErrors.organization_type = "Национальность не должна быть пустым и должна быть из перечисленных значений";
        valid = false;
      }
      if (!formData.useExistingPostalAddress) {
        if (!formData.organization.postalAddress.zipCode || formData.organization.postalAddress.zipCode.trim() === "") {
          newErrors.organization_postalAddress_zipCode = "Почтовый индекс не должен быть пустым";
          valid = false;
        }
        if (!formData.useExistingTown && formData.organization.postalAddress.town !== null) {
          if (!formData.organization.postalAddress.town.x || isNaN(formData.organization.postalAddress.town.x)) {
            newErrors.person_location_x = "X не должен быть пустым"
          }
          if (!formData.organization.postalAddress.town.z || isNaN(formData.organization.postalAddress.town.z)) {
            newErrors.person_location_z = "Z не должен быть пустым"
          }
        }
      }

      if (!formData.useExistingPerson) {
        if (!formData.person.eyeColor || formData.person.eyeColor.trim() === "" || !Object.values(ColorEnum).includes(formData.person.eyeColor.trim())) {
          newErrors.person_eyeColor = "Цвет глаз не должен быть пустым и должен быть из перечисленных значений";
          valid = false;
        }
        if (!formData.person.hairColor === null || formData.person.hairColor.trim() === "" || Object.values(ColorEnum).includes(formData.person.hairColor.trim())) {
          newErrors.person_hairColor = "Цвет волос должен быть из перечисленных значений";
          valid = false;
        }
        if (!formData.useExistingLocation) {
          if (!formData.person.location.x || isNaN(formData.person.location.x)) {
            newErrors.person_location_x = "X не должен быть пустым"
          }
          if (!formData.person.location.z || isNaN(formData.person.location.z)) {
            newErrors.person_location_z = "Z не должен быть пустым"
          }
        }
        if (Object.prototype.toString.call(formData.person.birthday) === "[object Date]" && !isNaN(formData.person.birthday)) {
          newErrors.person_eyeColor = "День рождения должен быть валидной датой";
          valid = false;
        }
        if (!formData.person.weight || isNaN(formData.person.weight) || Number(formData.person.weight) <= 0) {
          newErrors.person_weight = "Вес человека должен быть положительным ненулевым числом";
          valid = false;
        }
        if (!formData.person.nationality || formData.person.nationality.trim() === "" || !Object.values(CountryEnum).includes(formData.person.nationality.trim())) {
          newErrors.person_hairColor = "Национальность не должна быть пустым и должна быть из перечисленных значений";
          valid = false;
        }
      }
      setErrors(newErrors);
      return valid;
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