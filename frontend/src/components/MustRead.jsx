import axios from "axios";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const Mustread = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(2);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts");
        if (response.data && Array.isArray(response.data.posts)) {
          setArticles(response.data.posts);
        } else {
          setError("No posts found.");
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-black m-10">{error}</p>;
  }

  const sortedArticles = Array.isArray(articles)
    ? [...articles].sort((a, b) => b.views - a.views)
    : [];

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedArticles.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleArticleClick = (articleId) => {
    navigate(`/post/${articleId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4">
        <span className="text-white text-sm p-2 bg-black">MUST READ</span>
        <br />
        <div className="pt-1">
          <hr className="border-black pt-2 border-double" />
        </div>
      </h2>

      {currentPosts.length === 0 ? (
        <p className="text-center text-gray-500">No articles found.</p>
      ) : (
        <div className="space-y-6">
          {currentPosts.map((article, index) => {
            const formattedDate = article.createdAt
              ? format(new Date(article.createdAt), "MMMM dd, yyyy")
              : "No Date Available";

            return (
              <div
                key={index}
                className="items-start bg-white hover:text-blue-500 cursor-pointer"
                onClick={() => handleArticleClick(article._id)}
              >
                <img
                  src={article.imgSrc || "default-image.jpg"}
                  alt={article.title}
                  className="w-80 h-40 object-cover"
                />
                <div className="text-left">
                  <h2 className="text-xl md:text-xl font-semibold mb-2 hover:text-blue-500 pt-4">
                    {article.title}
                  </h2>
                  <span className="text-xs mb-2 text-black">
                    By {article.author} - {formattedDate}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button
          className="px-4 py-2 bg-gray-700 text-white rounded-l-md"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>

        <button
          className="px-4 py-2 bg-gray-700 text-white rounded-r-md"
          onClick={() => paginate(currentPage + 1)}
          disabled={
            currentPage === Math.ceil(sortedArticles.length / postsPerPage)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Mustread;
