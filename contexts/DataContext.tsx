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
    var tempContract = new ethers.Contract(
      Betmarket.abi,
      0x7693d5Aa88004f6c5c2e16D7b13Db04aFaae797b
    );
    setPolymarket(tempContract);
    var tempTokenContract = new ethers.Contract(
      BetToken.abi,
      0xe450830A28e479F8bd6f8C1706B1CAB160Cb313F
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
