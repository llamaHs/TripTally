import API from "../api.js";

class ExpenseView {
  // * Display date on new expense
  expenseDate = document.querySelector(".expense-date-locale");
  dateOption = { year: "numeric", month: "long", day: "numeric" };

  expenseDateRender(country) {
    API.getCountryCode(country).then((code) => {
      this.expenseDate.textContent = new Intl.DateTimeFormat(
        code,
        this.dateOption
      ).format(new Date());
    });
  }
}

export default new ExpenseView();
