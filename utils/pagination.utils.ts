export interface PaginationResult<T> {
  paginatedData: T[];
  totalItems: number;
  totalPages: number;
  safeCurrentPage: number;
  startIndex: number;
  endIndex: number;
}

export function paginate<T>(
  data: T[],
  currentPage: number,
  itemsPerPage = 10,
): PaginationResult<T> {
  if (!Number.isInteger(itemsPerPage) || itemsPerPage < 1) {
    throw new Error("itemsPerPage harus berupa bilangan bulat positif.");
  }

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const normalizedPage =
    Number.isFinite(currentPage) && currentPage >= 1
      ? Math.floor(currentPage)
      : 1;

  const safeCurrentPage =
    totalPages === 0 ? 1 : Math.min(normalizedPage, totalPages);

  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return {
    paginatedData: data.slice(startIndex, endIndex),
    totalItems,
    totalPages,
    safeCurrentPage,
    startIndex,
    endIndex,
  };
}
