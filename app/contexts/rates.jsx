'use client';
import axios from 'axios';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
// Creating the user context
export const RateContext = createContext('');

// Making the function which will wrap the whole app using Context Provider
export default function RatesStore({ children }) {
  const possibleTokens = [
    {
      id: 1,
      name: 'usdt',
      ticker: 'USDT',
      avatar: 'svg/usdt.svg',
      chains: [1, 56, 137, 43114],
    },
    {
      id: 2,
      name: 'ethereum',
      ticker: 'ETH',
      avatar: 'svg/eth.svg',
      chains: [1, 56, 137],
    },
    {
      id: 3,
      name: 'polygon',
      ticker: 'MATIC',
      avatar: 'svg/matic.svg',
      chains: [1, 56, 137, 43114],
    },
    {
      id: 5,
      name: 'tron',
      ticker: 'TRX',
      avatar: 'svg/trx.svg',

      chains: [1],
    },
    // {
    //   id: 4,
    //   name: 'busd',
    //   ticker: 'BUSD',
    //   avatar: 'svg/busd.svg',

    //   chains: [1, 56, 137],
    // },

    // {
    //   id: 8,
    //   name: 'dai',
    //   ticker: 'DAI',
    //   avatar: 'svg/dai.svg',

    //   chains: [1, 56, 137],
    // },
    // {
    //   id: 9,
    //   name: 'usdc',
    //   ticker: 'USDC',
    //   avatar: 'svg/usdc.svg',

    //   chains: [1, 56, 137],
    // },

    {
      id: 10,
      name: 'bnb',
      ticker: 'BNB',
      avatar: 'svg/bnb.svg',

      chains: [1, 56, 137, 43114],
    },
  ];

  const possibleChains = [
    { name: 'ERC20', id: '1' },
    { name: 'BEP20', id: '56' },
    { name: 'TRC20', id: '1' },
  ];
  const [token, setToken] = useState(possibleTokens[0]);
  const [ticker, setTicker] = useState('USDT');

  const [rates, setRates] = useState({
    bitcoin: 0,
    ethereum: 0,
    polygon: 0,
    usdt: 0,
  });

  // Function to fetch and update the token rate
  const fetchTokenRate = async (token, currency) => {
    try {
      // token = token == 'bnb' ? 'binance-coin' : token;
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/rates/?asset=${token}&rate=${currency}`
      );
      const { requestedRate } = response.data.data;

      const selectedToken = possibleTokens.find(
        (Token) => Token.name === token
      );
      // If a matching token is found, extract the ticker value; otherwise, set it to a default value
      const selectedTicker = selectedToken ? selectedToken.ticker : 'Unknown';

      setTicker(selectedTicker);
      // Update the rates state with the new token rate
      setRates((prevRates) => ({
        ...prevRates,
        [token]: requestedRate,
      }));
    } catch (error) {
      console.error('Error fetching token rate:', error);
    }
  };

  // useEffect(() => {
  //   fetchTokenRate(token.name, currency);
  //   const interval = setInterval(() => {
  //     fetchTokenRate(token.name, currency);
  //   }, 60000);
  //   return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  // }, [token, currency]);

  return (
    <RateContext.Provider
      value={{ rates, possibleTokens, setToken, token, ticker, possibleChains }}
    >
      {children}
    </RateContext.Provider>
  );
}

// Make useUserContext Hook to easily use our context throughout the application
export function useRateContext() {
  return useContext(RateContext);
}
