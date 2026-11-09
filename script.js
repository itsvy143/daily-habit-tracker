
// 1. GET HTML ELEMENTS

const habitForm = document.getElementById("habit-form");
const habitName = document.getElementById("habit-name");
const habitList = document.getElementById("habit-list");

const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");
const habitSummary = document.getElementById("habit-summary");


// 2. STORE HABITS


let habits = JSON.parse(localStorage.getItem("habits")) || [];


// 3. GET TODAY'S DATE


function getTodayDate() {
    const today = new Date();

    return (
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(today.getDate()).padStart(2, "0")
    );
}


// 4. DISPLAY ALL HABITS


function displayHabits() {
    habitList.innerHTML = "";

    if (habits.length === 0) {
        const message = document.createElement("p");

        message.id = "empty-message";
        message.textContent = "No habits yet. Add your first habit!";

        habitList.appendChild(message);
    }

    habits.forEach(function (habit) {
        const habitCard = document.createElement("div");
        habitCard.className = "habit-card";

        // Create checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = habit.completedDate === getTodayDate();
        checkbox.dataset.id = habit.id;
        checkbox.className = "habit-checkbox";

        // Create habit name
        const name = document.createElement("span");

        name.textContent = habit.name;

        if (habit.completedDate === getTodayDate()) {
            name.className = "completed-habit";
        }

        // Create Edit button
        const editButton = document.createElement("button");

        editButton.textContent = "Edit";
        editButton.className = "edit-button";
        editButton.dataset.id = habit.id;

        // Create Delete button
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-button";
        deleteButton.dataset.id = habit.id;

        // Add elements to habit card
        habitCard.append(
            checkbox,
            name,
            editButton,
            deleteButton
        );

        habitList.appendChild(habitCard);
    });

    updateProgress();
}


// 5. ADD A NEW HABIT


habitForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const newHabit = {
        id: Date.now(),
        name: habitName.value.trim(),
        completedDate: null
    };

    if (newHabit.name === "") {
        return;
    }

    habits.push(newHabit);

    displayHabits();

    habitForm.reset();
});


// 6. UPDATE TODAY'S PROGRESS


function updateProgress() {
    const totalHabits = habits.length;

    const completedHabits = habits.filter(function (habit) {
        return habit.completedDate === getTodayDate();
    }).length;

    const percentage =
        totalHabits === 0
            ? 0
            : Math.round((completedHabits / totalHabits) * 100);

    progressText.textContent = percentage + "% Completed";

    progressFill.style.width = percentage + "%";

    habitSummary.textContent =
        completedHabits + " of " + totalHabits + " habits completed";
}


// 7. EDIT A HABIT


function editHabit(habitId) {
    const selectedHabit = habits.find(function (habit) {
        return habit.id === habitId;
    });

    if (!selectedHabit) {
        return;
    }

    const newName = prompt(
        "Enter the new habit name:",
        selectedHabit.name
    );

    if (newName === null || newName.trim() === "") {
        return;
    }

    selectedHabit.name = newName.trim();

    displayHabits();
}

// 8. HANDLE CHECKBOX, EDIT, AND DELETE


habitList.addEventListener("click", function (event) {
    const habitId = Number(event.target.dataset.id);

    // Check or uncheck a habit
    if (event.target.classList.contains("habit-checkbox")) {
        const selectedHabit = habits.find(function (habit) {
            return habit.id === habitId;
        });

        if (selectedHabit) {
            selectedHabit.completedDate = event.target.checked
                ? getTodayDate()
                : null;

            displayHabits();
        }
    }

    // Edit a habit
    if (event.target.classList.contains("edit-button")) {
        editHabit(habitId);
    }

    // Delete a habit
    if (event.target.classList.contains("delete-button")) {
        habits = habits.filter(function (habit) {
            return habit.id !== habitId;
        });

        displayHabits();
    }
});


// 9. DISPLAY INITIAL HABIT LIST


displayHabits();
