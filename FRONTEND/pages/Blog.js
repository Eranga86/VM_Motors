import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import axios from "axios"; // Import axios for HTTP requests
import "../styles/Blog.css";

const Blog = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { user } = useContext(UserContext);
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [post, setPost] = useState([]);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const submitPost = async () => {
    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("postTitle", postTitle);
    formData.append("postDescription", postDescription);
    if (postImage) {
      formData.append("postImage", postImage); // Ensure the field name matches the server side
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/BlogPosting/post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);
      alert("Post submitted successfully!");
    } catch (error) {
      console.error("There was an error submitting the post!", error);
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/BlogPosting/get"
        );
        if (Array.isArray(response.data)) {
          setPost(response.data);
        } else {
          console.log("Unexpected response format");
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <div className="text-center">
        <p className="ph" style={{ color: "#2a2185" }}>
          Blog
        </p>
        <p className="p1">
          <i>
            "Discover the latest tips and trends in maintaining and upgrading
            your vehicle with our expert advice on high-quality spare parts,
            ensuring your ride remains smooth and efficient."
          </i>
        </p>
      </div>

      <div className="card-deck">
        {Array.isArray(post) && post.length > 0 ? (
          post.map((item, index) => (
            <div className="card" key={index}>
              <img
                className="image"
                src={`http://localhost:3001/${item.postImage}`}
                alt={item.postTitle} // Provide alt text for accessibility
              />

              <div className="card-body">
                <h5 className="card-title">{item.postTitle}</h5>
                <p className="dec2">{item.postDescription}</p>
              </div>

              {/* Footer with Read More button */}
              <div>
                <a href={`/ViewPost/${item._id}`}>
                  <button className="btn btn-primary">READ MORE</button>
                </a>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>

      {/* Example Static Cards */}
      <div className="card-deck">
        <div className="card">
          <img
            className="image"
            src="https://gsat.jp/wp-content/uploads/2023/01/201612-Mitsubishi-29-Seats-Fuso-Rosa-Bus-TPG-BE640G20-1.png"
            alt="Rosa Seat"
          />
          <div className="card-body">
            <h5 className="card-title">Elevate Your Ride</h5>
            <p className="dec2">
              Explore the features and benefits of the Rosa bus
            </p>
          </div>
          <div>
            <a href="#" className="btn btn-primary">
              Read More
            </a>
          </div>
        </div>

        <div className="card">
          <img
            className="image"
            src="https://m.media-amazon.com/images/I/61dVlFoyjGL._AC_UF894,1000_QL80_.jpg"
            alt="Compressors"
          />
          <div className="card-body">
            <h5 className="card-title">Get powerful compressors</h5>
            <p className="dec2">
              Ensure your vehicle's air conditioning system with our
              compressors.
            </p>
          </div>
          <div>
            <a href="#" className="btn btn-primary">
              Read More
            </a>
          </div>
        </div>

        <div className="card">
          <img
            className="image"
            src="https://assets.primecreative.com.au/imagegen/max/cr/625/-/s3/cougar-assets/abcau/2021/02/25/Misc/_DSC8953.jpg"
            alt="Rosa Dashboard"
          />
          <div className="card-body">
            <h5 className="card-title">Experience with dashboard.</h5>
            <p className="dec2">
              Stay informed with the Rosa bus's advanced dashboard
            </p>
          </div>
          <div>
            <a href="#" className="btn btn-primary">
              Read More
            </a>
          </div>
        </div>
      </div>

      {/* Collapsible Section */}
      <p className="text-center">
        <button className="btn1 btn-primary" onClick={handleToggleCollapse}>
          {isCollapsed ? "Show More" : "Show Less"}
        </button>
      </p>
      <div
        className={`collapse ${!isCollapsed && "show"}`}
        id="collapseExample"
      >
        <div className="card-deck">
          <div className="card">
            <img
              className="image"
              src="https://www.roscomirrors.com/images/products/Duostyle_1_Resized.png"
              alt="Rosa Dashboard"
            />
            <div className="card-body">
              <h5 className="card-title">Rosa bus side mirror set.</h5>
              <p className="dec2">
                Improve driving safety with the Rosa bus side mirror set
              </p>
            </div>
            <div>
              <a href="#" className="btn btn-primary">
                Read More
              </a>
            </div>
          </div>
          {/* Additional cards here */}
          <div className="card">
            <img
              className="image"
              src="https://fuso.com.ph/wp-content/uploads/2019/06/ROSA-automatic-passenger-door.jpg"
              alt="Rosa Dashboard"
            />
            <div className="card-body">
              <h5 className="card-title">Front door.</h5>
              <p className="dec2">
                Rosa bus with a robust and sleek front door, designed for
                durability and ease of use.
              </p>
            </div>
            <div>
              <a href="#" className="btn btn-primary">
                Read More
              </a>
            </div>
          </div>
          <div className="card">
            <img
              className="image"
              src="https://fuso.com.ph/wp-content/uploads/2019/06/ROSA-dashboard.jpg"
              alt="Rosa Dashboard"
            />
            <div className="card-body">
              <h5 className="card-title">Rosa bus steering wheel</h5>
              <p className="dec2">
                Experience with the Rosa bus steering wheel column,
              </p>
            </div>
            <div>
              <a href="#" className="btn btn-primary">
                Read More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Post creation form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitPost();
        }}
      >
        <div className="content border border-primary">
          <div className="row">
            <div className="col">
              <img
                src="https://cdn.wedevs.com/uploads/2020/04/wordpress-custom-post-type-frontend-form.png"
                alt="Form"
                className="img-thumbnail"
              />
            </div>
            <div className="col">
              <p className="p2">Create Your Post!</p>

              <div className="form-group">
                <label htmlFor="postTitle">Post Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="postTitle"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="postDescription">Description</label>
                <textarea
                  className="form-control"
                  id="postDescription"
                  value={postDescription}
                  onChange={(e) => setPostDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="postImage">Image</label>
                <input
                  type="file"
                  className="form-control"
                  id="postImage"
                  onChange={(e) => setPostImage(e.target.files[0])}
                />
              </div>

              <div className="form-group">
                <button type="submit" className="btn btn-outline-primary">
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Blog;
