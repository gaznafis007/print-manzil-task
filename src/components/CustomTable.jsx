import { useEffect, useState } from "react";

const CustomTable = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page = 1, searchTerm = "", perPage = itemsPerPage) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.razzakfashion.com/?paginate=${perPage}&search=${searchTerm}&page=${page}`
      );
      const result = await response.json();
      setData(result.data || []);
      setCurrentPage(result.current_page || 1);
      setTotalPages(result.last_page || 1);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchData(1, e.target.value, itemsPerPage); // Reset to page 1 when searching
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    fetchData(1, search, newItemsPerPage); // Reset to page 1 with new items per page
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      fetchData(newPage, search, itemsPerPage);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearch}
          className="w-full max-w-sm p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading Indicator */}
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* Table */}
      {!loading && (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2">ID</th>
              <th className="border border-gray-200 px-4 py-2">First Name</th>
              <th className="border border-gray-200 px-4 py-2">Last Name</th>
              <th className="border border-gray-200 px-4 py-2">Email</th>
              <th className="border border-gray-200 px-4 py-2">Created At</th>
              <th className="border border-gray-200 px-4 py-2">Updated At</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="text-center odd:bg-white even:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">{item.id}</td>
                  <td className="border border-gray-200 px-4 py-2">{item.name.split(" ")[0]}</td>
                  <td className="border border-gray-200 px-4 py-2">{item.name.split(" ")[1]}</td>
                  <td className="border border-gray-200 px-4 py-2">{item.email}</td>
                  <td className="border border-gray-200 px-4 py-2">{item.created_at}</td>
                  <td className="border border-gray-200 px-4 py-2">{item.updated_at}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="border border-gray-200 px-4 py-2 text-center">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination and Items Per Page */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          <label htmlFor="itemsPerPage" className="mr-2 text-gray-700">
            Items per page:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div className="flex items-center">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="mx-4 text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomTable;
