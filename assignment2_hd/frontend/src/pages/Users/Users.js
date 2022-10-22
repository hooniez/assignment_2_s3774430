import { useEffect, useReducer } from "react";
import { getUsers } from "../../data/repository";
import UsersTable from "./UsersTable";
import UsersContext from "../../contexts/UsersContext";
import UsersReducer from "../../reducers/UsersReducer";
import UsersPerDayChart from "../../fragments/UsersPerDayChart";

export default function Users() {
  const [users, dispatchUsers] = useReducer(UsersReducer, []);

  useEffect(() => {
    const loadUsers = async () => {
      const currentUsers = await getUsers();
      dispatchUsers({ type: "SET_USERS", payload: currentUsers });
    };

    loadUsers();
  }, []);

  if (users == null) return null;

  return (
    <div className="d-flex justify-content-around">
      <div>
        <h1 className="my-4">Users</h1>
        <UsersContext.Provider value={{ users, dispatchUsers }}>
          <UsersTable></UsersTable>
        </UsersContext.Provider>
      </div>
      <UsersPerDayChart />
    </div>
  );
}
