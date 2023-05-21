import { Slices } from '@/app/typings/slices';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '../store';

type SliceState = {
  isLoading: boolean;
};

const initialState = {
  isLoading: false
} as SliceState;

export const globalSlice = createSlice({
  name: Slices.GLOBAL,
  initialState,
  reducers: {
    setIsLoading: (state: SliceState, { payload }: PayloadAction<boolean>): void => {
      state.isLoading = payload;
    }
  }
});

export const { setIsLoading } = globalSlice.actions;

export const selectIsLoading = (state: AppState) => state.global.isLoading;

export default globalSlice.reducer;
