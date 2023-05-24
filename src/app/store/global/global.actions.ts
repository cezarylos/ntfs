'use client';

import { Web3Service } from '@/app/services/web3.service';
import { EventTokensSupplyData, setIsMyEventTokensLoading } from '@/app/store/global/global.slice';
import { EndpointsEnum } from '@/app/typings/endpoints.enum';
import { EventInterface } from '@/app/typings/event.interface';
import { Slices } from '@/app/typings/slices';
import { getChainIdFromString, getMaticProvider } from '@/app/utils';
import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
