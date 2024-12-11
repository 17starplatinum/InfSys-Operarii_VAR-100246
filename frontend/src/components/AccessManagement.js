import {useEffect, useState} from "react";
import DataTable from "react-data-table-component";
import {V1APIURL} from "../shared/constants";
import axios from "axios";
import {getAxios} from "../shared/utils";

export const AccessManagement = ({ setPage }) => {
  const columns = [
    {
      name: "ID",
      selector: (item) => item.id,
    },
    {
      name: "Username",
      selector: (item) => item.x,
    },
    {
      name: "Actions",
      grow: 1,
      cell: (item) => (
        <div className="">
          <button
            className="btn btn-primary mx-2"
            onClick={() => approve(item)}
          >
            <i className="fa fa-edit"></i>
          </button>
          <button className="btn btn-danger" onClick={() => reject(item)}>
            <i className="fa fa-trash"></i>
          </button>
        </div>
      ),
    },
  ];
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await axios.get(
          `${V1APIURL}/auth/admin-requests`,
          getAxios()
      );
      if (res.status !== 200) {
        alert(`Error: ${res.statusText}`);
        return false;
      }
      setItems(res.data?.content || []);
    } catch (error) {
      alert(`Error!`);
    }
  };

  const reject = async (item) => {
    try {
      const res = await axios.post(
        `${V1APIURL}/auth/reject-admin/${item.id}`,
        getAxios()
      );
      if (res.status !== 204) {
        alert(`Error: ${res.statusText}`);
        return false;
      }
      alert("Item rejected.");
      loadItems();
    } catch (error) {
      alert(`Error!`);
    }
  };

  const approve = async (item) => {
    try {
      const res = await axios.post(
        `${V1APIURL}/auth/approve-admin/${item.id}`,
        getAxios()
      );
      if (res.status !== 204) {
        alert(`Error: ${res.statusText}`);
        return false;
      }
      alert("Item rejected.");
      loadItems();
    } catch (error) {
      alert(`Error!`);
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2>Access Management</h2>
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

export const RequestAdminAccess = ({ setPage }) => {
  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common = {
        "Authorization": `Bearer ${token}`
      };
      const res = await axios.post(
        `${V1APIURL}/auth/request-admin`,
        getAxios()
      );
      if (res.status !== 200 || res.status !== 201) {
        alert(`Error: ${res.statusText}`);
        return false;
      }
      alert(`Request sent!`);
      setPage(true);
    } catch (error) {
      alert(`Error!`);
    }
    return false;
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2>Request Admin Access</h2>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <form onSubmit={submitForm}>
            <div className="mb-4">
              <button className="btn btn-primary" type="submit">
                <i className="fa fa-send"></i>&nbsp;Request Access
              </button>
              <button
                className="btn btn-secondary mx-2"
                type="button"
                onClick={() => setPage("dashboard")}
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
