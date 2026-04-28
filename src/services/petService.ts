import { fetchJSON } from "./api";
import type {
  PetsResponse,
  CategoriesResponse,
  LettersResponse,
} from "../types/pet";

export const getPets = () => fetchJSON<PetsResponse>("/data/names.json");
export const getCategories = () =>
  fetchJSON<CategoriesResponse>("/data/categories.json");
export const getLetters = () =>
  fetchJSON<LettersResponse>("/data/letters.json");
