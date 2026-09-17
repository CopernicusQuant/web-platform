type DataServiceError = {
  detail: string;
};

const DATA_URL = import.meta.env.VITE_DATA_ENDPOINT;

export { DATA_URL };
export type { DataServiceError };
