// -------------------- MAIN.JS (Iframe-Safe Version) --------------------

// Interval check for panic/bookmark links
var interval;
function check() {
    if ($("#panicmode").length > 0) {
        $("#panicmode").prop({ href: panicurl });
    }
    if ($(".seleniteminified").length > 0) {
        $.get("https://raw.githubusercontent.com/skysthelimitt/selenite-optimized/main/build/bookmark.txt", function (data) {
            $(".seleniteminified").prop({ href: data });
        });
        if ($(".seleniteminified").length > 0) {
            $.get("https://raw.githubusercontent.com/car-axle-client/car-axle-client/main/dist/build.js", function (data) {
                $(".caraxle").prop({ href: `javascript:${encodeURI(data)}` });
            });
        }
    }
}

// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    // -------------------- ADCONTAINER CLEANUP --------------------
    const adContainers = document.querySelectorAll('[id=adcontainer]');
    if (adContainers.length > 0) {
        adContainers.forEach(container => {
            if (Math.random() < 0.5 || localStorage.getItem("selenite.adblock") === "true") {
                container.innerHTML = "";
            }
        });
    }

    // -------------------- LOCALSTORAGE SETTINGS --------------------
    if (localStorage.getItem("theme")) {
        localStorage.setItem("selenite.theme", localStorage.getItem("theme"));
        localStorage.removeItem("theme");
    }
    const theme = localStorage.getItem("selenite.theme") || "main";
    document.body.setAttribute("theme", theme);

    const iconSetting = document.querySelector("input#discordIcon");
    const blockClose = document.querySelector("input#blockClose");
    const tabDisguise = document.querySelector("input#tabDisguise");

    if (iconSetting) {
        iconSetting.checked = localStorage.getItem("selenite.discordIcon") === "true";
        iconSetting.addEventListener("click", () => {
            localStorage.setItem("selenite.discordIcon", iconSetting.checked);
        });
    }

    if (blockClose) {
        blockClose.checked = localStorage.getItem("selenite.blockClose") === "true";
        blockClose.addEventListener("click", () => {
            localStorage.setItem("selenite.blockClose", blockClose.checked);
        });
    }

    if (tabDisguise) {
        tabDisguise.checked = localStorage.getItem("selenite.tabDisguise") === "true";
        tabDisguise.addEventListener("click", () => {
            localStorage.setItem("selenite.tabDisguise", tabDisguise.checked);
        });
    }

    // -------------------- WIDGETBOT HIDING --------------------
    const widget = document.querySelector("widgetbot-crate");
    if (widget && localStorage.getItem("selenite.discordIcon") === "true") {
        widget.style.display = "none";
    }

    // -------------------- BLANK BUTTON CLICK HANDLER --------------------
    const blankButton = document.getElementById("blank");
    if (blankButton) {
        blankButton.addEventListener("click", () => {
            const win = window.open();
            if (!win) return;

            win.document.body.style.margin = "0";
            win.document.body.style.height = "100vh";

            // Inject HTML safely
            const html = `
                <style>
                    *{margin:0;padding:0;border:none} 
                    body,iframe{height:100vh;width:100vw} 
                    iframe{height:96vh} 
                    header{display:flex;height:4vh;justify-content:center;} 
                    button{margin-right:100px;height:100%;aspect-ratio:1/1} 
                </style>
                <header><button id="goBack"></button><button id="reload"></button></header>
                <iframe id="selenite"></iframe>
            `;
            win.document.querySelector("html").innerHTML = html;

            // Wait until the iframe exists before using it
            const selenite = win.document.getElementById("selenite");
            if (selenite) {
                selenite.setAttribute("src", location.origin);

                const goBack = win.document.getElementById("goBack");
                const reload = win.document.getElementById("reload");

                if (goBack) goBack.addEventListener("click", () => {
                    if (selenite.contentDocument) {
                        selenite.contentDocument.location.href = selenite.contentDocument.location.origin;
                    }
                });
                if (reload) reload.addEventListener("click", () => {
                    if (selenite.contentDocument) {
                        selenite.contentDocument.location.href = selenite.contentDocument.location.href;
                    }
                });
            } else {
                console.error("Failed to find selenite iframe in new window");
            }

            location.href = "https://google.com";
            close();
        });
    }

    // -------------------- ALERT CHECK --------------------
    checkAlert();
});

// -------------------- SUPPORT ALERT --------------------
function checkAlert() {
    if (!Cookies.get("supportalert")) {
        const dialog = document.querySelector(".dialog-width");
        if (!dialog) return;

        const openButton = dialog.nextElementSibling;
        const closeButton = dialog.querySelector('sl-button[slot="footer"]');

        setTimeout(() => {
            dialog.removeAttribute("display");
            dialog.show();
        }, 250);

        if (closeButton) {
            closeButton.addEventListener("click", () => dialog.hide());
        }

        Cookies.set("supportalert", true, { expires: 60 });
    }
}

// -------------------- UTILITY FUNCTIONS --------------------
function setPanicMode() {
    const panicInput = document.getElementById("panic");
    if (!panicInput) return;

    let val = panicInput.value;
    if (!val.startsWith("https")) val = "https://" + val;

    document.cookie = "panicurl=" + val;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert("Copied text!");
}

function setTheme(theme) {
    localStorage.setItem("selenite.theme", theme);
    document.body.setAttribute("theme", theme);
    if (theme !== "custom") {
        const customMenu = document.getElementById("customMenu");
        if (customMenu) customMenu.style.display = "none";
        document.body.style = "";
    }
}

function setPassword() {
    const passInput = document.getElementById("pass");
    if (!passInput) return;
    localStorage.setItem("selenite.password", enc.encode(passInput.value));
}

function delPassword() {
    location.hash = "";
    localStorage.removeItem("selenite.passwordAtt");
    localStorage.removeItem("selenite.password");
}
