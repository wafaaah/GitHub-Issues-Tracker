const tabActive = ["bg-navy", "border-navy", "text-white"];
const tabInactive = ["bg-transparent", "text-slate-700", "border-slate-200"];

const allContainer = document.getElementById("allContainer");
const openContainer = document.getElementById("openContainer");
const closeContainer = document.getElementById("closeContainer");

const totalStat = document.getElementById("stat-total");
const openStat = document.getElementById("stat-open");
const closeStat = document.getElementById("stat-close");
const availableStat = document.getElementById("available");

const totalIssues = document.getElementById("totalIssues");
const noissue = document.getElementById("noissue");
const searchBtn = document.getElementById("searchBtn");
const loading = document.getElementById("loading");

let currentTab = "all";
let allIssues = [];

loading.classList.add("hidden");

function switchTab(tab) {
  currentTab = tab;

  const tabs = ["all", "open", "close"];

  for (const t of tabs) {
    const tabName = document.querySelector("#tab-" + t);

    if (t === tab) {
      tabName.classList.remove(...tabInactive);
      tabName.classList.add(...tabActive);
    } else {
      tabName.classList.remove(...tabActive);
      tabName.classList.add(...tabInactive);
    }
  }

  [allContainer, openContainer, closeContainer].forEach(el => {
    el.classList.add("hidden");
  });

  if (tab === "all") {
    allContainer.classList.remove("hidden");
    totalIssues.innerText = `${allIssues.length} Issues`;
  }

  if (tab === "open") {
    openContainer.classList.remove("hidden");

    const openIssues = allIssues.filter(
      issue => issue.status === "open"
    );

    totalIssues.innerText = `${openIssues.length} Issues`;
  }

  if (tab === "close") {
    closeContainer.classList.remove("hidden");

    const closeIssues = allIssues.filter(
      issue => issue.status === "closed"
    );

    totalIssues.innerText = `${closeIssues.length} Issues`;
  }

  updateStat(allIssues);
}

function updateStat(issues) {
  const counts = {
    all: issues.length,
    open: issues.filter(i => i.status === "open").length,
    close: issues.filter(i => i.status === "closed").length,
  };

  totalStat.innerText = counts.all;
  openStat.innerText = counts.open;
  closeStat.innerText = counts.close;

  availableStat.innerText = `${counts[currentTab]} Issues`;
}

const fetchIssues = () => {
  loading.style.display = "flex";

  fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
    .then(res => res.json())
    .then(data => {
      allIssues = data.data;

      displayIssues(allIssues);

      loading.style.display = "none";
      loading.classList.add("hidden");

      //switchTab(currentTab);
    })
    .catch(err => {
      console.log(err);
      loading.style.display = "none";
    });
};

const displayIssues = (issues) => {
  allContainer.innerHTML = "";
  openContainer.innerHTML = "";
  closeContainer.innerHTML = "";

  noissue.style.display = "none";

  const counts = {
    all: issues.length,
    open: issues.filter(i => i.status === "open").length,
    close: issues.filter(i => i.status === "closed").length,
  };



  if (issues.length === 0) {
    noissue.style.display = "block";
    return;
  }

  issues.forEach(issue => {
    const card = document.createElement("div");

    card.innerHTML = `
      <div class="card bg-base-100 w-96 shadow-sm border-t-4 ${
        issue.status === "open"
          ? "border-[#00A96E]"
          : "border-[#A855F7]"
      }">

        <div class="card-body">

          <div class="flex justify-between items-end">
            <img 
              class="h-10 w-10" 
              src="${
                issue.status === "open"
                  ? "./assets/Open-Status.png"
                  : "./assets/Closed-Status.png"
              }"
            >

            <div class="bg-red-200 text-red-500 rounded-md flex justify-center items-center h-6 px-3">
              ${issue.priority}
            </div>
          </div>

          <h2 class="card-title">
            ${issue.title}
          </h2>

          <p>
            ${issue.description}
          </p>

          <div class="flex gap-3 flex-wrap">

            ${
              issue.labels[0]
                ? `
              <div class="px-2 py-1 bg-red-200 text-red-700 rounded-md">
                ${issue.labels[0]}
              </div>
            `
                : ""
            }

            ${
              issue.labels[1]
                ? `
              <div class="px-2 py-1 bg-yellow-100 text-yellow-600 rounded-md">
                ${issue.labels[1]}
              </div>
            `
                : ""
            }

          </div>

          <div class="border-t my-3"></div>

          <div class="text-gray-400 text-sm">
            <div>#${issue.id} by ${issue.author}</div>
            <div>${issue.createdAt}</div>
          </div>

        </div>
      </div>
    `;

    const modal = document.createElement("dialog");

    modal.className = "modal modal-bottom sm:modal-middle";

    modal.innerHTML = `
      <div class="modal-box">

        <h3 class="text-lg font-bold">
          ${issue.title}
        </h3>

        <div class="inline-block bg-green-500 text-white px-2 rounded mt-2">
          ${issue.status}
        </div>

        <p class="py-4">
          ${issue.description}
        </p>

        <div class="bg-gray-100 p-3 rounded">

          <div class="flex justify-between">

            <div>
              Assignee: <b>${issue.assignee}</b>
            </div>

            <div>
              Priority:
              <span class="bg-red-700 text-white px-2 rounded">
                ${issue.priority}
              </span>
            </div>

          </div>
        </div>

        <form method="dialog">
          <button class="btn btn-primary mt-4">
            Close
          </button>
        </form>

      </div>
    `;

    document.body.appendChild(modal);

    const allCard = card.cloneNode(true);

    allCard.addEventListener("click", () => {
      modal.showModal();
    });

    allContainer.appendChild(allCard);

    if (issue.status === "open") {
      const openCard = card.cloneNode(true);

      openCard.addEventListener("click", () => {
        modal.showModal();
      });

      openContainer.appendChild(openCard);
    }

    if (issue.status === "closed") {
      const closeCard = card.cloneNode(true);

      closeCard.addEventListener("click", () => {
        modal.showModal();
      });

      closeContainer.appendChild(closeCard);
    }
  });

  updateStat(issues);
};

const handleSearch = (value) => {
  loading.style.display = "flex";

  fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${value}`
  )
    .then(res => res.json())
    .then(data => {
      allIssues = data.data;

      displayIssues(allIssues);

      switchTab(currentTab);

      loading.style.display = "none";
    })
    .catch(err => {
      console.log(err);
      loading.style.display = "none";
    });
};

searchBtn.addEventListener("click", () => {
  const val = document.getElementById("searchInput").value;

  handleSearch(val);
});

fetchIssues();
switchTab(currentTab);
