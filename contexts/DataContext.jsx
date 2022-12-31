import { createContext, useContext, useState } from "react";
import Web3 from "web3";
import ethers from "ethers";
import Betmarket from "../abis/Betmarket.json";
import BetToken from "../abis/BetToken.json";


const DataContext = createContext({
  account: "",
  loading: true,
  loadWeb3: async () => { },
  polymarket: null,
  polyToken: null,
});

export const DataProvider = ({ children }) => {
  const data = useProviderData();

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useData = () => useContext(DataContext);

export const useProviderData = () => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [polymarket, setPolymarket] = useState();
  const [polyToken, setPolyToken] = useState();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert("Non-Eth browser detected. Please consider using MetaMask.");
      return;
    }
    var allAccounts = await window.web3.eth.getAccounts();
    setAccount(allAccounts[0]);
    await loadBlockchainData();
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const networkId = 80001
    const deployedBetmarket = Betmarket.networks[networkId];
    const deployedBetToken = BetToken.networks[networkId];
    //
    const tempContract = new web3.eth.Contract(
      Betmarket.abi,
      deployedBetmarket && deployedBetmarket.address,
    );
    setPolymarket(tempContract);

    const tempTokenContract = new web3.eth.Contract(
      BetToken.abi,
      deployedBetToken && deployedBetToken.address,
    );

    setPolyToken(tempTokenContract);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return {
    account,
    polymarket,
    polyToken,
    loading,
    loadWeb3,
  };
};
