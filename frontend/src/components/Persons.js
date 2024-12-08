import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {ColorEnum, CountryEnum, V1APIURL} from "../shared/constants";
import axios from "axios";
import { getAxios } from "../shared/utils";

export const PersonsComponent = ({ setPage }) => {
  const columns = [
    {
      name: "id",
      selector: (item) => item.id,
    },
    {
      name: "eyeColor",
      selector: (item) => item.eyeColor,
    },
    {
      name: "hairColor",
      selector: (item) => item.hairColor,
    },
    {
      name: "birthday",
      selector: (item) => item.birthday,
    },
    {
      name: "weight",
      selector: (item) => item.weight,
    },
    {
      name: "nationality",
      selector: (item) => item.nationality,
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
      const res = await axios.get(`${V1APIURL}/people`, getAxios());
      if (res.status !== 200) {
        alert(`Error: ${res.statusText}`);
        return false;
      }
      setItems(res.data?.content || []);
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
        `${V1APIURL}/people/${item.id}`,
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
    return <PersonsFormComponent closeForm={closeForm} item={item} />;
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2>
            Persons{" "}
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

export const PersonsFormComponent = ({ closeForm, item }) => {
  const [formData, setFormData] = useState({
    eyeColor: "",
    hairColor: "",
    birthday: "",
    weight: "",
    nationality: "",
    location: { x: 0, y: 0, z: 0 },
  });

  useEffect(() => {}, []);

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    }
  }, [item]);

  const updateForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${V1APIURL}/people${item ? `/${item.id}` : ""}`,
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
            <div className="mb-4 dropdown">
              <label htmlFor="eyeColor">Eye Color</label>
              <select className="dropdown-menu-dark" name="eyeColor"
                      onChange={updateForm}
                      value={formData.eyeColor}>
                <option className="dropdown-item" value={ColorEnum.GREEN}>Green</option>
                <option className="dropdown-item" value={ColorEnum.BLACK}>Black</option>
                <option className="dropdown-item" value={ColorEnum.BLUE}>Blue</option>
                <option className="dropdown-item" value={ColorEnum.ORANGE}>Orange</option>
              </select>
            </div>
            <div className="mb-4 dropdown">
              <label htmlFor="hairColor">Hair Color</label>
              <select className="dropdown-menu-dark" name="hairColor"
                      onChange={updateForm}
                      value={formData.hairColor}>
                <option className="dropdown-item" value={""}></option>
                <option className="dropdown-item" value={ColorEnum.GREEN}>Green</option>
                <option className="dropdown-item" value={ColorEnum.BLACK}>Black</option>
                <option className="dropdown-item" value={ColorEnum.BLUE}>Blue</option>
                <option className="dropdown-item" value={ColorEnum.ORANGE}>Orange</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="birthday">Birthday</label>
              <input
                  className="form-control"
                  name="birthday"
                  type="date"
                  onChange={updateForm}
                  value={formData.birthday}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="weight">Weight</label>
              <input
                  className="form-control"
                  name="weight"
                  type="number"
                  step={0.01}
                  onChange={updateForm}
                  value={formData.weight}
              />
            </div>
            <div className="mb-4 dropdown">
              <label htmlFor="nationality">Nationality</label>
              <select className="dropdown-menu-dark" name="nationality"
                      onChange={updateForm}
                      value={formData.nationality}>
                <option className="dropdown-item" value={CountryEnum.UNITED_KINGDOM}>United Kingdom</option>
                <option className="dropdown-item" value={CountryEnum.FRANCE}>France</option>
                <option className="dropdown-item" value={CountryEnum.NORTH_KOREA}>North Korea</option>
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="x">Location (X)</label>
              <input
                  className="form-control"
                  name="x"
                  type="number"
                  onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {...formData.location, x: e.target.value},
                      })
                  }
                  value={formData.location.x}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="y">Location (Y)</label>
              <input
                  className="form-control"
                  name="y"
                  type="number"
                  onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {...formData.location, y: e.target.value},
                      })
                  }
                  value={formData.location.y}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="z">Location (Z)</label>
              <input
                  className="form-control"
                  name="z"
                  type="number"
                  onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {...formData.location, z: e.target.value},
                      })
                  }
                  value={formData.location.z}
              />
            </div>
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
          </form>
        </div>
      </div>
    </div>
  );
};
