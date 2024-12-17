export const DashboardComponent = ({ setPage }) => {
  return (
    <div className="container-fluid py-5">
      <div className="row">
        {[
          {
            page: "organizations",
            title: "Организации",
            icon: "fa fa-building",
          },
          {
            page: "workers",
            title: "Работники",
            icon: "fa fa-person-digging",
          },
          {
            page: "persons",
            title: "Человеки",
            icon: "fa fa-people-group",
          },
          {
            page: "addresses",
            title: "Адреса",
            icon: "fa-solid fa-map",
          },
          {
            page: "coordinates",
            title: "Координаты",
            icon: "fa-solid fa-location-dot",
          },
          {
            page: "locations",
            title: "Локации",
            icon: "fa-solid fa-location-pin",
          },
          {
            page: "access-management",
            title: "Управление правами",
            icon: "fa-solid fa-unlock",
          },
          {
            page: "special operations",
            title: "Специальные операции",
            icon: "fa-solid fa-toolbox",
          },
        ].map((item, index) => (
          <div className="col-lg-4 col-md-6 mb-3" key={index}>
            <div className="card border border-1" onClick={() => setPage(item.page)}>
              <div className="card-header">
                <h2 className="card-title">{item.title}</h2>
              </div>
              <div className="card-body">
                <h1 className="text-center">
                  <i className={item.icon}></i>
                </h1>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
