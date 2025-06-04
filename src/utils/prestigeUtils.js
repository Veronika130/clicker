export function calculateRobocoins(credits) {
  return +(credits / 100000).toFixed(2); 
}

export function calculateNewBonus(totalRobocoins) {
  return +(totalRobocoins * 10).toFixed(0); 
}