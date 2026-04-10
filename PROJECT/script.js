function signup() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value;

    if (!user || !pass) {
        alert("Please enter a username and password.");
        return;
    }

    localStorage.setItem("user", user);
    localStorage.setItem("pass", pass);
    alert("Account created. You can sign in now.");
}

function login() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value;

    if (!user || !pass) {
        alert("Please enter your username and password.");
        return;
    }

    if (
        user === localStorage.getItem("user") &&
        pass === localStorage.getItem("pass")
    ) {
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid username or password.");
    }
}

function signOut() {
    localStorage.removeItem("user");
    localStorage.removeItem("pass");
}

function printPlan() {
    const resultEl = document.getElementById("result");
    if (!resultEl || !resultEl.querySelector(".result-panel")) {
        alert("Generate a weekly plan first, then use Print.");
        return;
    }
    window.print();
}

function generatePlan() {
    const ageEl = document.getElementById("age");
    const heightEl = document.getElementById("height");
    const weightEl = document.getElementById("weight");
    const resultEl = document.getElementById("result");

    if (!ageEl || !heightEl || !weightEl || !resultEl) return;

    const age = parseInt(ageEl.value, 10);
    const heightCm = parseFloat(heightEl.value);
    const weight = parseFloat(weightEl.value);

    if (
        !Number.isFinite(age) ||
        !Number.isFinite(heightCm) ||
        !Number.isFinite(weight) ||
        heightCm <= 0 ||
        weight <= 0
    ) {
        resultEl.innerHTML =
            '<p class="result-error" role="alert">Please enter valid age, height (cm), and weight (kg).</p>';
        return;
    }

    const heightM = heightCm / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(2);

    let category = "";
    if (Number(bmi) < 18.5) category = "Underweight";
    else if (Number(bmi) < 25) category = "Normal";
    else category = "Overweight";

    let ageGroup = "";
    if (age <= 10) ageGroup = "Kids";
    else if (age <= 20) ageGroup = "Teen";
    else if (age <= 30) ageGroup = "Young adult";
    else if (age <= 40) ageGroup = "Adult";
    else ageGroup = "Mature adult";

    function getMealsForCategory() {
        if (category === "Underweight") {
            return {
                breakfast: "Eggs, milk, banana",
                lunch: "Chicken, rice, yogurt",
                dinner: "Lean meat, whole bread, juice",
            };
        }
        if (category === "Normal") {
            return {
                breakfast: "Oats with milk",
                lunch: "Chicken, rice, salad",
                dinner: "Fruit plate, yogurt",
            };
        }
        return {
            breakfast: "Green tea, oats",
            lunch: "Grilled chicken, salad",
            dinner: "Vegetable soup, steamed vegetables",
        };
    }

    const meals = getMealsForCategory();
    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    const mealCardsHtml = days
        .map(
            (day) => `
        <article class="meal-card">
            <p class="meal-card__day">${day}</p>
            <div class="meal-row">
                <span class="meal-row__label">Breakfast</span>
                <p class="meal-row__text">${meals.breakfast}</p>
            </div>
            <div class="meal-row">
                <span class="meal-row__label">Lunch</span>
                <p class="meal-row__text">${meals.lunch}</p>
            </div>
            <div class="meal-row">
                <span class="meal-row__label">Dinner</span>
                <p class="meal-row__text">${meals.dinner}</p>
            </div>
        </article>`
        )
        .join("");

    const printedOn = new Date().toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    });

    resultEl.innerHTML = `
        <div class="result-panel">
            <p class="print-only print-meta">Smart Nutrition System — personal weekly outline · ${printedOn}</p>
            <div class="result-panel__head">
                <h2 class="result-heading">Your plan</h2>
                <button type="button" class="btn btn--secondary no-print" onclick="printPlan()">Print plan</button>
            </div>
            <div class="result-summary">
                <div class="stat-card stat-card--accent">
                    <p class="stat-card__label">BMI</p>
                    <p class="stat-card__value">${bmi}</p>
                    <p class="stat-card__hint">${category}</p>
                </div>
                <div class="stat-card">
                    <p class="stat-card__label">Age band</p>
                    <p class="stat-card__value">${ageGroup}</p>
                    <p class="stat-card__hint">Based on age entered</p>
                </div>
                <div class="stat-card">
                    <p class="stat-card__label">Weekly template</p>
                    <p class="stat-card__value">7 days</p>
                    <p class="stat-card__hint">Tuned to ${category.toLowerCase()} range</p>
                </div>
            </div>
            <h3 class="result-heading">Weekly nutrition outline</h3>
            <div class="meal-grid">
                ${mealCardsHtml}
            </div>
        </div>
    `;
}
