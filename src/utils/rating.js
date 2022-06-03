const calcRating = (ratings) => {
  let weights;

  if (!ratings.ambience) {
    weights = {
      taste: 0.65,
      portionSize: 0.35,
    };
  } else {
    weights = {
      taste: 0.55,
      portionSize: 0.3,
      ambience: 0.15,
    };
  }

  const avg = Object.keys(weights).reduce(
    (prev, curr) => weights[curr] * ratings[curr] + prev,
    0
  );
  return avg.toFixed(1);
};

export { calcRating };
