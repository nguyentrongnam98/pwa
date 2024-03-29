import React from 'react'
import { addData, deleteData, getStoreData, initDB } from "./db";
export default function Home() {
  const [isDBReady, setIsDBReady] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [users, setUsers] = React.useState([]);

  const initDBHandler = async () => {
    const status = await initDB();
    setIsDBReady(!!status);
  }
  React.useEffect(() => {
    initDBHandler()
  },[])
  const handleAddUser = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const id = Date.now();

    if (name.trim() === '' || email.trim() === '') {
      alert('Please enter a valid name and email');
      return;
    }

    try {
      await addData('users', { name, email, id });
      handleGetUsers();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong');
      }
    }
  };

  const handleRemoveUser = async (id) => {
    try {
      await deleteData('users', 'foo');
      handleGetUsers();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Something went wrong deleting the user');
      }
    }
  };

  const handleGetUsers = async () => {
    const users = await getStoreData('users');
    setUsers(users);
  };
  return (
    <main style={{ textAlign: 'center', marginTop: '3rem' }}>
    <h1>IndexedDB</h1>
    {!isDBReady ? (
      <button onClick={initDBHandler}>Init DB</button>
    ) : (
      <>
        <h2>DB is ready</h2>
        {/* add user form */}
        <form onSubmit={handleAddUser}>
          <input type="text" name="name" placeholder="Name" />
          <input type="email" name="email" placeholder="Email" />
          <button type="submit">Add User</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button onClick={handleGetUsers}>Get Users</button>
        {users.length > 0 && (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.id}</td>
                  <td>
                    <button onClick={() => handleRemoveUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </>
    )}
  </main>
  )
}
