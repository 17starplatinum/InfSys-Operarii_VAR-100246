import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { V1APIURL, CountryEnum, ColorEnum, StatusEnum, PositionEnum, OrganizationEnum } from "../shared/constants";
import axios from "axios";
import { getAxios } from "../shared/utils";

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
    salary: 0,
    rating: 0,
    position: "",
    status: "",
    coordinates: { x: 0, y: 0 },
    organization: {
      annualTurnover: 0,
      employeesCount: 0,
      fullName: "",
      type: "",
      postalAddress: { zipCode: "", town: { x: 0, y: 0, z: 0 } },
      officialAddress: { zipCode: "", town: { x: 0, y: 0, z: 0 } },
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
            <div className="mb-4">
              <label htmlFor="Name">name</label>
              <input
                  className="form-control"
                  name="name"
                  type="text"
                  onChange={updateForm}
                  value={formData.name}
              />
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
            </div>
            <div className="mb-4 dropdown">
              <label htmlFor="Status">Status</label>
              <select
                  className="dropdown-menu-dark"
                  name="status"
                  onChange={updateForm}
                  value={formData.status}
              >
                <option className="dropdown-item" value={StatusEnum.FIRED}>Fired</option>
                <option className="dropdown-item" value={StatusEnum.HIRED}>Hired</option>
                <option className="dropdown-item" value={StatusEnum.RECOMMENDED_FOR_PROMOTION}>Recommended For Promotion</option>
                <option className="dropdown-item" value={StatusEnum.REGULAR}>Regular</option>
              </select>
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
                <option className="dropdown-item" value={OrganizationEnum.PRIVATE_LIMITED_COMPANY}>Private Limited Company</option>
              </select>
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
};

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
    if(fireByWorkerId) {
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
      if(apiString === "count-by-people" || apiString === "count-by-less-than-rating") {
        res = await axios.get(url, getAxios());
      } else if(apiString !== "delete-by-person") {
        res = await axios.put(url, formData, getAxios());
      } else {
        res = await axios.delete(url, getAxios());
      }

      if (res.status !== 200 || res.status !== 204) {
        alert(`Error: ${res.statusText}`);
        return false;
      }
      alert(`Item ${item ? "Updated" : "Deleted"}`);

    } catch (error) {
      alert(`Error!`);
    }
    return false;
  };

  return(
      <div className="container py-5">
        <div className="row">

        </div>
      </div>
  );
}