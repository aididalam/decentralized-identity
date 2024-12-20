require("dotenv").config();
const express = require("express");
const Web3 = require("web3");
const db = require("./firebase");

const app = express();
app.use(express.json());

const web3 = new Web3(process.env.ETH_RPC_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = [
  /* ABI of the deployed contract */
];
const contract = new web3.eth.Contract(contractABI, contractAddress);

// Register a user
app.post("/register", async (req, res) => {
  const { name, email, address } = req.body;
  try {
    await contract.methods.registerUser(name, email).send({ from: address });
    res.status(200).send("User registered successfully.");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get user details
app.get("/user/:address", async (req, res) => {
  const { address } = req.params;
  try {
    const user = await contract.methods.getUser(address).call();
    res.status(200).json(user);
  } catch (error) {
    res.status(404).send("User not found.");
  }
});

// Firebase example: Store additional user data
app.post("/firebase/user", (req, res) => {
  const { uid, data } = req.body;
  db.ref("users/" + uid).set(data, (error) => {
    if (error) {
      res.status(500).send("Failed to save data.");
    } else {
      res.status(200).send("Data saved successfully.");
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
