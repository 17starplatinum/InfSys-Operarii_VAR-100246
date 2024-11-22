import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { V1APIURL } from "../shared/constants";
import axios from "axios";
import { getAxios } from "../shared/utils";

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
  const [items, setItems] = useState(Array.from({length: 100}, (_, i) => ({zipCode: i, y: i, id: i})));
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
      const res = await axios.delete(
        `${V1APIURL}/addresses/${item.id}`,
        getAxios()
      );
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
  const [formData, setFormData] = useState({
    zipCode: "",
    town: { x: 0, y: 0, z: 0 },
    locationWrapper: null,
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
        `${V1APIURL}/addresses${item ? `/${item.id}` : ""}`,
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
              <label htmlFor="zipCode">ZIP Code</label>
              <input
                className="form-control"
                name="zipCode"
                type="text"
                onChange={updateForm}
                value={formData.zipCode}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="x">Location ID (X)</label>
              <input
                className="form-control"
                name="x"
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    town: { ...formData.town, x: e.target.value },
                  })
                }
                value={formData.town.x}
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
                    town: { ...formData.town, y: e.target.value },
                  })
                }
                value={formData.town.y}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="z">Location ID (Z)</label>
              <input
                className="form-control"
                name="z"
                type="number"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    town: { ...formData.town, z: e.target.value },
                  })
                }
                value={formData.town.z}
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
