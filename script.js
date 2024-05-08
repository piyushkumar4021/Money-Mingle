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

const containerTransactions = document.querySelector(".transactions");

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

displayMovements(account1.movements);
