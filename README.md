# MasterChef User Balances Subgraph

This subgraph will index all the lp balances of a user that staked in the Sushiswap's Masterchef contract.

To generate the mapping ts files, please do:
```
yarn codegen
```

To deploy, please use:
```
 graph deploy \
    --debug \
    --node https://api.thegraph.com/deploy/ \
    --ipfs https://api.thegraph.com/ipfs/ \
    tommytchan/sushiswap-masterchef-balances
```

If you have any questions, please feel free to ping tom@liquidity.vision!