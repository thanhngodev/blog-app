import { Button, Select, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard";
import { useTranslation } from "react-i18next";

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "",
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const notFoundImg =
    "https://firebasestorage.googleapis.com/v0/b/blog-app-859aa.appspot.com/o/6167023.webp?alt=media&token=a422da4e-01c8-4544-9838-70dded973106";

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    let categoryFromUrl = urlParams.get("category");
    if (categoryFromUrl === "all") {
      categoryFromUrl = "";
    }
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}&limit=9`);
      if (!res.ok) {
        return setLoading(false);
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length >= 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    if (urlParams.get("category") === "all") {
      urlParams.set("category", "");
    }
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 9) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="">
            <label className="whitespace-nowrap font-semibold">
              {t("SEARCH_TERM")}:
            </label>
            <TextInput
              className="mt-2"
              placeholder={t("SEARCH") + "..."}
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="">
            <label className="font-semibold">{t("SORT")}:</label>
            <Select
              className="mt-2"
              onChange={handleChange}
              value={sidebarData.sort}
              id="sort"
            >
              <option value="desc">{t("LATEST")}</option>
              <option value="asc">{t("OLDEST")}</option>
            </Select>
          </div>
          <div className="">
            <label className="font-semibold">{t("CATEGORY")}:</label>
            <Select
              className="mt-2"
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="all">{t("ALL")}</option>
              <option value="uncategorized">{t("UNCATEGORIZED")}</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">JavaScript</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone="purpleToPink">
            {t("APPLY_FILTERS")}
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 ">
          {t("POSTS_RESULTS")}:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <div style={{ margin: "0 auto" }}>
              <img
                src={notFoundImg}
                alt="not found"
                style={{
                  borderRadius: "20px",
                  boxShadow: "rgba(0, 0, 0, 0.5) 0px 0px 8px 0px",
                }}
              />
            </div>
          )}
          {loading && (
            <p className="text-xl text-gray-500">{t("LOADING...")}</p>
          )}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              {t("SHOW_MORE")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
