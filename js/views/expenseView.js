import API from "../api.js";

class ExpenseView {
  // * Display date on new expense
  expenseDate = document.querySelector(".expense-date-locale");
  itemDate = document.querySelector(".item-date");
  totalExpense = document.querySelector(".receipt-expense-value");
  receipt = document.querySelector(".receipt-items");
  expenseItem = document.querySelector(".expense-item");
  expenseAmount = document.querySelector(".expense-value");

  btnSortCash = document.querySelector(".btn-filter-cash");
  btnSortCard = document.querySelector(".btn-filter-card");
  btnSortOld = document.querySelector(".btn-sort");

  dateOption = { year: "numeric", month: "long", day: "numeric" };

  async expenseDateRender(country) {
    const countryCode = await API.getCountryCode(country);
    this.expenseDate.textContent = new Intl.DateTimeFormat(
      countryCode,
      this.dateOption
    ).format(new Date());
  }

  // * Display total expense
  totalExpenseRender(expense) {
    this.totalExpense.textContent = expense;
  }

  // * Display receipt
  async receiptRender(receiptArr, country) {
    this.receipt.innerHTML = "";

    const countryCode = await API.getCountryCode(country);
    const formatDate = new Intl.DateTimeFormat(
      countryCode,
      this.dateOption
    ).format(new Date());

    const currencySymbol = await API.getCurrencySymbol(country);

    receiptArr.forEach((expenseObj) => {
      const markup = `<div class="receipt-item">
    <div class="icon-box">
      <ion-icon class="icon icon-${expenseObj.pay}" name="${expenseObj.pay}-outline"></ion-icon>
      </div>
      <p class="item-title">${expenseObj.item}</p>
      
      <p class="item-date">${formatDate}</p>
      <p class="item-price"<span class="currency">${currencySymbol}${expenseObj.price}</p>
      </div>`;

      this.receipt.insertAdjacentHTML("afterbegin", markup);
    });
    this.expenseItem.textContent = this.expenseAmount.textContent = "";
  }

  // * Sort button render
  sortBtnRender(isSorted) {
    this.btnSortCash.querySelector(".sort-text").textContent = isSorted.cash
      ? "BACK"
      : "SORT BY CASH";
    this.btnSortCard.querySelector(".sort-text").textContent = isSorted.card
      ? "BACK"
      : "SORT BY CARD";
    this.btnSortOld.querySelector(".sort-text").textContent = isSorted.old
      ? "SORT BY LATEST"
      : "SORT BY OLDEST";
  }
}

export default new ExpenseView();
