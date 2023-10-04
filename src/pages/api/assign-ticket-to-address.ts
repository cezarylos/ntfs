import { StrapiService } from '@/app/services/strapi.service';
import { getChainIdFromString, getMaticProvider } from '@/app/utils';
import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { address, eventId } = req.body;
    if (!address || !eventId) {
      return res.status(400).json({ message: 'Address and event ID are required' });
    }
    try {
      const [usedTokensResponse, holderTicketResponse, eventResponse] = await Promise.all([
        StrapiService.getUsedTokens(process.env.STRAPI_API_TOKEN as string, eventId),
        StrapiService.getTicketsByHolderAddress(process.env.STRAPI_API_TOKEN as string, address.toLowerCase(), eventId),
        StrapiService.getEventById(eventId, [
          'contractAddress',
          'ABI',
          'chainId',
          'amountOfTokensToGetReward',
          'excludedAddressesFromRewards'
        ])
      ]);

      const {
        meta: {
          pagination: { total }
        }
      } = holderTicketResponse;
      const { contractAddress, ABI, chainId, amountOfTokensToGetReward, excludedAddressesFromRewards } =
        eventResponse.data.attributes;

      const usedTokens = usedTokensResponse.data.map(ticket => ticket.attributes.tokenIds).flat();

      const excludedAddressesFromRewardsLowercase = excludedAddressesFromRewards.map(address => address.toLowerCase());

      if (excludedAddressesFromRewardsLowercase.includes(address.toLocaleString())) {
        return res.status(400).json({ message: 'Address is excluded from rewards' });
      }

      const providerUrl = getMaticProvider(getChainIdFromString(chainId));

      const web3 = new Web3(providerUrl);
      const contract = new web3.eth.Contract(ABI, contractAddress);

      const tokenIds =
        (await contract.methods.getTokensByOwner?.(address).call())?.map((tokenId: string) => Number(tokenId)) || [];

      const divideArrayIntoGroups = (arr: number[], groupSize: number): number[][] => {
        const dividedArrays = [];
        for (let i = 0; i < arr.length; i += groupSize) {
          dividedArrays.push(arr.slice(i, i + groupSize));
        }
        return dividedArrays;
      };

      const tokenIdsGroups = divideArrayIntoGroups(tokenIds, amountOfTokensToGetReward);
      const amountOfFullTokenSets = tokenIdsGroups.filter(group => group.length === amountOfTokensToGetReward).length;

      if (total >= amountOfFullTokenSets) {
        return res.status(201).json({ message: 'Ticket already assigned' });
      }

      const emptyTicketsResponse = await StrapiService.getTicketsWithoutHolderAddress(
        process.env.STRAPI_API_TOKEN as string,
        eventId
      );

      if (emptyTicketsResponse.data.length === 0) {
        return res.status(200).json({ message: 'No tickets available' });
      }

      const warningMessages = [];

      let emptyTicketId = null;

      for (let i = 0; i < tokenIdsGroups.length; i++) {
        const tokenSetNumber = i + 1;
        const tokenIdsGroup = tokenIdsGroups[i];
        const tokensCount = tokenIdsGroup.length;

        const emptyTicketFromResponse = emptyTicketsResponse.data[i];

        if (emptyTicketFromResponse) {
          emptyTicketId = emptyTicketFromResponse.id;
        }

        if (tokensCount < amountOfTokensToGetReward) {
          warningMessages.push({ tokenSetNumber, message: 'Not enough tokens to receive a reward' });
          continue;
        }

        const isUserTokenUsed = tokenIdsGroup.some(tokenId => usedTokens.includes(tokenId));

        if (isUserTokenUsed) {
          warningMessages.push({
            tokenSetNumber,
            message: 'Some of the tokens have been already used to receive the reward'
          });
          continue;
        }

        if (!emptyTicketId) {
          warningMessages.push({
            tokenSetNumber,
            message: 'Not enough tickets'
          });
          continue;
        }
        await StrapiService.assignHolderAddressToTicket(
          process.env.STRAPI_API_TOKEN as string,
          emptyTicketId,
          address.toLowerCase(),
          tokenIdsGroup
        );
      }

      return res.status(201).json({ message: 'Ticket assigned', warningMessages });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
