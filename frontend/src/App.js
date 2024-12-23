import "./App.css";
import { useEffect, useState } from "react";
import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import { LayoutPage } from "./pages/Layout";
import { DashboardComponent } from "./components/Dashboard";
import { OrganizationsComponent } from "./components/Organizations";
import { WorkersComponent, SpecialComponent } from "./components/Workers";
import { PersonsComponent } from "./components/Persons";
import { CoordinatesComponent } from "./components/Coordinates";
import { LocationsComponent } from "./components/Locations";
import { AddressesComponent } from "./components/Addresses";
import { AccessManagement, RequestAdminAccess } from "./components/AccessManagement";
import {ImportHistoryComponent} from "./components/Import";

function App() {
  const [user, setUser] = useState();
  const [page, setPage] = useState("");

  useEffect(() => {
    if (user) {
      window.localStorage.setItem("token", user.token);
      window.localStorage.setItem(
        "axios",
        JSON.stringify({ headers: { Authorization: `Bearer ${user.token}` } })
      );
    }
  }, [user]);

  if (!user) {
    switch (page) {
      case "register":
        return <RegisterPage setPage={setPage} setUser={setUser} />;
      default:
        return <LoginPage setPage={setPage} setUser={setUser} />;
    }
  }
  switch (page) {
    case "persons":
      return (
        <LayoutPage
          setPage={setPage}
          user={user}
          setUser={setUser}
          content={<PersonsComponent />}
        />
      );
    case "organizations":
      return (
        <LayoutPage
          setPage={setPage}
          user={user}
          setUser={setUser}
          content={<OrganizationsComponent />}
        />
      );
    case "workers":
      return (
        <LayoutPage
          setPage={setPage}
          user={user}
          setUser={setUser}
          content={<WorkersComponent />}
        />
      );
    case "coordinates":
      return (
        <LayoutPage
          setPage={setPage}
          user={user}
          setUser={setUser}
          content={<CoordinatesComponent setPage={setPage} />}
        />
      );
    case "locations":
      return (
        <LayoutPage
          setPage={setPage}
          user={user}
          setUser={setUser}
          content={<LocationsComponent setPage={setPage} />}
        />
      );
    case "addresses":
      return (
        <LayoutPage
          setPage={setPage}
          user={user}
          setUser={setUser}
          content={<AddressesComponent setPage={setPage} />}
        />
      );
      case "special":
        return (
            <LayoutPage
              setPage={setPage}
              user={user}
              setUser={setUser}
              content={<SpecialComponent setPage={setPage} />}
            />
        );
        case "access-management":
          return (
              <LayoutPage
                setPage={setPage}
                user={user}
                setUser={setUser}
                content={user.role === "ADMIN" ? <AccessManagement setPage={setPage}/> : <RequestAdminAccess setPage={setPage}/>}
              />
          );
    case "import":
      return (
        <LayoutPage
          setPage={setPage}
          user={user}
          setUser={setUser}
          content={user.role === "ADMIN" ? <ImportHistoryComponent setPage={setPage()} admin={true}/> : <ImportHistoryComponent setPage={setPage} admin={false}/>}
          />
      );
    default:
      return (
        <LayoutPage
          setPage={setPage}
          user={user}
          setUser={setUser}
          content={<DashboardComponent setPage={setPage} />}
        />
      );
  }
}

export default App;
