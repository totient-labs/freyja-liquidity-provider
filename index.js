const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const PORT = process.env.PORT || 5000
const { FreyjaLiquidityProvider } = require('@totient-labs/freyja');
const { BigNumber } = require('bignumber.js');

let config = {
  providerPrivateKey: "0xdce1443bd2ef0c2631adc1c67e5c93f13dc23a41c18b536effbbdcbcdb96fb65",  // First local node PK for testing
  freyjaContractAddresses: new Map([[
    39, "0x08575118e7fe21e31e25791b3ef5507518ce67dd",
    74, "0x83e280bbdbe001e35a5b7eaf9c48af7c7c07362a"
  ]]),
  relayerFeeAddress: "0x75e8ea1abd794bf1ecb2a895ce4d0f2388abb62d",
  relayerFee: new BigNumber("0.03"),
  expirationWindow: 15 * 60
};

let provider = new FreyjaLiquidityProvider(config);

const app = express()

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.post('/swap', (req, res) => {
  const {
    chaintag,
    nonce,
    fromTokenAddress,
    toTokenAddress,
    toTokenAmount
  } = req.body;

  const [order, signature] = provider.createSignedSwap(
    chaintag,
    fromTokenAddress, // fromTokenAddress
    toTokenAddress, // toTokenAddress
    new BigNumber(toTokenAmount), // toTokenAmount
    new BigNumber(nonce), // nonce
    new BigNumber("164587396890052500000") // quote
  );

  console.log(order);
  console.log(signature);

  res.json({order, signature})
});
