import { createSlice } from '@reduxjs/toolkit';

// Holds whether an enquiry has been submitted and the submitted payload.
// Form input values are NOT stored here — they live as local state inside
// EnquiryForm. Only the final, validated submission lands in Redux.
const initialState = {
  submitted: false,
  data: null,
};

const enquirySlice = createSlice({
  name: 'enquiry',
  initialState,
  reducers: {
    // Redux Toolkit uses Immer internally, so directly assigning to `state`
    // here is safe — it produces a new immutable state behind the scenes.
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
