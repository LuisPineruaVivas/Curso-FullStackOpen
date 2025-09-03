import { Link } from "react-router-dom";
import { useUserDispatch } from "../hooks/userContext";
import blogService from "../services/blogs";
import { Button, Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

const Menu = ({user}) => {
  const userDispatch = useUserDispatch();
   const padding = {
    paddingRight: 5
  }

  const handleLogout = () => {
      window.localStorage.removeItem("loggedBlogappUser");
      userDispatch({ type: "CLEAR" });
      blogService.setToken(null);
    };

  return (
      <Navbar collapseOnSelect expand="lg" bg="dark" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">Blogs APP</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/blogs">Blogs</Nav.Link>
              <Nav.Link href="/users">Users</Nav.Link>
            </Nav>
             <Navbar.Collapse className="justify-content-end ">
                <Navbar.Text className="d-flex" >
                  Signed in as:
                   <NavDropdown className="ms-2" title={user.name} id="basic-nav-dropdown">
                    <NavDropdown.Item onClick={handleLogout}>Log Out</NavDropdown.Item>
                  </NavDropdown>
                </Navbar.Text>

              </Navbar.Collapse>
              
        </Navbar.Collapse>
        </Container>
      </Navbar>

      
      

       /* Logged in as {user.name} |{" "}
        <button onClick={handleLogout}>logout</button>*/
  )
}

export default Menu;
