import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { V1APIURL } from "../shared/constants";
import axios from "axios";
import { getAxios } from "../shared/utils";

export const WorkersComponent = ({ setPage }) => {
  const columns = [
    {
      name: "name",
      selector: (item) => item.name,
    },
    {
      name: "salary",
      selector: (item) => item.salary,
    },
    {
      name: "rating",
      selector: (item) => item.rating,
    },
    {
      name: "creationDate",
      selector: (item) => item.creationDate,
    },
    {
      name: "position",
      selector: (item) => item.position,
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
      setItems(res.data);
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
      if (res.status !== 200) {
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
    salary: 0,
    rating: 0,
    position: "",
    coordinates: { x: 0, y: 0, z: 0 },
    organization: {
      annualTurnover: 0,
      employeesCount: 0,
      fullName: "",
      type: "",
      postalAddress: { zipCode: "", location: { x: 0, y: 0, z: 0 } },
      officialAddress: { zipCode: "", location: { x: 0, y: 0, z: 0 } },
    },
    person: {
      eyeColor: "",
      hairColor: "",
      birthday: "",
      weight: "",
      nationality: "",
      location: { x: 0, y: 0, z: 0 },
    },
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
        `${V1APIURL}/workers${item ? `/${item.id}` : ""}`,
        formData,
        getAxios()
      );
      if (res.status !== 200) {
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
            <div className="mb-4">
              <label htmlFor="name">name</label>
              <input
                className="form-control"
                name="name"
                type="number"
                onChange={updateForm}
                value={formData.name}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="salary">salary</label>
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
              <label htmlFor="rating">rating</label>
              <input
                className="form-control"
                name="rating"
                type="number"
                onChange={updateForm}
                value={formData.rating}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="position">position</label>
              <input
                className="form-control"
                name="position"
                type="text"
                onChange={updateForm}
                value={formData.position}
              />
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
                    coordinates: { ...formData.coordinates, x: e.target.value },
                  })
                }
                value={formData.coordinates.x}
              />
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
                    coordinates: { ...formData.coordinates, y: e.target.value },
                  })
                }
                value={formData.coordinates.y}
              />
            </div>
            <hr></hr>
            <div className="mb-4">
              <h3>Organization Data</h3>
            </div>
            <div className="mb-4">
              <label htmlFor="organization_annualTurnover">
                annualTurnover
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
            </div>
            <div className="mb-4">
              <label htmlFor="organization_employeesCount">
                employeesCount
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
            </div>
            <div className="mb-4">
              <label htmlFor="organization_fullName">fullName</label>
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
            </div>
            <div className="mb-4">
              <label htmlFor="organization_type">type</label>
              <input
                className="form-control"
                name="organization_type"
                type="text"
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
              />
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
            </div>
            <div className="mb-4">
              <label htmlFor="organization_postalAddress_location_x">
                Location ID (X)
              </label>
              <input
                className="form-control"
                name="organization_postalAddress_location_x"
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organization: {
                      ...formData.organization,
                      postalAddress: {
                        ...formData.organization.postalAddress,
                        location: {
                          ...formData.organization.postalAddress.location,
                          x: e.target.value,
                        },
                      },
                    },
                  })
                }
                value={formData.organization.postalAddress.location.x}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="organization_postalAddress_location_y">
                Location ID (Y)
              </label>
              <input
                className="form-control"
                name="organization_postalAddress_location_y"
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organization: {
                      ...formData.organization,
                      postalAddress: {
                        ...formData.organization.postalAddress,
                        location: {
                          ...formData.organization.postalAddress.location,
                          y: e.target.value,
                        },
                      },
                    },
                  })
                }
                value={formData.organization.postalAddress.location.y}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="organization_postalAddress_location_z">
                Location ID (Z)
              </label>
              <input
                className="form-control"
                name="organization_postalAddress_location_z"
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organization: {
                      ...formData.organization,
                      postalAddress: {
                        ...formData.organization.postalAddress,
                        location: {
                          ...formData.organization.postalAddress.location,
                          z: e.target.value,
                        },
                      },
                    },
                  })
                }
                value={formData.organization.postalAddress.location.z}
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
              <label htmlFor="organization_officialAddress_location_x">
                Location ID (X)
              </label>
              <input
                className="form-control"
                name="organization_officialAddress_location_x"
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organization: {
                      ...formData.organization,
                      officialAddress: {
                        ...formData.organization.officialAddress,
                        location: {
                          ...formData.organization.officialAddress.location,
                          x: e.target.value,
                        },
                      },
                    },
                  })
                }
                value={formData.organization.officialAddress.location.x}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="organization_officialAddress_location_y">
                Location ID (Y)
              </label>
              <input
                className="form-control"
                name="organization_officialAddress_location_y"
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organization: {
                      ...formData.organization,
                      officialAddress: {
                        ...formData.organization.officialAddress,
                        location: {
                          ...formData.organization.officialAddress.location,
                          y: e.target.value,
                        },
                      },
                    },
                  })
                }
                value={formData.organization.officialAddress.location.y}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="organization_officialAddress_location_z">
                Location ID (Z)
              </label>
              <input
                className="form-control"
                name="organization_officialAddress_location_z"
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organization: {
                      ...formData.organization,
                      officialAddress: {
                        ...formData.organization.officialAddress,
                        location: {
                          ...formData.organization.officialAddress.location,
                          z: e.target.value,
                        },
                      },
                    },
                  })
                }
                value={formData.organization.officialAddress.location.z}
              />
            </div>
            <hr></hr>
            <div className="mb-4">
              <h3>Person Data</h3>
            </div>
            <div className="mb-4">
              <label htmlFor="person_eyeColor">eyeColor</label>
              <input
                className="form-control"
                name="person_eyeColor"
                type="text"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    person: {
                      ...formData.person,
                      eyeColor: e.target.value,
                    },
                  })
                }
                value={formData.person.eyeColor}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="person_hairColor">hairColor</label>
              <input
                className="form-control"
                name="person_hairColor"
                type="text"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    person: {
                      ...formData.person,
                      hairColor: e.target.value,
                    },
                  })
                }
                value={formData.person.hairColor}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="person_birthday">birthday</label>
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
            <div className="mb-4">
              <label htmlFor="person_nationality">nationality</label>
              <input
                className="form-control"
                name="person_nationality"
                type="text"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    person: {
                      ...formData.person,
                      nationality: e.target.value,
                    },
                  })
                }
                value={formData.person.nationality}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="person_weight">weight</label>
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
};
