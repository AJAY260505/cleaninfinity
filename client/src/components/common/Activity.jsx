import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Post from "./Post";
import config from '../../config';

export default function Activity({ featuresStatus = false }) {
  const [posts, setPosts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newPost, setNewPost] = useState({
    description: "",
    image: null,
  });

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${config.backendUrl}activity`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageChange = (e) => {
    setNewPost({ ...newPost, image: e.target.files[0] });
  };

  const handleShare = async () => {
    const formData = new FormData();
    formData.append("description", newPost.description);
    if (newPost.image) formData.append("image", newPost.image);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${config.backendUrl}activity`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setPosts([
          {
            ...result,
            image: URL.createObjectURL(newPost.image),
            time: "Just now",
          },
          ...posts,
        ]);
        setShowPopup(false);
        setNewPost({ description: "", image: null });
        toast.success("Post shared successfully!");
      } else {
        console.error("Error sharing post:", response.statusText);
        toast.error("Failed to share post.");
      }
    } catch (error) {
      console.error("Error sharing post:", error);
      toast.error("An error occurred while sharing the post.");
    }
  };

  return (
    <div className="container w-full mb-20 lg:mb-10">
      <ToastContainer />
      <div className="text-2xl font-bold text-center">Activity</div>
      {posts.map((post) => (
        <div key={post.id} className="relative flex justify-center">
          <Post {...post} deleteEnabled={featuresStatus} />
        </div>
      ))}
      <button
        onClick={() => setShowPopup(true)}
        className="fixed top-14 right-2 font-medium px-4 py-2 drop"
      >
        Create a Post +
      </button>
      {showPopup && (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="drop p-4 w-11/12 lg:w-3/12">
            <h3 className="mb-2 text-lightest-green">New Post</h3>
            <textarea
              placeholder="Write something..."
              value={newPost.description}
              onChange={(e) =>
                setNewPost({ ...newPost, description: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="file-upload"
            />
            <button
              className="btn"
              onClick={() => document.getElementById("file-upload").click()}
            >
              Upload an Image
            </button>
            {newPost.image && (
              <img
                src={URL.createObjectURL(newPost.image)}
                alt="Preview"
                className="mx-auto"
              />
            )}
            <div className="flex gap-2">
              <button onClick={handleShare} className="btn">
                Share
              </button>
              <button onClick={() => setShowPopup(false)} className="btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
