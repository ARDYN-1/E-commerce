
document.addEventListener("DOMContentLoaded", () => {
    // === Shop Link Scroll ===
    const shopLink = document.querySelector(".navbar-pt1 a:nth-child(1)");
    const shopSection = document.querySelector(".shop-section");
    if (shopLink && shopSection) {
        shopLink.addEventListener("click", (e) => {
            e.preventDefault();
            shopSection.scrollIntoView({ behavior: "smooth" });
        });
    }

    // === Hero Button Scroll ===
    const shopNowBtn = document.querySelector(".hero3 button");
    if (shopNowBtn && shopSection) {
        shopNowBtn.addEventListener("click", (e) => {
            e.preventDefault();
            shopSection.scrollIntoView({ behavior: "smooth" });
        });
    }

    // === Product Box Hover Logging ===
    const productBoxes = document.querySelectorAll(".box");
    productBoxes.forEach(box => {
        box.addEventListener("mouseenter", () => {
            const lines = box.innerText.trim().split("\n");
            console.log("Hovering over product:", lines[0]);
        });
    });

    // === Slide Animation Observer ===
    const slideElements = document.querySelectorAll(".slide-effect, .slide-effect2, .slide-effect3");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("animate");
            }
        });
    }, { threshold: 0.5 });
    slideElements.forEach(el => observer.observe(el));

    // === Sidebar: Search Logic ===
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const closeBtn = sidebar.querySelector(".closebtn");

    document.querySelector(".search-icon").addEventListener("click", () => {
        sidebar.style.width = "250px";
        overlay.style.display = "block";
    });

    closeBtn.addEventListener("click", () => {
        sidebar.style.width = "0";
        overlay.style.display = "none";
    });

    // === User Sidebar Logic ===
    const userSidebar = document.getElementById("userSidebar");
    const userCloseBtn = userSidebar.querySelector(".closebtn");
    const userIcon = document.querySelector(".fa-user").parentElement;

    userIcon.addEventListener("click", (e) => {
        e.preventDefault();
        userSidebar.style.width = "250px";
        overlay.style.display = "block";
    });

    userCloseBtn.addEventListener("click", () => {
        userSidebar.style.width = "0";
        overlay.style.display = "none";
    });

    // === Overlay closes both sidebars ===
    overlay.addEventListener("click", () => {
        sidebar.style.width = "0";
        userSidebar.style.width = "0";
        overlay.style.display = "none";
    });

    // === Firebase Email-Password Form Submission ===
    import("./firebaseConfig.js").then(({ auth, signInWithEmailAndPassword }) => {
        document.getElementById("emailLoginForm").addEventListener("submit", (e) => {
            e.preventDefault();
            const email = e.target[0].value;
            const pass = e.target[1].value;

            signInWithEmailAndPassword(auth, email, pass)
                .then((userCredential) => {
                    console.log("Login successful");
                    alert("Login successful");
                })
                .catch((error) => {
                    console.error("Login failed:", error.message);
                    alert("Login failed: " + error.message);
                });
        });
    });
});
