import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Web3Modal from "web3modal";
import { ethers, providers } from "ethers";
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  // Create a reference to the Web3 Modal (used for connecting to Metamask) which persists as long as the page is open
  const web3ModalRef = useRef();

  const [walletConnected, setWalletConnected] = useState(false);

  const [ens, setENS] = useState("");

  // Save the address of the currently connected account
  const [address, setAddress] = useState("");

const getProviderOrSigner = async () => {
  // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
  const provider = await web3ModalRef.current.connect();
  const web3Provider = new providers.Web3Provider(provider);

  const { chainId } = await web3Provider.getNetwork();
  if (chainId != 5) {
    window.alert("Change the network to Goerli");
    throw new Error("Change network to Goerli");
  }
  const signer = await web3Provider.getSigner();
  console.log(signer);
  // Get the address associated to the signer which is connected to  MetaMask
  const address = await signer.getAddress();
  console.log(address)

  await setENSOrAddress(address, web3Provider);
  return signer;
}


const connectWallet = async () => {
  try {
    await getProviderOrSigner(true);
    setWalletConnected(true);
  } catch (err) {
    console.error(err);
  }
};

// how to get ens address of an address using lookupAddress in react?
// await provider.lookupAddress("0x5555763613a12D8F3e73be831DFf8598089d3dCa");
// 'ricmoo.eth'




const setENSOrAddress = async (address, web3Provider) => {
  // Lookup the ENS related to the given address
  var _ens = await web3Provider.lookupAddress(address);
  // If the address has an ENS set the ENS or else just set the address
  if (_ens) {
    setENS(_ens);
  } else {
    setAddress(address);
  }
}


useEffect(() => {
  if (!walletConnected) {
    web3ModalRef.current = new Web3Modal({
      network: "goerli",
      providerOptions: {},
      disableInjectedProvider: false,
    });
    connectWallet();
  }
}, [walletConnected]);

const renderButton = () => {
  if (walletConnected) {
    <div>Wallet Connected</div>;
  } else {
    return (
      <button onClick={connectWallet} className={styles.button}>
        Connect your wallet
      </button>
    )
  }
}


return (
  <div>
    <Head>
      <title>ENS Dapp</title>
      <meta name="description" content="ENS-Dapp" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className={styles.main}>
      <div>
        <h1 className={styles.title}>
          Welcome to LearnWeb3 Punks {ens ? ens : address}!
        </h1>
        <div className={styles.description}>
          Its an NFT collection for LearnWeb3 Punks.
        </div>
        {renderButton()}
      </div>
      <div>
        <img className={styles.image} src="./learnweb3punks.png" />
      </div>
    </div>

    <footer className={styles.footer}>
      Made with &#10084; by Elo
    </footer>
  </div>
)



  
}
