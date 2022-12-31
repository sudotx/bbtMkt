declare let window: any;
import { createContext, useContext, useState } from "react";
import Web3 from "web3";
import ethers from "ethers";
import Betmarket from "../abis/Betmarket.json";
import BetToken from "../abis/BetToken.json";

interface DataContextProps {
  account: string;
  loading: boolean;
  loadWeb3: () => Promise<void>;
  polymarket: any;
  polyToken: any;
}

const DataContext = createContext<DataContextProps>({
  account: "",
  loading: true,
  loadWeb3: async () => { },
  polymarket: null,
  polyToken: null,
});

export const DataProvider: React.FC = ({ children }) => {
  const data = useProviderData();

  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
};

export const useData = () => useContext<DataContextProps>(DataContext);

export const useProviderData = () => {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [polymarket, setPolymarket] = useState<any>();
  const [polyToken, setPolyToken] = useState<any>();

  const loadWeb3 = async () => {
    if (window.ethereum) {

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await window.ethereum.enable();

      const signer = provider.getSigner(0);
      const address = await signer.getAddress();
      setAccount(address);
      await loadBlockchainData();
    } else {
      window.alert("Non-Eth browser detected. Please consider using MetaMask.");
      return;
    }
  };

  const loadBlockchainData = async () => {
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
