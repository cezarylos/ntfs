import { getEventMyTokens, getEventTokensSupplyData } from '@/app/store/global/global.actions';
import { Slices } from '@/app/typings/slices';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '../store';

export interface EventTokensSupplyData {
  maxSupply: number | undefined;
  tokensLeft: number | undefined;
  eventId: number;
}

type SliceState = {
  isLoading: boolean;
  eventTokensSupplyData: EventTokensSupplyData;
  myEventTokens: any[];
  isMyEventTokensLoading: boolean;
};

const initialState = {
  isLoading: false,
  eventTokensSupplyData: {} as EventTokensSupplyData,
  myEventTokens: [],
  isMyEventTokensLoading: false
} as SliceState;

export const globalSlice = createSlice({
  name: Slices.GLOBAL,
  initialState,
  reducers: {
    setIsLoading: (state: SliceState, { payload }: PayloadAction<boolean>): void => {
      state.isLoading = payload;
    },
    setIsMyEventTokensLoading: (state: SliceState, { payload }: PayloadAction<boolean>): void => {
      state.isMyEventTokensLoading = payload;
    }
  },
  extraReducers: {
    [getEventMyTokens.fulfilled.type]: (state: SliceState, { payload }: PayloadAction<any[]>): void => {
      state.myEventTokens = payload;
    },
    [getEventTokensSupplyData.fulfilled.type]: (
      state: SliceState,
      { payload }: PayloadAction<EventTokensSupplyData>
    ): void => {
      state.eventTokensSupplyData = payload;
    }
  }
});

export const { setIsLoading, setIsMyEventTokensLoading } = globalSlice.actions;

export const selectIsLoading = (state: AppState) => state.global.isLoading;
export const selectIsMyEventTokensLoading = (state: AppState) => state.global.isMyEventTokensLoading;
export const selectEventSupplyData = (state: AppState) => state.global.eventTokensSupplyData;
export const selectMyEventTokens = (state: AppState) => state.global.myEventTokens;

export default globalSlice.reducer;
