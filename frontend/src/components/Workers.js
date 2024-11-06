import { useEffect, useState } from "react";
import { SAMPLE_USERS } from "../shared/data";

export const WorkersComponent = ({ setPage }) => {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [item, setItem] = useState();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setItems(SAMPLE_USERS);
  };

  const closeForm = (data) => {
    if (data) {
      setItems([...items, data]);
      // TODO
    }
    setShowForm(false);
  };

  const editItem = (item) => {
    setItem(item);
    setShowForm(true);
  };

  const deleteItem = async (item) => {
    setItems(items.filter((i) => i.id !== item.id));
    // TODO
    // loadItems()
  };

  const addItem = () => {
    setItem(null);
    setShowForm(true)
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
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.position}</td>
                    <td>
                      <button
                        className="btn btn-primary mx-2"
                        onClick={() => editItem(item)}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => deleteItem(item)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WorkersFormComponent = ({ closeForm, item }) => {
  const [formData, setFormData] = useState({ name: "", position: "" });

  useEffect(() => {
    if (item) {
      setFormData({...item});
    }
  }, [item]);

  const updateForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();
    console.log(formData);
    closeForm(formData);
    return false;
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2>{item ? "Edit Worker" : "Add Worker"}</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <form onSubmit={submitForm}>
            <div className="mb-4">
              <label htmlFor="name">Name</label>
              <input
                className="form-control"
                name="name"
                type="text"
                onChange={updateForm}
                value={formData.name}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password">Position</label>
              <input
                className="form-control"
                name="position"
                type="text"
                onChange={updateForm}
                value={formData.position}
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
