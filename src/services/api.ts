export const fetchJSON = async <T>(path: string): Promise<T> => {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${path}: ${response.status} ${response.statusText}`,
    );
  }
  return response.json() as Promise<T>;
};
