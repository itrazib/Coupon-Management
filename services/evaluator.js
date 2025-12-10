function computeCartValue(cart) {
  return cart.items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
}

function totalItemsCount(cart) {
  return cart.items.reduce((sum, it) => sum + it.quantity, 0);
}

function categoriesInCart(cart) {
  return [...new Set(cart.items.map(i => i.category))];
}

function evaluateEligibilityAndDiscount(coupon, user, cart) {
  const elig = coupon.eligibility || {};
  const cartValue = computeCartValue(cart);
  const categories = categoriesInCart(cart);
  const itemsCount = totalItemsCount(cart);

  // USER RULES
  if (elig.allowedUserTiers?.length && !elig.allowedUserTiers.includes(user.userTier))
    return { eligible: false };

  if (elig.minLifetimeSpend && user.lifetimeSpend < elig.minLifetimeSpend)
    return { eligible: false };

  if (elig.minOrdersPlaced && user.ordersPlaced < elig.minOrdersPlaced)
    return { eligible: false };

  if (elig.firstOrderOnly && user.ordersPlaced !== 0)
    return { eligible: false };

  if (elig.allowedCountries?.length && !elig.allowedCountries.includes(user.country))
    return { eligible: false };

  // CART RULES
  if (elig.minCartValue && cartValue < elig.minCartValue)
    return { eligible: false };

  if (elig.applicableCategories?.length) {
    if (!elig.applicableCategories.some(c => categories.includes(c)))
      return { eligible: false };
  }

  if (elig.excludedCategories?.length) {
    if (elig.excludedCategories.some(c => categories.includes(c)))
      return { eligible: false };
  }

  if (elig.minItemsCount && itemsCount < elig.minItemsCount)
    return { eligible: false };

  // DISCOUNT CALC
  let discount = 0;

  if (coupon.discountType === "FLAT") {
    discount = coupon.discountValue;
  } else {
    discount = (cartValue * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount)
      discount = Math.min(discount, coupon.maxDiscountAmount);
  }

  return { eligible: true, discountAmount: discount };
}

function selectBestCoupon(list) {
  return list.sort((a, b) => {
    if (b.discount !== a.discount) return b.discount - a.discount;
    if (a.coupon.endDate !== b.coupon.endDate)
      return new Date(a.coupon.endDate) - new Date(b.coupon.endDate);
    return a.coupon.code.localeCompare(b.coupon.code);
  })[0];
}

module.exports = { evaluateEligibilityAndDiscount, selectBestCoupon };
