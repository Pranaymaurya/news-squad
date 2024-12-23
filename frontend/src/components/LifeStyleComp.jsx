import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const NewsLayout2 = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null); // Track errors

  const categories = ["All", "Travel", "Recipes", "Health & Fitness", "Music"];
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch("http://localhost:5000/api/posts");
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.posts || data.posts.length === 0) {
          setError("No posts available.");
        } else {
          setPosts(data.posts);
          setFilteredPosts(data.posts); // Initially set filteredPosts to all posts
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchPosts();
  }, []);

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setFilteredPosts(posts); // Show all posts
    } else {
      setFilteredPosts(posts.filter(post => post.category?.name === category)); // Filter by selected category
    }
  };

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`);  // Navigate to the post details page
  };

  if (loading) {
    return <p className="text-center text-xl text-gray-700">Loading posts...</p>;
  }

  if (error) {
    return <p className="text-center text-xl text-red-600">{error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b pb-3 mb-6">
        <h1 className="text-sm text-white bg-green-800 p-2">LIFESTYLE NEWS</h1>
        <nav className="flex items-center space-x-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`text-gray-600 hover:text-green-600 ${
                activeCategory === category ? "font-bold text-green-600" : ""
              }`}
            >
              {category}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.slice(0, 4).map((post, index) => (
          <div
            key={index}
            className="flex flex-col"
            onClick={() => handlePostClick(post._id)}  // Navigate to post detail on click
            style={{ cursor: 'pointer' }}
          >
            <div className="relative">
              <img
                src={post.image || "https://placehold.co/600x400"}
                alt={post.title || "Post Image"}
                className="w-full h-48 object-cover"
              />
              <span className="absolute bottom-0 left-0 text-xs bg-black text-white px-2 py-1 mb-2 hover:bg-green-600">
                {post.category?.name || "Uncategorized"}
              </span>
            </div>
            <div className="mt-4">
              <h2 className="mt-2 text-xl font-semibold hover:text-green-600">
                {post.title || "Untitled"}
              </h2>
              <p className="text-sm text-gray-600">
                {post.author || "Anonymous"} - {new Date(post.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {filteredPosts?.slice(4, 8).map((post, index) => (
          <div
            key={index}
            className="flex items-center"
            onClick={() => handlePostClick(post._id)}  // Navigate to post detail on click
            style={{ cursor: 'pointer' }}
          >
            <img
              src="https://via.placeholder.com/100"
              alt={post.title || "Post Image"}
              className="w-20 h-20 object-cover mr-4"
            />
            <div>
              <h3 className="text-sm hover:text-green-600">{post.title || "Untitled"}</h3>
              <p className="text-xs text-gray-600">{new Date(post.date).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsLayout2;
