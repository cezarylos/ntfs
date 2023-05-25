import { Web3Service } from '@/app/services/web3.service';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { EventInterface } from '@/app/typings/event.interface';
import { Slices } from '@/app/typings/slices';
import { getChainIdFromString, getMaticProvider } from '@/app/utils';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState } from '../store';

export const getMyEventTokens = createAsyncThunk(
  `${Slices.GLOBAL}/getMyEventTokens`,
  async (
    {
      address,
      eventId,
      eventChainId,
      skipLoading = false
    }: {
      eventChainId: string;
      address: string;
      eventId: string | number;
      skipLoading?: boolean;
    },
    { dispatch }
  ): Promise<any[]> => {
    const providerUrl = getMaticProvider(eventChainId);
    try {
      if (!skipLoading) {
        await dispatch(setIsMyEventTokensLoading(true));
      }

      const params = {
        providerUrl,
        address,
        eventId
      } as Record<any, string>;
      const queryString = new URLSearchParams(params).toString();
      const myTokensResponse = await fetch(`/api/${EndpointsEnum.GET_MY_TOKENS}?${queryString}`, { next: { revalidate: 60 } })
      return await myTokensResponse.json();
    } catch (e) {
      console.error(e);
      return [];
    } finally {
      if (!skipLoading) {
        await dispatch(setIsMyEventTokensLoading(false));
      }
    }
  }
);

export const getEventTokensSupplyData = createAsyncThunk(
  `${Slices.GLOBAL}/getEventTokensSupplyData`,
  async ({ id: eventId, chainId }: EventInterface): Promise<EventTokensSupplyData | void> => {
    try {
      const eventChainId = getChainIdFromString(chainId);
      const { tokensLeft, maxSupply } = (await Web3Service.getTokensLeft({ eventChainId, eventId })) || {};
      return {
        tokensLeft,
        maxSupply,
        eventId
      };
    } catch (e) {
      console.error(e);
      return;
    }
  }
);

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
    [getMyEventTokens.fulfilled.type]: (state: SliceState, { payload }: PayloadAction<any[]>): void => {
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
