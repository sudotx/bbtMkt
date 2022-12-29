declare let window: any;
import { createContext, useContext, useState } from "react";
import Web3 from "web3";
import ethers from "ethers";
import Polymarket from "../abis/Polymarket.json";
import PolyToken from "../abis/PolyToken.json";

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
  loadWeb3: async () => {},
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
    // var tempContract = new ethers.Contract(
    //   Polymarket.abi
    //   // poly market
    // );
    // setPolymarket(tempContract);
    // var tempTokenContract = new ethers.Contract(
    //   PolyToken.abi

    //   // polyToken address
    // );

    // setPolyToken(tempTokenContract);
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
