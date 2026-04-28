import { fetchJSON } from "./api";
import type {
    PetsResponse,
    CategoriesResponse,
    LettersResponse,
} from "../types/pet";

export const getPets = () => fetchJSON<PetsResponse>("/public/data/names.json");
export const getCategories = () => fetchJSON<CategoriesResponse>("/public/data/categories.json");
export const getLetters = () => fetchJSON<LettersResponse>("/public/data/letters.json");
