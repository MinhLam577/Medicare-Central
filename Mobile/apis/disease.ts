import httpRequests from "@/utils/httpRequest";

export const getCategeryDisease = (id: string) =>
    httpRequests.get(`/disease/${id}`);

export const getdisease = () => httpRequests.get("/disease/get");

export const getDiseaseCategory = (id: string) => {
    return httpRequests.get(`/disease/getCategory/${id}`);
}