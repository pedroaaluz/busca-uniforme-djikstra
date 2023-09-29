export const calculateEuclidianDistance = (start: number[], goal: number[]) => {
  const distanceX = Math.pow(start[0] - goal[0], 2);
  const distanceY = Math.pow(start[1] - goal[1], 2);

  const distanceBetweenPoints = Math.sqrt(distanceX + distanceY);

  const numberParsed = Number(distanceBetweenPoints.toFixed(1))
  return numberParsed;
} 