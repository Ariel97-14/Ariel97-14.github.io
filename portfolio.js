const filters = document.querySelector(".filters");
const cards = [...document.querySelectorAll(".project[data-categories]")];
const count = document.querySelector("#project-count");

if (filters && count && cards.length) {
  filters.classList.add("enhanced");
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button || !filters.contains(button)) return;

    const selected = button.dataset.filter;
    for (const filter of filters.querySelectorAll("button[data-filter]")) {
      const active = filter === button;
      filter.classList.toggle("active", active);
      filter.setAttribute("aria-pressed", String(active));
    }
    let visible = 0;
    for (const card of cards) {
      const matches =
        selected === "all" ||
        card.dataset.categories.split(" ").includes(selected);
      card.hidden = !matches;
      if (matches) visible += 1;
    }
    count.textContent = `${visible} ${visible === 1 ? "proyecto" : "proyectos"}`;
  });
}

