import { createSlice } from '@reduxjs/toolkit';

export const initialFilters = {
  // authorName: "",
  // authorSurname: "",
  // dateFrom: "",
  // dateTo: "",
  // rating: 0,
  // sort: "",
  // order: ""
  text: "",
  category:"",
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState: initialFilters,
  reducers: {
    updateFilters: (state, action) => {
      Object.assign(state, action.payload);
    },
    
    resetFilters: (state) => {
      const textValue = state.text; 
      const categoryValue = state.category;
      return {
        ...initialFilters,
        text: textValue,
        category: categoryValue
      };
    }
  }
});

export const { updateFilters, resetFilters } = filtersSlice.actions;

export default filtersSlice;
