import { useEffect, useState } from "react";
import { SAMPLE_USERS } from "../shared/data";

export const WorkersComponent = ({ setPage }) => {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    setWorkers(SAMPLE_USERS);
  }, []);

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <h2>Workers</h2>
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
                </tr>
              </thead>
              <tbody>
                {workers.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.position}</td>
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
