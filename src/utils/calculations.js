export function getMonthlySpend(subscriptions) {
  return subscriptions.reduce((total, sub) => {
    const price = Number(sub.price) || 0;
    const billingCycle = (sub.billingCycle || "").toLowerCase();

    if (billingCycle === "monthly") return total + price;
    if (billingCycle === "quarterly") return total + price / 3;
    if (billingCycle === "yearly") return total + price / 12;

    return total;
  }, 0);
}

export function getYearlyProjection(subscriptions) {
  return subscriptions.reduce((total, sub) => {
    const price = Number(sub.price) || 0;
    const billingCycle = (sub.billingCycle || "").toLowerCase();

    if (billingCycle === "monthly") return total + price * 12;
    if (billingCycle === "quarterly") return total + price * 4;
    if (billingCycle === "yearly") return total + price;

    return total;
  }, 0);
}

export function getPriceIncreaseCount(subscriptions) {
  return subscriptions.filter((sub) => {
    const history = sub.priceHistory || [];
    if (history.length < 2) return false;

    const firstPrice = Number(history[0].price) || 0;
    const latestPrice = Number(history[history.length - 1].price) || 0;

    return latestPrice > firstPrice;
  }).length;
}

export function getRecommendations(subscriptions) {
  const recommendations = [];

  subscriptions.forEach((sub) => {
    const history = sub.priceHistory || [];
    const firstPrice =
      history.length > 0 ? Number(history[0].price) || 0 : Number(sub.price) || 0;
    const latestPrice =
      history.length > 0
        ? Number(history[history.length - 1].price) || 0
        : Number(sub.price) || 0;

    const increase = latestPrice - firstPrice;
    const usage = Number(sub.usage) || 0;
    const price = Number(sub.price) || 0;
    const billingCycle = (sub.billingCycle || "").toLowerCase();

    let monthlySavings = price;
    if (billingCycle === "quarterly") monthlySavings = price / 3;
    if (billingCycle === "yearly") monthlySavings = price / 12;

    if (usage <= 2) {
      recommendations.push({
        id: `${sub.id}-cancel`,
        title: `Cancel ${sub.name}`,
        type: "cancel",
        subName: sub.name,
        savings: monthlySavings,
      });
    } else if (increase >= 2) {
      recommendations.push({
        id: `${sub.id}-price`,
        title: `${sub.name} price increased`,
        type: "alert",
        subName: sub.name,
        oldPrice: firstPrice,
        newPrice: latestPrice,
        savings: 0,
      });
    }
  });

  return recommendations;
}

export function getPotentialSavings(recommendations) {
  return recommendations.reduce(
    (total, item) => total + (Number(item.savings) || 0),
    0
  );
}