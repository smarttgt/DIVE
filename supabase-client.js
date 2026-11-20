window.diveSupabase = window.supabase.createClient(
    window.DIVE_SUPABASE_URL,
    window.DIVE_SUPABASE_PUBLISHABLE_KEY
);

console.log("DIVE Supabase connection initialized");
// DIVE account pop-up controls

const signupButton = document.getElementById("show-signup");
const loginButton = document.getElementById("show-login");

const accountModal = document.getElementById("dive-account-modal");
const closeModalButton = document.getElementById("close-account-modal");

const signupSection = document.getElementById("signup-form");
const loginSection = document.getElementById("login-form");

const accountMessage = document.getElementById("account-message");

signupButton.addEventListener("click", function () {
    accountModal.hidden = false;
    accountModal.style.display = "flex";
    signupSection.hidden = false;
    loginSection.hidden = true;
    accountMessage.textContent = "";
});

loginButton.addEventListener("click", function () {
    accountModal.hidden = false;
    accountModal.style.display = "flex";
    loginSection.hidden = false;
    signupSection.hidden = true;
    accountMessage.textContent = "";
});

closeModalButton.addEventListener("click", function () {
    accountModal.hidden = true;
    accountModal.style.display = "none";
});

// DIVE registration

document.getElementById("dive-signup-form")
.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("signup-username")
        .value.trim().toLowerCase();

    const email = document.getElementById("signup-email").value.trim();

    const password = document.getElementById("signup-password").value;

    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
        accountMessage.textContent =
            "Username must be 3–20 characters using letters, numbers or underscores.";
        return;
    }

    accountMessage.textContent = "Creating your account...";

    const { data, error } = await window.diveSupabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                username: username
            }
        }
    });

    if (error) {
        accountMessage.textContent = error.message;
        return;
    }

    accountMessage.textContent =
        "Registration successful! Check your email to confirm your account.";
});

// DIVE login

document.getElementById("dive-login-form")
.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value.trim();

    const password = document.getElementById("login-password").value;

    accountMessage.textContent = "Logging in...";

    const { data, error } =
        await window.diveSupabase.auth.signInWithPassword({
            email: email,
            password: password
        });

    if (error) {
        accountMessage.textContent = error.message;
        return;
    }

    accountMessage.textContent = "Welcome back to DIVE!";
});
// DIVE member session management

const diveAccountButtons = document.getElementById("dive-account-buttons");
const diveLoggedInBar = document.getElementById("dive-logged-in-bar");
const diveUserGreeting = document.getElementById("dive-user-greeting");
const diveLogoutButton = document.getElementById("dive-logout-button");

function updateDIVEAccountUI(session) {
    if (session && session.user) {
        const username = session.user.user_metadata.username || "Member";

        diveUserGreeting.textContent = "Welcome, " + username;

        diveAccountButtons.hidden = true;
        diveLoggedInBar.hidden = false;

        accountModal.hidden = true;
        accountModal.style.display = "none";
    } else {
        diveAccountButtons.hidden = false;
        diveLoggedInBar.hidden = true;
    }
}

// Check whether a member is already logged in
window.diveSupabase.auth.getSession().then(({ data, error }) => {
    if (error) {
        console.error("Session check failed:", error.message);
        return;
    }

    updateDIVEAccountUI(data.session);
});

// Keep the interface updated when login status changes
window.diveSupabase.auth.onAuthStateChange((event, session) => {
    updateDIVEAccountUI(session);
});

// Log out
diveLogoutButton.addEventListener("click", async function () {
    const { error } = await window.diveSupabase.auth.signOut();

    if (error) {
        alert(error.message);
    }
});