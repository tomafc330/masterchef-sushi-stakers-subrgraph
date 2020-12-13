import {MasterChef, Deposit, Withdraw} from '../generated/MasterChef/MasterChef'
import {LiquidityPosition, User} from '../generated/schema'
import {Address, BigDecimal, BigInt, log} from "@graphprotocol/graph-ts";

let BI_18 = BigInt.fromI32(18);
let ZERO_BI = BigInt.fromI32(0);
let ONE_BI = BigInt.fromI32(1);

function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1');
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString('10'));
  }
  return bd;
}

function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal();
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
}

function getLpId(poolAddress: Address, userAddress: Address): string {
  return poolAddress.toHexString().concat('-').concat(userAddress.toHexString());
}

export function handleDeposit(event: Deposit): void {
  let pid = event.params.pid;
  let contractAddrs = event.address as Address;
  let userAddrs = event.params.user;
  handleEvent(pid, userAddrs, contractAddrs);
}

export function handleWithdraw(event: Withdraw): void {
  let pid = event.params.pid;
  let contractAddrs = event.address as Address;
  let userAddrs = event.params.user;
  handleEvent(pid, userAddrs, contractAddrs);
}

function handleEvent(pid: BigInt, userAddrs: Address, contractAddrs: Address): void {
  let masterChef = MasterChef.bind(contractAddrs);
  let pool = masterChef.poolInfo(pid);
  let poolAddress = pool.value0;
  let userId = userAddrs.toHex();
  let user = User.load(userId);
  if (user == null) {
    user = new User(userId);
    user.save();
  }
  let lpId = getLpId(poolAddress, userAddrs);
  let lp = LiquidityPosition.load(lpId);
  if (lp == null) {
    lp = new LiquidityPosition(lpId);
    lp.user = user.id;
    lp.poolAddress = poolAddress;
  }
  lp.balance = convertTokenToDecimal(masterChef.userInfo(pid, userAddrs).value0, BI_18);
  lp.save();
}
