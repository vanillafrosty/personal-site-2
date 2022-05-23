const calcRating = (ratings) => {
  const weights = {
    taste: 0.5,
    portionSize: 0.35,
    ambience: 0.15,
  };
  const avg = Object.keys(weights).reduce(
    (prev, curr) => weights[curr] * ratings[curr] + prev,
    0
  );
  return avg.toFixed(1);
};

export { calcRating };
