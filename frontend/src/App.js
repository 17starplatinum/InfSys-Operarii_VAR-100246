import "./App.css";
import { useEffect, useState } from "react";
import { LoginPage } from "./pages/Login";
import { RegisterPage } from "./pages/Register";
import { LayoutPage } from "./pages/Layout";
import { DashboardComponent } from "./components/Dashboard";
import { OrganizationsComponent } from "./components/Organizations";
import { WorkersComponent } from "./components/Workers";
import { PersonsComponent } from "./components/Persons";

function App() {
  const [user, setUser] = useState();
  const [page, setPage] = useState("");

  useEffect(() => {
    window.localStorage.setItem("token", user.token);
    window.localStorage.setItem(
      "axios",
      JSON.stringify({ headers: { Authorization: `Bearer ${user.token}` } })
    );
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
