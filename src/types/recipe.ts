export interface RecipeIngredient {
  id: number;
  name: string;
  quantity: number;
  wikiSlug: string;
}

export interface Recipe {
  id: number;
  resultId: number;
  resultName: string;
  resultQuantity: number;
  resultWikiSlug: string;
  craftingStation: string;
  ingredients: RecipeIngredient[];
}
