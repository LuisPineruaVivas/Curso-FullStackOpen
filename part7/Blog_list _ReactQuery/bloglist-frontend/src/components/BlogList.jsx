import { useQuery } from "@tanstack/react-query";
import blogService from "../services/blogs";
import Blog from './Blog'
import { useUserValue } from "../hooks/userContext";
import { Link } from "react-router-dom";
import Table from 'react-bootstrap/Table'

const BlogList = ({handleLogout}) => {
    const user = useUserValue();

    const { isPending, isError, data, error } = useQuery({
        queryKey: ["blogs"],
        queryFn: blogService.getAll,
        enabled: !!user
    })

    if (isPending) {
        return <div>loading data...</div>
    }

    if (isError) {
        console.log(error.response)
        if(error.response.status === 401 && (error.response.data.error === 'invalid token' || error.response.data.error === 'token expired')) {
            return <div> Session expired, please <button onClick={handleLogout}>login</button> again</div>
        } else {
        return <div> Blog service not available due to problems in server {error.message}</div>
        }
    }

  return (
    <div>
        <Table striped bordered>
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                </tr>
            </thead>
            <tbody>
                {data.map((blog) => (
                    <tr key={blog.id}>
                        <td>
                            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> 
                        </td>
                        <td>
                            {blog.author}
                        </td>
                    </tr>
                    ))}
            </tbody>
        </Table>
    </div>
  )
}

export default BlogList;
