export const state = {
  user: {
    name: "",
    nationality: "",
    destination: "",
    travelPeriod: {
      from: "",
      to: "",
    },
  },

  asset: {
    readyCash: 0,
    totalExpense: 0,
    receipt: [],
  },

  currency: {
    symbol: "",
    userSymbol: "",
    exchangeRate: 0,
  },
};

export const saveUserInfo = function () {
  if (state.user.name !== "") {
    localStorage.setItem("User", JSON.stringify(state));
  }
};

export const getUserInfo = function () {
  return JSON.parse(localStorage.getItem("User")) || null;
};
