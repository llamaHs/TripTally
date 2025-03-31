class HeaderMainView {
  logInForm = document.querySelector(".log-in-form");
  mainApp = document.querySelector(".app");
  logInPage = document.querySelector(".log-in");

  welcomeMsg = document.querySelector(".welcome-msg");
  userPeriod = document.querySelector(".user-period");

  userName = document.querySelector("#name");
  userDestination = document.querySelector("#country");
  dateFrom = document.getElementById("date-from");
  dateTo = document.getElementById("date-to");

  readyCash = document.querySelector(".ready-cash-value");
  expense = document.querySelector(".receipt-expense-value");
  exchangeResult = document.querySelector(".rate-result-value");

  dateOption = { year: "numeric", month: "long", day: "numeric" };

  // * Main / Login page
  loginPageRender() {
    this.logInPage.classList.remove("hidden");
    this.mainApp.classList.add("hidden");
  }

  mainPageRender() {
    this.logInPage.classList.add("hidden");
    this.mainApp.classList.remove("hidden");
  }

  reloadRender() {
    this.logInPage.classList.add("none");
    this.mainApp.classList.remove("hidden");
  }

  headerRender(userName, destination, dateFrom, dateTo) {
    this.welcomeMsg.textContent = "";
    this.userPeriod.textContent = "";

    this.welcomeMsg.innerHTML = `Welcome to <span class="user-country">${destination}</span>,
<span class="user-name">${userName}</span>!`;

    this.userPeriod.innerHTML = `<span class="period-from">${new Intl.DateTimeFormat(
      navigator.language,
      this.dateOption
    ).format(new Date(dateFrom))}</span> &mdash;
<span class="period-to">${new Intl.DateTimeFormat(
      navigator.language,
      this.dateOption
    ).format(new Date(dateTo))}</span>`;
  }

  // * Initial ready cash, expense
  initialAmount() {
    this.readyCash.textContent = "0";
    this.expense.textContent = "0";
    this.exchangeResult.textContent = "0";
  }
}

export default new HeaderMainView();
