import {useEffect, useState} from "react";
import DataTable from "react-data-table-component";
import {V1APIURL} from "../shared/constants";
import axios from "axios";
import {getAxios, removeKey} from "../shared/utils";
import {
  addressSchema,
  locationSchema,
} from "./validation/ValidationSchemas";
import {validateFields} from "./validation/Validation";

export const AddressesComponent = ({ setPage }) => {
  const columns = [
    {
      name: "ID",
      selector: (item) => item.id,
    },
    {
      name: "ZIP Code",
      selector: (item) => item.zipCode,
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
      const res = await axios.get(`${V1APIURL}/addresses`, getAxios());
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
      const res = await axios.delete(
        `${V1APIURL}/addresses/${item.id}`,
        getAxios()
      );
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
    return <AddressesFormComponent closeForm={closeForm} item={item} />;
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2>
            Addresses{" "}
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

export const AddressesFormComponent = ({ closeForm, item }) => {
  let [formData, setFormData] = useState({
    zipCode: "",
    town: { x: 0, y: 0, z: 0 },
    useExistingTown: false
  });

  const [errors, setErrors] = useState([]);
  let Validator = require('jsonschema').Validator;
  let v = new Validator();
  let schemas = [locationSchema, addressSchema];
  schemas.forEach(schema => v.addSchema(schema, schema.id));

  const [locationsList, setLocationsList] = useState([]);

  useEffect(() => {
  }, []);

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    }
  }, [item]);

  useEffect(() => {
    if (formData.useExistingTown && locationsList.length === 0) {
      getLocations();
    }
  }, [formData.useExistingTown, locationsList.length]);

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
    setFormData(prevState => ({
      ...prevState,
      town: focusedObject
    }));
    setErrors(prevErrors => ({...prevErrors, town: ""}))
  };

  const validateAddress = () => {
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

  const updateForm = (field, value, schema) => {
    setFormData({ ...formData, [field]: value });
    let errorMsg = validateFields(v, value, schema).toString();
    if (errorMsg !== '') {
      setErrors(prevErrors => ({
        ...prevErrors,
        [`$address_${field}`]: errorMsg
      }));
    }
  };

  const updateObjects = (objectProperty, field, value, schema) => {
    value = Number(value);
    setFormData(prevState => ({
      ...prevState,
      town: {
        ...prevState.town,
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
    const isValid = validateAddress();
    if (!isValid) {
      alert('Не получилось создать Address.');
      return;
    }
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common = {
        'Authorization': `Bearer ${token}`
      };
      formData = removeKey(formData, "authorities");
      const res = await axios[item? "put" : "post"](
          `${V1APIURL}/addresses${item ?`/${item.id} `: ""}`,
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
          <h2>{item ? "Edit Item" : "Add Item"}</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <form onSubmit={submitForm}>
            <div className="mb-4">
              <label htmlFor="organization_postalAddress">
                ZipCode
                <input
                    className="form-control"
                    name="organization_postalAddress_zipCode"
                    type="text"
                    onChange={(e) => updateForm("zipCode", e.target.value, schemas[1].properties.zipCode)}
                    value={formData.zipCode}
                />
                {errors.address_zipCode &&
                    <span className="error">{errors.address_zipCode}</span>}
              </label>
              <fieldset>
                <legend>Address Town</legend>
                <label className="radio-label">
                  <span>Создать новую</span>
                  <input
                      type="radio"
                      name="addressTownOption"
                      checked={!formData.useExistingTown}
                      onChange={() => updateForm('useExistingTown', false, schemas[1].properties.useExistingTown)}
                  />
                </label>
                {!formData.useExistingTown && (
                    <div className="mb-4">
                      <label htmlFor="x">Town (X)
                        <input
                            className="form-control"
                            name="x"
                            type="number"
                            onChange={(e) => updateObjects("town", 'x', e.target.value, schemas[0].properties.x)}
                            value={formData.town.x}
                        />
                        {errors.town_x && <span className="error">{errors.town_x}</span>}
                      </label>
                      <label htmlFor="y">Town (Y)
                        <input
                            className="form-control"
                            name="y"
                            type="number"
                            onChange={(e) => updateObjects("town", 'y', e.target.value, schemas[0].properties.y)}
                            value={formData.town.y}
                        />
                        {errors.town_y && <span className="error">{errors.town_y}</span>}
                        <label htmlFor="x">Town (Z)
                          <input
                              className="form-control"
                              name="z"
                              type="number"
                              onChange={(e) => updateObjects("town", 'z', e.target.value, schemas[0].properties.z)}
                              value={formData.town.z}
                          />
                          {errors.town_z &&
                              <span className="error">{errors.town_z}</span>}
                        </label>
                      </label>
                    </div>
                )}
                <label className="radio-label">
                  <span>Выбрать существующие</span>
                  <input
                      type="radio"
                      name="addressTownOption"
                      checked={formData.useExistingTown}
                      onChange={() => updateForm('useExistingTown', true, schemas[1].properties.useExistingTown)}
                  />
                </label>
                {formData.useExistingTown && (
                    <select
                        onChange={(e) => handleObjectSelect("town", e.target.value, locationsList)}
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
                {errors.town && <span className="error">{errors.town}</span>}
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
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
