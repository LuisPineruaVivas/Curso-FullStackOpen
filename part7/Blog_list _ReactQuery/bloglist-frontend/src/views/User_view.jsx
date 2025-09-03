import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import userService from "../services/user";
import { useParams } from "react-router-dom";
import { Card, Col, Row } from 'react-bootstrap';


const User_view = () => {
    const { id } = useParams();

    const { isPending, isError, data, error } = useQuery({
        queryKey: ["user"],
        queryFn: () => userService.getById(id),
        enabled: !!id
    })

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const user = data;

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>Added Blogs</h3>
      <Row>
        {user.blogs.map(blog => (
          <Col>
            <Card border="primary" style={{ width: '18rem' }}>
              <Card.Header>
                <Card.Title>{blog.title}</Card.Title>
              </Card.Header>
              <Card.Body>
                <Card.Text>
                  Check out this blog at: <br /><Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                  <p>Author: {blog.author}</p>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

    </div>
  )
}

export default User_view