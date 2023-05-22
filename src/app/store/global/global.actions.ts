'use client';

import { Web3Service } from '@/app/services/web3.service';
import { EventTokensSupplyData, setIsMyEventTokensLoading } from '@/app/store/global/global.slice';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { EventInterface } from '@/app/typings/event.interface';
import { Slices } from '@/app/typings/slices';
import { getChainIdFromString, getMaticProvider } from '@/app/utils';
import { createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

export const getEventMyTokens = createAsyncThunk(
  `${Slices.GLOBAL}/getEventMyTokens`,
  async (
    {
      address,
      eventId,
      eventChainId
    }: {
      eventChainId: string;
      address: string;
      eventId: string | number;
    },
    { dispatch }
  ): Promise<any[]> => {
    const providerUrl = getMaticProvider(eventChainId);
    try {
      await dispatch(setIsMyEventTokensLoading(true));
      const myTokensResponse = await axios.get(`/api/${EndpointsEnum.GET_MY_TOKENS}`, {
        params: {
          providerUrl,
          address,
          eventId
        }
      });
      return myTokensResponse.data;
    } catch (e) {
      console.error(e);
      return [];
    } finally {
      await dispatch(setIsMyEventTokensLoading(false));
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
