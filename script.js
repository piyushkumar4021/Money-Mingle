const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2024-04-31T23:36:17.929Z",
    "2024-05-01T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

const containerTransactions = document.querySelector(".transactions");
const labelBalance = document.querySelector(".bal__curr");

const app = document.querySelector(".acc");

const formLogin = document.querySelector(".form-login");

const labelSumIN = document.querySelector(".in__amount");
const labelSumOut = document.querySelector(".out__amount");
const labelSumInt = document.querySelector(".int__amount");

const labelLoginTime = document.querySelector(".login-time");

const labelGreet = document.querySelector(".greet");
const labelWelcome = document.querySelector(".welcome");

const inputUser = document.querySelector(".user");
const inputPin = document.querySelector(".pin");
const inputTransferAcc = document.querySelector("#transferAcc");
const inputTransferAmt = document.querySelector("#transferAmt");
const inputLoanAmt = document.querySelector("#loanAmt");
const inputCloseAcc = document.querySelector("#closeAcc");
const inputCloseAccPin = document.querySelector("#closeAccPin");

const btnLogin = document.querySelector(".btn-login");
const btnLogout = document.querySelector(".btn-logout");
const btnTransfer = document.querySelector(".btn-transfer");
const btnReqLoan = document.querySelector(".btn-reqLoan");
const btnCloseAcc = document.querySelector(".btn-closeAcc");
const btnSort = document.querySelector(".btn-sort");

const error = document.querySelector(".error");

function ToggleLogInOut() {
  formLogin.classList.toggle("hidden");
  btnLogout.classList.toggle("hidden");
}

function showError() {
  error.classList.remove("hidden");
}

function hideError() {
  error.classList.add("hidden");
}

function displayMovements(acc, sort = false) {
  containerTransactions.innerHTML = "";

  const movements = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movements.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const displayDate = new Intl.DateTimeFormat(acc.locale).format(
      new Date(acc.movementsDates[i])
    );

    const html = `
    <div class="transaction">
        <div class="transaction__data">
            <div class="badge badge--${type}">
                <span class="badge__no">${i + 1}</span>
                <span class="badge__type">${type}</span>
            </div>
            <div class="transaction__date">${displayDate}</div>
        </div>
        <div class="transaction__amount">$ ${mov.toFixed(2)}</div>
    </div>`;

    containerTransactions.insertAdjacentHTML("afterbegin", html);
  });
}

function calcDisplayBal(acc) {
  acc.balance = acc.movements.reduce((sum, mov) => sum + mov);
  labelBalance.textContent = `$${acc.balance.toFixed(2)}`;
}

function calcDisplaySummary(acc) {
  const sumIn = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIN.textContent = `$${sumIn.toFixed(2)}`;

  const sumOut = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov)
    .toFixed(2);

  labelSumOut.textContent = `$${Math.abs(sumOut).toFixed(2)}`;

  const interest = (sumIn * (acc.interestRate / 100)).toFixed(2);

  labelSumInt.textContent = `$${interest}`;
}

function updateUI(acc) {
  // Display Transactions
  displayMovements(acc);

  // Display Bal
  calcDisplayBal(acc);

  // Display Cashflow
  calcDisplaySummary(acc);
}

function createUsernames(accs) {
  accs.forEach((acc) => {
    acc.userName = acc.owner
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toLowerCase();
  });
}

createUsernames(accounts);

// Events
let currentAccount;

// Log in event
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  // Finding A/c Details
  currentAccount = accounts.find((acc) => acc.userName === inputUser.value);

  let dateItems = {
    date: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  labelLoginTime.textContent = `As of ${new Intl.DateTimeFormat(
    currentAccount.locale,
    dateItems
  ).format(new Date())}`;

  if (currentAccount?.pin === Number(inputPin.value)) {
    labelWelcome.classList.add("hidden");
    app.classList.remove("hidden");

    // Display Welcome Message
    labelGreet.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    // Update UI
    updateUI(currentAccount);

    // Hide log in and show log out
    ToggleLogInOut();

    // Clear login fields
    inputUser.value = inputPin.value = "";
    inputPin.blur();
  }
});

// Log out event
btnLogout.addEventListener("click", (e) => {
  e.preventDefault();

  ToggleLogInOut();

  app.classList.add("hidden");
  labelWelcome.classList.remove("hidden");
  labelGreet.textContent = `Log in to get started`;
});

// Transfer Amount Functionality
btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();

  const transferToAcc = accounts.find(
    (acc) => acc.userName === inputTransferAcc.value
  );
  const amt = Number(inputTransferAmt.value);

  if (
    transferToAcc &&
    amt > 0 &&
    amt < currentAccount.balance &&
    transferToAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amt);
    transferToAcc.movements.push(amt);

    currentAccount.movementsDates.push(new Date().toISOString());
    transferToAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);
    hideError();
    inputTransferAcc.value = inputTransferAmt.value = "";
  } else {
    showError();
  }
});

// Request Loan
btnReqLoan.addEventListener("click", (e) => {
  e.preventDefault();

  const amt = Math.trunc(Number(inputLoanAmt.value));

  if (amt > 0 && currentAccount.movements.some((mov) => mov >= amt * 0.1)) {
    currentAccount.movements.push(amt);
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update
    updateUI(currentAccount);
    hideError();
  } else {
    showError();
  }
  inputLoanAmt.value = "";
  inputLoanAmt.blur();
});

// Close acc event
btnCloseAcc.addEventListener("click", (e) => {
  e.preventDefault();

  if (
    inputCloseAcc.value === currentAccount.userName &&
    Number(inputCloseAccPin.value) === currentAccount.pin
  ) {
    accounts.splice(
      accounts.findIndex((acc) => acc.userName === currentAccount.userName),
      1
    );

    app.classList.add("hidden");
    labelGreet.textContent = `Log in to get started`;
    labelWelcome.classList.remove("hidden");

    ToggleLogInOut();
    hideError();
  } else {
    showError();
  }
});

// Sorting Movements

let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();

  sorted = !sorted;
  displayMovements(currentAccount, sorted);
});
