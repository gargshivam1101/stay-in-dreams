import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [sidebarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  console.log(listings);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermUrl = urlParams.get("searchTerm");
    const typeUrl = urlParams.get("type");
    const parkingUrl = urlParams.get("parking");
    const furnishedUrl = urlParams.get("furnished");
    const offerUrl = urlParams.get("offer");
    const sortUrl = urlParams.get("sort");
    const orderUrl = urlParams.get("order");

    if (
      searchTermUrl ||
      typeUrl ||
      parkingUrl ||
      furnishedUrl ||
      offerUrl ||
      sortUrl ||
      orderUrl
    ) {
      setSideBarData({
        searchTerm: searchTermUrl || "",
        type: typeUrl || "all",
        parking: parkingUrl === "true" ? true : false,
        furnished: furnishedUrl === "true" ? true : false,
        offer: offerUrl === "true" ? true : false,
        sort: sortUrl || "created_at",
        order: orderUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setListings(data);
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);

  const filterChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSideBarData({ ...sidebarData, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSideBarData({ ...sidebarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSideBarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false, // handle both bool or string true
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSideBarData({ ...sidebarData, sort, order });
    }
  };

  const search = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7  border-b-2 md:border-r-2 md:min-h-screen border-amber-100">
        <form className="flex flex-col gap-8" onSubmit={search}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border p-3 rounded-lg bg-amber-50 focus:outline-none text-gray-600 w-full"
              value={sidebarData.searchTerm}
              onChange={filterChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={filterChange}
                checked={sidebarData.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={filterChange}
                checked={sidebarData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={filterChange}
                checked={sidebarData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={filterChange}
                checked={sidebarData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={filterChange}
                checked={sidebarData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={filterChange}
                checked={sidebarData.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              id="sort_order"
              className="border rounded-lg p-3"
              onChange={filterChange}
              defaultValue={"created_at_desc"}
            >
              <option value={"createdAt_desc"}>Date: latest first</option>
              <option value={"createdAt_asc"}>Date: oldest first</option>
              <option value={"regularPrice_desc"}>Price: high to low</option>
              <option value={"regularPrice_asc"}>Price: low to hight</option>
            </select>
          </div>
          <button className="p-3 bg-amber-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-70">
            Search
          </button>
        </form>
      </div>
      <div className="">
        <h1 className="text-3xl font-semibold border-b-2 p-3 text-amber-700 mt-5 border-amber-100">
          Search Results:
        </h1>
      </div>
    </div>
  );
}
