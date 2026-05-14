function register() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    users.push({name, email, password});
    localStorage.setItem("users", JSON.stringify(users));

    alert("Registered successfully!");
    window.location.href = "index.html";
}

// LOGIN
function login() {
    let email = document.getElementById("loginEmail").value;
    let password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid login!");
    }
}

// CHECK LOGIN
function checkLogin() {
    let user = localStorage.getItem("currentUser");
    if (!user) {
        window.location.href = "index.html";
    }
}

// LOGOUT
function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

function submitTask() {
    let title = document.getElementById("title").value;
    let desc = document.getElementById("desc").value;
    let attachmentInput = document.getElementById("attachment");
    let file = attachmentInput.files[0];

    let user = JSON.parse(localStorage.getItem("currentUser"));
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    let saveTask = (fileData, fileName) => {
        tasks.push({
            userEmail: user.email,
            title,
            desc,
            fileName: fileName || "",
            fileData: fileData || ""
        });

        localStorage.setItem("tasks", JSON.stringify(tasks));
        alert("Task submitted!");
        attachmentInput.value = "";
        document.getElementById("title").value = "";
        document.getElementById("desc").value = "";
    };

    if (file) {
        let reader = new FileReader();
        reader.onload = function(event) {
            saveTask(event.target.result, file.name);
        };
        reader.readAsDataURL(file);
    } else {
        saveTask();
    }
}
function displayTasks() {
    let container = document.getElementById("tasks");
    if (!container) return;

    let user = JSON.parse(localStorage.getItem("currentUser"));
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    container.innerHTML = "";

    let userTasks = tasks.filter(t => t.userEmail === user.email);

    if (userTasks.length === 0) {
        container.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--muted);"><p>No submissions yet. <a href="submit.html" style="color: var(--accent-dark); font-weight: 700;">Submit your first task</a></p></div>';
        return;
    }

    userTasks.forEach(t => {
        let attachmentHtml = "";
        if (t.fileName && t.fileData) {
            attachmentHtml = `
                <p class="attachment-line">Attachment: <a href="${t.fileData}" download="${t.fileName}">${t.fileName}</a></p>
            `;
        }

        container.innerHTML += `
            <div class="task">
                <h3>${t.title}</h3>
                <p>${t.desc}</p>
                ${attachmentHtml}
            </div>
        `;
    });
}

function submitContact(event) {
    event.preventDefault();
    alert('Thanks! Your message has been received. We will contact you shortly.');
    event.target.reset();
}

// ACCOUNT MANAGEMENT
function loadAccountDetails() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;

    document.getElementById("fullName").value = user.name || "";
    document.getElementById("accountEmail").value = user.email || "";
}

function updateAccount() {
    let fullName = document.getElementById("fullName").value;
    let currentPassword = document.getElementById("currentPassword").value;
    let newPassword = document.getElementById("newPassword").value;
    let confirmNewPassword = document.getElementById("confirmNewPassword").value;

    let user = JSON.parse(localStorage.getItem("currentUser"));
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Verify current password
    if (user.password !== currentPassword) {
        alert("Current password is incorrect!");
        return;
    }

    // Validate new password if provided
    if (newPassword && newPassword !== confirmNewPassword) {
        alert("New passwords do not match!");
        return;
    }

    if (newPassword && newPassword.length < 4) {
        alert("New password must be at least 4 characters long!");
        return;
    }

    // Update user data
    user.name = fullName;
    if (newPassword) {
        user.password = newPassword;
    }

    // Update in users array
    let userIndex = users.findIndex(u => u.email === user.email);
    if (userIndex !== -1) {
        users[userIndex] = user;
    }

    // Save updated data
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account updated successfully!");
    window.location.href = "dashboard.html";
}