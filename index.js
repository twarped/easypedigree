function menuBarTimer() {
    var modd = document.body.querySelector("#modd-option");
    var mod = document.querySelector("#menu-bar");
    var modHovered = false;
    var moddHovered = false;
    modd.addEventListener("mouseenter", () => {
        modHovered = false;
        mod.classList.add("block");
        moddHovered = true;
        try {
            clearTimeout(moddTimeout);
        } catch (e) {
            
        }
    });
    modd.addEventListener("mouseleave", () => {
        window.moddTimeout = setTimeout(() => { 
            if (!modHovered) { 
                mod.classList.remove("block"); 
                moddHovered = false 
            } 
        }, 600);
    });
    mod.addEventListener("mouseenter", () => {
        moddHovered = false;
        mod.classList.add("block");
        modHovered = true;
        try {
            clearTimeout(modTimeout);
        } catch (e) {
            
        }
    });
    mod.addEventListener("mouseleave", () => {
        window.modTimeout = setTimeout(() => { 
            if (!moddHovered) { 
                mod.classList.remove("block"); 
                modHovered = false 
            } 
        }, 600);
    });
}

function copyText(text, customMessage = "Copied text to clipboard") {
    navigator.clipboard.writeText(text);
    toast(customMessage);
}

function toast(text, len = 3000) {
    document.body.querySelectorAll("toast").forEach((e) => e.remove());
    var toast = document.createElement("toast");
    toast.textContent = text;
    toast.style.animation = "fade " + len / 1000 + "s";
    toast.addEventListener("click", () => toast.remove());
    document.body.appendChild(toast);
    setTimeout(() => {
        try {
            document.body.removeChild(toast);
        } catch (e) { }
    }, len);
}

function goTo(e) {
    var eStyle = getComputedStyle(e);
    var navBarStyle = getComputedStyle(document.getElementById("nav-bar"));
    var offsetY = getCoords(e);
    document.body.scrollBy({ behavior: "smooth", top: -(offsetY + parseInt(navBarStyle.height) + parseInt(eStyle.marginTop)) });
}

function getCoords(e) {
    var offsetY = 0;
    function c(el) {
        offsetY = el.offsetY;
    }
    var click = new MouseEvent("click");
    e.addEventListener("click", c,)
    e.dispatchEvent(click);
    e.removeEventListener("click", c)
    return offsetY;
}