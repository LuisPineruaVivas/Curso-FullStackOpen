import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import blogService from "../services/blogs"
import { useParams } from "react-router-dom";
import { useNotificationDispatch } from "../hooks/notificationContext";
import { useNavigate } from "react-router-dom";
import { useUserValue } from "../hooks/userContext";
import CommentForm from "../components/CommentForm";
import { ListGroup, Button } from 'react-bootstrap';

const Blog_view = () => {
    const Navigate = useNavigate();
    const { id } = useParams();
    const queryClient = useQueryClient();
    const notificationDispatch = useNotificationDispatch();
    const user = useUserValue();

    const { isPending, isError, data, error } = useQuery({
        queryKey: ["blog"],
        queryFn: () => blogService.getById(id),
        enabled: !!id,
        refetchOnWindowFocus: false
    })

    const deleteBlogMutation = useMutation({
        mutationFn: (id) => blogService.remove(id),
        onSuccess: () => {
          notificationDispatch({
            type: "SET",
            payload: {
              message: `Blog deleted`,
              type: "success",
            },
          });
          setTimeout(() => {
            notificationDispatch({ type: "CLEAR" });
          }, 5000);
          Navigate("/blogs")
        },
        onError: (error) => {
            notificationDispatch({
                type: "SET",
                payload: {
                    message: `Error deleting blog: ${error.message}`,
                    type: "danger",
                },
            });
            setTimeout(() => {
                notificationDispatch({ type: "CLEAR" });
            }, 5000);
        }
      });

      const likeBlogMutation = useMutation({
          mutationFn: (blog) => blogService.update(blog.id, { ...blog, likes: blog.likes + 1 }),
          onSuccess: (updatedBlog) => {
            queryClient.setQueryData(["blog"], updatedBlog);
            notificationDispatch({
              type: "SET",
              payload: {
                message: `You liked "${updatedBlog.title}"`,
                type: "success",
              },
            });
            setTimeout(() => {
              notificationDispatch({ type: "CLEAR" });
            }, 5000);
          },
          onError: (error) => {
            notificationDispatch({
              type: "SET",
              payload: {
                message: `Error liking blog: ${error.message}`,
                type: "danger",
              },
            });
            setTimeout(() => {
              notificationDispatch({ type: "CLEAR" });
            }, 5000);
          }
        })

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  const blog = data;

  return (
    <div>
      <h2>{blog.title}</h2>
      <p> Check it our at: <a href="#">{blog.url}</a></p>
      <h5>{blog.likes} likes <Button onClick={() => likeBlogMutation.mutate(blog)}>like</Button></h5>
      <h6>Added by {blog.user.name} | 
         {
            blog.user.username === user.username &&
            <Button className="ms-2" onClick={() => deleteBlogMutation.mutate(blog.id)}>delete</Button>
        }
      </h6>
      <h3>Comments</h3>
        <ListGroup as="ol" variant="flush">
          {blog.comments.map((comment, index) => (
            <ListGroup.Item key={index}>
                <h5>{comment} <small className="text-muted ms-2 float-end fs-6">By: Anonymous</small></h5>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <CommentForm blogId={blog.id}/>
    </div>
  )
}

export default Blog_view