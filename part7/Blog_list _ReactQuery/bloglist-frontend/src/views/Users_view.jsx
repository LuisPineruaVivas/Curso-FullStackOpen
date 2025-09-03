import { useQuery } from "@tanstack/react-query";
import userService from "../services/user";
import { useUserValue } from "../hooks/userContext";
import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table'

const Users_view = () => {
    const user = useUserValue();

    const { isPending, isError, data, error } = useQuery({
          queryKey: ["users"],
          queryFn: userService.getAll,
          enabled: !!user
      })

  if (isPending) {
    return <div>Loading...</div>;
  }
  
  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
        <h2>Users</h2>
          <Table striped bordered>
            <thead>
                <tr>
                    <th>User</th>
                    <th>Blogs Created</th>
                </tr>
            </thead>
            <tbody>
                {data.map((user) => (
                    <tr key={user.id}>
                        <td>
                            <Link to={`/users/${user.id}`} key={user.id}>
                                {user.name}
                            </Link>
                        </td>
                        <td>{user.blogs.length}</td>
                    </tr>
                    ))}
            </tbody>
        </Table>
    </div>
  )
}

export default Users_view