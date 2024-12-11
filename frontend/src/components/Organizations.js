import {useEffect, useState} from "react";
import DataTable from "react-data-table-component";
import {OrganizationEnum, V1APIURL} from "../shared/constants";
import axios from "axios";
import {getAxios} from "../shared/utils";

export const OrganizationsComponent = ({ setPage }) => {
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
      name: "type",
      selector: (item) => item.type,
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
    return <OrganizationsFormComponent closeForm={closeForm} item={item} />;
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
          <DataTable columns={columns} data={items} pagination />
        </div>
      </div>
    </div>
  );
};

export const OrganizationsFormComponent = ({ closeForm, item }) => {
  const [formData, setFormData] = useState({
    annualTurnover: 0,
    employeesCount: 0,
    fullName: null,
    type: null,
    postalAddress: { zipCode: "", town: { x: 0, y: null, z: 0 } },
    officialAddress: { zipCode: "", town: { x: 0, y: null, z: 0 } },
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
        `${V1APIURL}/orgs${item ? `/${item.id}` : ""}`,
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
              <label htmlFor="annualTurnover">annualTurnover</label>
              <input
                className="form-control"
                name="annualTurnover"
                type="number"
                onChange={updateForm}
                value={formData.annualTurnover}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="employeesCount">employeesCount</label>
              <input
                className="form-control"
                name="employeesCount"
                type="number"
                onChange={updateForm}
                value={formData.employeesCount}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="fullName">fullName</label>
              <input
                className="form-control"
                name="fullName"
                type="text"
                onChange={updateForm}
                value={formData.fullName}
              />
            </div>
            <div className="mb-4 dropdown">
              <label htmlFor="type">Organization Type</label>
              <select
                  className="dropdown-menu-dark"
                  name="type"
                  onChange={updateForm}
                  value={formData.type}
              >
                <option className="dropdown-item" value={OrganizationEnum.COMMERCIAL}>Commercial</option>
                <option className="dropdown-item" value={OrganizationEnum.PUBLIC}>Public</option>
                <option className="dropdown-item" value={OrganizationEnum.GOVERNMENT}>Government</option>
                <option className="dropdown-item" value={OrganizationEnum.TRUST}>Trust</option>
                <option className="dropdown-item" value={OrganizationEnum.PRIVATE_LIMITED_COMPANY}>Private Limited
                  Company
                </option>
              </select>
            </div>
            <hr></hr>
            <div className="mb-4">
              <label htmlFor="postalAddress_zipCode">Postal Address Zip Code</label>
              <input
                  className="form-control"
                  name="postalAddress_zipCode"
                  type="text"
                  onChange={(e) =>
                      setFormData({
                        ...formData,
                        postalAddress: {
                          ...formData.postalAddress,
                          zipCode: e.target.value,
                        },
                      })
                  }
                  value={formData.postalAddress.zipCode}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="postalAddress_x">Town (X)</label>
              <input
                  className="form-control"
                  name="postalAddress_x"
                  type="number"
                  onChange={(e) =>
                      setFormData({
                        ...formData,
                        postalAddress: {
                          ...formData.postalAddress,
                          town: {
                            ...formData.postalAddress.town,
                            x: e.target.value,
                      },
                    },
                  })
                }
                value={formData.postalAddress.town.x}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="postalAddress_y">Town (Y)</label>
              <input
                className="form-control"
                name="postalAddress_y"
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    postalAddress: {
                      ...formData.postalAddress,
                      town: {
                        ...formData.postalAddress.town,
                        y: e.target.value,
                      },
                    },
                  })
                }
                value={formData.postalAddress.town.y}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="postalAddress_z">Town (Z)</label>
              <input
                className="form-control"
                name="postalAddress_z"
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    postalAddress: {
                      ...formData.postalAddress,
                      town: {
                        ...formData.postalAddress.town,
                        z: e.target.value,
                      },
                    },
                  })
                }
                value={formData.postalAddress.town.z}
              />
            </div>
            <hr></hr>
            <div className="mb-4">
              <label htmlFor="officialAddress_zipCode">Official Address Zip Code</label>
              <input
                className="form-control"
                name="officialAddress_zipCode"
                type="text"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    officialAddress: {
                      ...formData.officialAddress,
                      zipCode: e.target.value,
                    },
                  })
                }
                value={formData.officialAddress.zipCode}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="officialAddress_x">Town (X)</label>
              <input
                className="form-control"
                name="officialAddress_x"
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    officialAddress: {
                      ...formData.officialAddress,
                      town: {
                        ...formData.officialAddress.town,
                        x: e.target.value,
                      },
                    },
                  })
                }
                value={formData.officialAddress.town.x}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="officialAddress_y">Town ID (Y)</label>
              <input
                className="form-control"
                name="officialAddress_y"
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    officialAddress: {
                      ...formData.officialAddress,
                      town: {
                        ...formData.officialAddress.town,
                        y: e.target.value,
                      },
                    },
                  })
                }
                value={formData.officialAddress.town.y}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="officialAddress_z">Town ID (Z)</label>
              <input
                className="form-control"
                name="officialAddress_z"
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    officialAddress: {
                      ...formData.officialAddress,
                      town: {
                        ...formData.officialAddress.town,
                        z: e.target.value,
                      },
                    },
                  })
                }
                value={formData.officialAddress.town.z}
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
