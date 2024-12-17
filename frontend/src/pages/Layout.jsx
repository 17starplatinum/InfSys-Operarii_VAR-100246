export const LayoutPage = ({ setPage, user, content, setUser }) => {
  return (
    <>
      <div className="container-fluid mb-5">
        <div className="row fixed-top py-2 bg-dark border-bottom border-1">
          <div className="col-12">
            <span
              className="float-start text-white ps-3"
              style={{ fontSize: "2rem" }}
            >
              <b>👋 {user.username}</b>
            </span>
            <span className="float-end">
              <button
                className="btn btn-primary mx-1"
                onClick={() => setPage("organizations")}
              >
                <i className="fa fa-building"></i>&nbsp; Организации
              </button>
              <button
                className="btn btn-primary mx-1"
                onClick={() => setPage("workers")}
              >
                <i className="fa fa-person-digging"></i>&nbsp; Работники
              </button>
              <button
                className="btn btn-primary mx-1"
                onClick={() => setPage("persons")}
              >
                <i className="fa fa-people-group"></i>&nbsp; Человеки
              </button>
              <button
                className="btn btn-primary mx-1"
                onClick={() => setPage("special")}
                >
                <i className="fa fa-toolbox"></i>&nbsp; Спецы
              </button>
              <button
                className="btn btn-primary mx-1"
                onClick={() => setPage("dashboard")}
              >
                <i className="fa fa-home"></i>&nbsp; Главная
              </button>
              <button
                className="btn btn-primary mx-1"
                onClick={() => setUser(null)}
              >
                <i className="fa fa-sign-out"></i>&nbsp; Выйти
              </button>
            </span>
          </div>
        </div>
      </div>
      {content}
    </>
  );
};
