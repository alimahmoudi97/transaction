const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
let transactions;
let order;
let searchQuery;
const tableHeaderPrice = document.querySelector(".table__header--price");
const chevronHeaderPrice = document.querySelector(".table__header--price img");
const tableHeaderDate = document.querySelector(".table__header--date");
const chevronHeaderDate = document.querySelector(".table__header--date img");
const transactionsSearchInput = document.querySelector(
  ".transactions__search-input"
);
const tableBody = document.querySelector(".table__body");

(async function initiateData() {
  transactions = await fetch(
    "http://localhost:3000/transactions?_sort=date&_order=asc"
  ).then((res) => res.json());
  tableBody.innerHTML = transactions
    .map(
      (item, index) => `          
    <tr class="table__row">
        <td class="order">${toPersianNumbers(index + 1)}</td>
                    <td class=${
                      item.type === "افزایش اعتبار"
                        ? "transactions-type--settle"
                        : "transactions-type--take"
                    }>${item.type}</td>
        <td class="price">${toPersianNumbersWithComma(item.price)}</td>
        <td class="tracing-number">${toPersianNumbers(item.refId)}</td>
        <td class="date">${toLocalDate(item.date)}</td>
      </tr>
    
    `
    )
    .join("");
})();

function navigate(target) {
  location.href = `${target}`;
}

// to convert persian numbers

function toPersianNumbersWithComma(n) {
  const numberWithCommas = numberWithComma(n);
  return toPersianNumbers(numberWithCommas);
}

function numberWithComma(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function toPersianNumbers(n) {
  return n.toString().replace(/\d/g, (x) => farsiDigits[parseInt(x)]);
}

function toLocalDate(t) {
  const timestamp = parseInt(t);
  const date = new Date(timestamp);
  const localizedDate = date.toLocaleDateString("fa-IR");
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return toPersianNumbers(
    `${localizedDate} ساعت ${
      hours.toString().length == 1 ? `0${hours}` : hours
    }:${minutes.toString().length == 1 ? `0${minutes}` : minutes}`
  );
}

async function query({ by, order, search = "" }) {
  transactions = await fetch(
    `http://localhost:3000/transactions?${by !== "" ? `_sort=${by}` : ""}${
      order !== "" ? `&_order=${order}&` : ""
    }${search !== null ? `refId_like=${search}` : ""}`
  ).then((res) => res.json());
  console.log(transactions);
  if (transactions.length === 0) {
    tableBody.innerHTML = `<p style="color:blue;text-align:center;font-size: 20px;">رکوردی برای نمایش وجود ندارد</p>`;
  } else {
    tableBody.innerHTML = transactions
      .map(
        (item, index) => `          
                  <tr class="table__row">
                      <td class="order">${toPersianNumbers(index + 1)}</td>
                      <td class=${
                        item.type === "افزایش اعتبار"
                          ? "transactions-type--settle"
                          : "transactions-type--take"
                      }>${item.type}</td>
                      <td class="price">${toPersianNumbersWithComma(
                        item.price
                      )}</td>
                      <td class="tracing-number">${toPersianNumbers(
                        item.refId
                      )}</td>
                      <td class="date">${toLocalDate(item.date)}</td>
                    </tr>
              
          `
      )
      .join("");
  }
}

tableHeaderPrice.addEventListener("click", () => {
  if (order == "asc") {
    query({ by: "price", order: "asc", search: searchQuery });
    order = "desc";
    chevronHeaderPrice.style.transition = "all 0.3s linear 0s";
    chevronHeaderPrice.style.transform = "rotate(180deg)";
  } else {
    query({ by: "price", order: "desc", search: searchQuery });
    order = "asc";
    chevronHeaderPrice.style.transition = "all 0.3s linear 0s";
    chevronHeaderPrice.style.transform = "rotate(0deg)";
  }
});

tableHeaderDate.addEventListener("click", () => {
  if (order == "asc") {
    query({ by: "date", order: "asc", search: searchQuery });
    console.log(searchQuery);
    order = "desc";
    chevronHeaderDate.style.transition = "all 0.3s linear 0s";
    chevronHeaderDate.style.transform = "rotate(180deg)";
  } else {
    query({ by: "date", order: "desc", search: searchQuery });
    console.log(searchQuery);

    order = "asc";
    chevronHeaderDate.style.transition = "all 0.3s linear 0s";
    chevronHeaderDate.style.transform = "rotate(0deg)";
  }
});

transactionsSearchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  query({ by: "", order: "", search: searchQuery });
});
