import { ethers } from "./ethers-5.1.esm.min.js";
import { abi, address } from "./constants.js";

console.log(ethers);
const connectbutton = document.getElementById("connect");
const fundbutton = document.getElementById("fund");
const balancebutton = document.getElementById("balance");
const withdrawbutton = document.getElementById("withdraw");

// const ethAmount = document.getElementById("ethamount").value;
connectbutton.onclick = connect;
fundbutton.onclick = fund;
balancebutton.onclick = getBalance;
withdrawbutton.onclick = withdraw;
async function connect() {
  console.log("From js");
  if (typeof window.ethereum !== "undefined") {
    console.log("Metamask");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    document.getElementById("connect").innerHTML = "Connected";
    //   k.innerHtml = "Connected";
    console.log("Connected");
  } else {
    document.getElementById("connect").innerHTML = "no metamask";
  }
}

async function fund(ethAmount) {
  // let ethAmount = "1"
  ethAmount = document.getElementById("ethamount").value;
  console.log(ethAmount);
  console.log(`Funding with ${ethAmount}`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, abi, signer);
    try {
      const transactionresponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenfortxn(transactionresponse, provider);
      console.log("Done");
      console.log(signer);
    } catch (error) {
      console.log(error);
    }
  }
}
async function getBalance() {
  if (typeof window.ethereum != undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(address);
    console.log(ethers.utils.formatEther(balance));
  }
}
async function withdraw() {
  if (typeof window.ethereum != undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(address, abi, signer);
    console.log("Withdrawing");
    try {
      const transactionresponse = await contract.withdraw();
      await listenfortxn(transactionresponse, provider);
    } catch (error) {
      console.log("gg");
    }
  }
}
function listenfortxn(transactionresponse, provider) {
  //listenfortxn gets called executes the provder.once and add that in the event looop before the event finished to avoid that we use Promise
  console.log("Mining ");
  return new Promise((resolve, reject) => {
    provider.once(transactionresponse.hash, (transactionreceipt) => {
      console.log("Process completed");
      resolve();
    });
  });
}
