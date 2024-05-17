const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const containerTransactions = document.querySelector(".transactions");
const balCurr = document.querySelector(".bal__curr");

const app = document.querySelector(".acc");

const labelSumIN = document.querySelector(".in__amount");
const labelSumOut = document.querySelector(".out__amount");
const labelSumInt = document.querySelector(".int__amount");

const labelGreet = document.querySelector(".greet");
const labelWelcome = document.querySelector(".welcome");

const inputUser = document.querySelector(".user");
const inputPin = document.querySelector(".pin");
const inputTransferAcc = document.querySelector("#transferAcc");
const inputTransferAmt = document.querySelector("#transferAmt");
const inputLoanAmt = document.querySelector("#loanAmt");
const inputCloseAcc = document.querySelector("#closeAcc");
const inputCloseAccPin = document.querySelector("#closeAccPin");

const btnLogin = document.querySelector(".log-in");
const btnLogout = document.querySelector(".log-out");
const btnTransfer = document.querySelector(".btn-transfer");
const btnReqLoan = document.querySelector(".btn-reqLoan");
const btnCloseAcc = document.querySelector(".btn-closeAcc");

const error = document.querySelector(".error");

function ToggleLogInOut() {
  btnLogin.classList.toggle("hidden");
  btnLogout.classList.toggle("hidden");
}

function showError() {
  error.classList.remove("hidden");
}

function hideError() {
  error.classList.add("hidden");
}

function displayMovements(transactions) {
  containerTransactions.innerHTML = "";

  transactions.forEach((transaction, i) => {
    const type = transaction > 0 ? "deposit" : "withdrawal";

    const html = `
    <div class="transaction">
        <div class="transaction__data">
            <div class="badge badge--${type}">
                <span class="badge__no">${i + 1}</span>
                <span class="badge__type">${type}</span>
            </div>
            <div class="transaction__date">12/03/2020</div>
        </div>
        <div class="transaction__amount">$ ${transaction}</div>
    </div>`;

    containerTransactions.insertAdjacentHTML("afterbegin", html);
  });
}

function calcDisplayBal(acc) {
  acc.balance = acc.movements.reduce((sum, mov) => sum + mov);
  balCurr.textContent = `$${acc.balance}`;
}

function calcDisplaySummary(acc) {
  const sumIn = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov);

  labelSumIN.textContent = `$${sumIn}`;

  const sumOut = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov);

  labelSumOut.textContent = `$${Math.abs(sumOut)}`;

  const interest = Math.trunc(sumIn * (acc.interestRate / 100));

  labelSumInt.textContent = `$${interest}`;
}

function updateUI(acc) {
  // Display Transactions
  displayMovements(acc.movements);

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

  const amt = Number(inputLoanAmt.value);

  if (amt > 0 && currentAccount.movements.some((mov) => mov >= amt * 0.1)) {
    currentAccount.movements.push(amt);

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
