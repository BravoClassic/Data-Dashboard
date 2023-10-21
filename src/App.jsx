import "./App.css";
import { useEffect, useState } from "react";
const API_KEY = import.meta.env.VITE_APP_API_KEY;
import CoinInfo from "./components/CoinInfo";
function App() {
  const [list, setList] = useState(null);
  const [search, setSearch] = useState("");
  const [listLength, setListLength] = useState(0); 
  const [PlatformType, setPlatformType] = useState("blockchain");
  const [averageBlockTime, setAverageBlockTime] = useState(0); 
  const [PlatformTypeList, setPlatformTypeList] = useState([]); 
  const [filteredResults, setFilteredResults] = useState([]);
  const [commonAlgorithm, setCommonAlgorithm] = useState([]);
  const searchItems = (searchValue) => {
    console.log(list);
    setSearch(searchValue);
    if (search !== "") {
      const filteredResults = Object.entries(list.Data).filter(([coin]) =>
        coin.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredResults(filteredResults);
    } else {
      setFilteredResults([]);
    }
    console.log(filteredResults);
  };
  useEffect(() => {
    const fetchAllCoinData = async () => {
      const crypoList = await fetch(
        `https://min-api.cryptocompare.com/data/all/coinlist?api_key=${API_KEY}`
      );
      const crypoListJson = await crypoList.json();
      setList(crypoListJson);
      let l = new Set(
        Object.values(crypoListJson.Data).map((coin) =>
          coin.PlatformType ? coin.PlatformType : null
        )
      );
      l.delete(null);
      
      setAverageBlockTime(
        Object.values(crypoListJson.Data).reduce((acc, coin) => {
          return coin.PlatformType === PlatformType ? acc + coin.BlockTime : 0
        }) / listLength
      );
      setPlatformTypeList(Array.from(l));
      setListLength(Object.keys(crypoListJson.Data).length);

    };

    console.log(PlatformTypeList);
    fetchAllCoinData().catch(console.error);
  }, []);
  return (
    <>
      <div className="whole-page">
        <h1>My Crypto List</h1>
        <div>
          <h2>Platform Type</h2>
          {PlatformTypeList.map((platformType, key) =>
            platformType ? (
              <button key={key} onClick={() => setPlatformType(platformType)}>
                {platformType}
              </button>
            ) : null
          )}
          <p>Total number of coins: {listLength}</p>
          <p>Number of Platform Type coins: {PlatformTypeList.length}</p>
          <p>
            Average Block time of all {PlatformType} coins: {averageBlockTime || 0}
          </p>
        </div>
        <input
          type="text"
          placeholder="Search..."
          onChange={(inputString) => searchItems(inputString.target.value)}
        />
        <ul>
          {search !== ""
            ? filteredResults.map(([coin]) =>
                list.Data[coin].PlatformType === PlatformType ? (
                  <CoinInfo
                    key={coin}
                    image={list.Data[coin].ImageUrl}
                    name={list.Data[coin].CoinName}
                    symbol={list.Data[coin].Symbol}
                  />
                ) : null
              )
            : list &&
              Object.entries(list.Data).map(([coin]) =>
                list.Data[coin].PlatformType === PlatformType ? (
                  <CoinInfo
                    key={coin}
                    image={list.Data[coin].ImageUrl}
                    name={list.Data[coin].CoinName}
                    symbol={list.Data[coin].Symbol}
                  />
                ) : null
              )}
        </ul>
      </div>
    </>
  );
}

export default App;
