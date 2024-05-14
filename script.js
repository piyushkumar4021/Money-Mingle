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
const btnLogin = document.querySelector(".log-in");

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

function calcDisplayBal(movements) {
  const amt = movements.reduce((sum, mov) => sum + mov);
  balCurr.textContent = `$${amt}`;
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

  const interest = sumIn * (acc.interestRate / 100);

  labelSumInt.textContent = `$${interest}`;
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

    // Display Transactions
    displayMovements(currentAccount.movements);

    // Display Bal
    calcDisplayBal(currentAccount.movements);

    // Display Cashflow
    calcDisplaySummary(currentAccount);

    // Clear login fields
    inputUser.value = inputPin.value = "";
    inputPin.blur();
  }
});
