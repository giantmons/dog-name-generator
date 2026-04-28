export type Gender = "M" | "F";

export interface Pet {
  id: string;
  title: string;
  /** HTML or plain-text blurb describing the name's origin/meaning. */
  definition: string;
  gender: Gender[];
  /** IDs referencing `Category.id`. */
  categories: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
}

export interface FilterGroup {
  id: string;
  label: string;
  /** IDs referencing `Category.id`. */
  categoryIds: string[];
}

/** Generic envelope used by every JSON file under `/public/data`. */
export interface ApiResponse<T> {
  data: T;
}

export type PetsResponse = ApiResponse<Pet[]>;

export interface CategoriesResponse extends ApiResponse<Category[]> {
  filterGroups: FilterGroup[];
}

export type LettersResponse = ApiResponse<string[]>;
