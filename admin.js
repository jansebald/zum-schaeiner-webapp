// Daten aus data.json laden
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Daten konnten nicht geladen werden');
        return await response.json();
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        return {
            dailyOffers: {
                "0": "Ruhetag - Kein Angebot",
                "1": "Spießbraten mit Klößen - 6,50 €",
                "2": "Hähnchenkeulen mit Pommes - 5,50 €",
                "3": "Schnitzel mit Beilage - 6,00 €",
                "4": "Bratwurst mit Sauerkraut - 4,50 €",
                "5": "Fischfilet mit Kartoffelsalat - 7,00 €",
                "6": "Gulasch mit Nudeln - 6,50 €"
            },
            menuItems: ["Currywurst - 3,50 €", "Pommes - 2,50 €"],
            news: ["Neueröffnung am 15. März 2025!"],
            openingHours: [],
            images: {}
        };
    }
}

// Daten in data.json speichern (manuell)
async function saveData(data) {
    try {
        console.log('Daten zum Speichern:', JSON.stringify(data, null, 2));
        alert('Bitte kopiere die Daten aus der Konsole, aktualisiere data.json im GitHub-Repository und lade die Seite neu.');
    } catch (error) {
        console.error('Fehler beim Speichern der Daten:', error);
    }
}

// Temporäre Daten für Änderungen
let tempOffers, tempMenu, tempNews, tempImages, tempOpeningHours;

loadData().then(data => {
    console.log('Initial geladene Daten:', data); // Debugging-Ausgabe
    tempOffers = { ...data.dailyOffers };
    tempMenu = [...data.menuItems];
    tempNews = [...data.news];
    tempImages = { ...data.images };
    tempOpeningHours = [...data.openingHours];
    updateLists();
});

// Listen anzeigen
function updateLists() {
    console.log('Aktualisiere Listen...'); // Debugging-Ausgabe
    // Tagesangebote anzeigen
    const offerList = document.getElementById("offer-list");
    offerList.innerHTML = "";
    Object.keys(tempOffers).forEach(day => {
        const li = document.createElement("li");
        li.textContent = `${["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][day]}: ${tempOffers[day]}`;
        const editBtn = document.createElement("button");
        editBtn.textContent = "Bearbeiten";
        editBtn.onclick = () => {
            const newOffer = prompt("Neues Tagesangebot eingeben:", tempOffers[day]);
            if (newOffer) tempOffers[day] = newOffer;
            updateLists();
        };
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Löschen";
        deleteBtn.onclick = () => {
            delete tempOffers[day];
            updateLists();
        };
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        offerList.appendChild(li);
    });

    // Speisekarte anzeigen
    const menuList = document.getElementById("menu-list");
    menuList.innerHTML = "";
    tempMenu.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = item;
        const editBtn = document.createElement("button");
        editBtn.textContent = "Bearbeiten";
        editBtn.onclick = () => {
            const newItem = prompt("Neues Gericht eingeben:", item);
            if (newItem) tempMenu[index] = newItem;
            updateLists();
        };
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Löschen";
        deleteBtn.onclick = () => {
            tempMenu.splice(index, 1);
            updateLists();
        };
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        menuList.appendChild(li);
    });

    // Neuigkeiten anzeigen
    const newsList = document.getElementById("news-list");
    newsList.innerHTML = "";
    tempNews.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = item;
        const editBtn = document.createElement("button");
        editBtn.textContent = "Bearbeiten";
        editBtn.onclick = () => {
            const newNews = prompt("Neue Nachricht eingeben:", item);
            if (newNews) tempNews[index] = newNews;
            updateLists();
        };
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Löschen";
        deleteBtn.onclick = () => {
            tempNews.splice(index, 1);
            updateLists();
        };
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        newsList.appendChild(li);
    });

    // Bilder anzeigen
    const imageList = document.getElementById("image-list");
    imageList.innerHTML = "";
    Object.keys(tempImages).forEach(day => {
        const li = document.createElement("li");
        const img = document.createElement("img");
        img.src = tempImages[day];
        img.style.width = "100px";
        img.style.height = "auto";
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Löschen";
        deleteBtn.onclick = () => {
            delete tempImages[day];
            updateLists();
        };
        li.appendChild(img);
        li.appendChild(deleteBtn);
        imageList.appendChild(li);
    });

    // Öffnungszeiten anzeigen
    const openingHoursList = document.getElementById("opening-hours-list");
    openingHoursList.innerHTML = "";
    tempOpeningHours.forEach((hour, index) => {
        const li = document.createElement("li");
        li.textContent = hour;
        const editBtn = document.createElement("button");
        editBtn.textContent = "Bearbeiten";
        editBtn.onclick = () => {
            const newHour = prompt("Neue Öffnungszeit eingeben:", hour);
            if (newHour) tempOpeningHours[index] = newHour;
            updateLists();
        };
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Löschen";
        deleteBtn.onclick = () => {
            tempOpeningHours.splice(index, 1);
            updateLists();
        };
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        openingHoursList.appendChild(li);
    });
}

// Formulare verarbeiten
document.getElementById("offer-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const day = document.getElementById("offer-day").value;
    const offer = document.getElementById("offer-input").value;
    tempOffers[day] = offer;
    document.getElementById("offer-input").value = "";
    updateLists();
});

document.getElementById("menu-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const item = document.getElementById("menu-input").value;
    tempMenu.push(item);
    document.getElementById("menu-input").value = "";
    updateLists();
});

document.getElementById("news-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const newsItem = document.getElementById("news-input").value;
    tempNews.push(newsItem);
    document.getElementById("news-input").value = "";
    updateLists();
});

document.getElementById("image-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const day = document.getElementById("image-day").value;
    const file = document.getElementById("image-input").files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            tempImages[day] = e.target.result; // Base64-Daten
            document.getElementById("image-input").value = "";
            updateLists();
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("opening-hours-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const hour = document.getElementById("opening-hours-input").value;
    tempOpeningHours.push(hour);
    document.getElementById("opening-hours-input").value = "";
    updateLists();
});

// Speichern-Button
document.getElementById("save-button").addEventListener("click", function() {
    console.log('Speichern-Button geklickt'); // Debugging-Ausgabe
    const data = {
        dailyOffers: tempOffers,
        menuItems: tempMenu,
        news: tempNews,
        images: tempImages,
        openingHours: tempOpeningHours
    };
    saveData(data);
    alert("Änderungen wurden in der Konsole angezeigt. Bitte aktualisiere data.json manuell im GitHub-Repository!");
    if ('Notification' in window && Notification.permission === "granted") {
        new Notification("Update", { body: "Neue Änderungen beim Zum Schäiner!" });
    } else if ('Notification' in window && Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Update", { body: "Neue Änderungen beim Zum Schäiner!" });
            }
        });
    }
    window.location.reload();
});