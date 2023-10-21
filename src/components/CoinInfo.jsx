import { useEffect, useState } from "react";
const API_KEY = import.meta.env.VITE_APP_API_KEY;
import PropTypes from 'prop-types'
const CoinInfo = ({ image, name, symbol }) => {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const getCoinPrice = async () => {
      const getData = await fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=USD&api_key=${API_KEY}&tsyms=USD`
      );
      const data = await getData.json();
      setPrice(data.USD);
    };
    getCoinPrice().catch(console.error);
  }, [symbol]);

  return (
    <>
    {price ?// rendering only if API call actually returned us data
    <div>
        <li className="main-list" key={symbol}>
        <img
          className="icons"
          src={`https://www.cryptocompare.com${image}`}
          alt={`Small icon for ${name} crypto coin`}
          width={"30px"}
          height={"30px"}
        />
        {name} <span className="tab"> </span> ${price}
      </li>
        <hr />
    </div>
        : null}
        </>
  );
};

export default CoinInfo;

CoinInfo.proptypes = {
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    };

CoinInfo.defaultProps = {
    image: "https://www.cryptocompare.com/media/37746251/btc.png",
    name: "Bitcoin",
    symbol: "BTC",
    };
