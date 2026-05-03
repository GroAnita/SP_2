export default function getHighestBidder(bids = []) {
  if (!bids.length) return null;
  return bids.reduce((max, b) => (b.amount > max.amount ? b : max));
}
