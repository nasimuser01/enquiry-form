import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  submitted: false,
  data: null,
};

const enquirySlice = createSlice({
  name: 'enquiry',
  initialState,
  reducers: {
    submitEnquiry: (state, action) => {
      state.submitted = true;
      state.data = action.payload;
    },
    resetEnquiry: (state) => {
      state.submitted = false;
      state.data = null;
    },
  },
});

export const { submitEnquiry, resetEnquiry } = enquirySlice.actions;
export default enquirySlice.reducer;
