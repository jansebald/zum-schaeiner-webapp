// Standardwerte, falls data.json nicht geladen werden kann
const defaultOffers = {
    "0": "Ruhetag - Kein Angebot",
    "1": "Spießbraten mit Klößen - 6,50 €",
    "2": "Hähnchenkeulen mit Pommes - 5,50 €",
    "3": "Schnitzel mit Beilage - 6,00 €",
    "4": "Bratwurst mit Sauerkraut - 4,50 €",
    "5": "Sauerbraten - 7,00 €",
    "6": "Gulasch mit Nudeln - 6,50 €"
};
const defaultMenu = ["Currywurst - 3,50 €", "Pommes - 2,50 €"];
const defaultNews = ["Neueröffnung am 15. März 2025!"];
const defaultOpeningHours = [];

// Daten aus data.json laden
async function loadData() {
    try {
        const response = await fetch('data.json', { cache: 'no-store' }); // Cache deaktivieren
        if (!response.ok) throw new Error('Daten konnten nicht geladen werden');
        return await response.json();
    } catch (error) {
        console.error('Fehler beim Laden der Daten:', error);
        return {
            dailyOffers: defaultOffers,
            menuItems: defaultMenu,
            news: defaultNews,
            openingHours: defaultOpeningHours,
            images: {}
        };
    }
}

function displayData() {
    loadData().then(data => {
        // Tagesangebote
        const dailyOffers = data.dailyOffers;
        const today = new Date().getDay();
        document.getElementById("offer-content").textContent = dailyOffers[today] || "Kein Angebot heute";

        // Wochenübersicht
        const weeklyList = document.getElementById("weekly-offer-list");
        weeklyList.innerHTML = "";
        const weekdays = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
        const images = data.images;
        Object.keys(dailyOffers).forEach(day => {
            const li = document.createElement("li");
            li.textContent = `${weekdays[day]}: ${dailyOffers[day]}`;
            if (images[day]) {
                const img = document.createElement("img");
                img.src = images[day];
                img.style.width = "50px";
                img.style.height = "auto";
                img.style.marginLeft = "10px";
                li.appendChild(img);
            }
            weeklyList.appendChild(li);
        });

        // Neuigkeiten
        const news = data.news;
        document.getElementById("news-content").textContent = news.join(" | ");

        // Speisekarte mit Bestellbutton
        const menuItems = data.menuItems;
        const menuList = document.getElementById("menu-items");
        menuList.innerHTML = "";
        menuItems.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            const orderBtn = document.createElement("button");
            orderBtn.textContent = "Bestellen";
            orderBtn.onclick = () => {
                window.location.href = `whatsapp://send?text=Ich möchte ${item} bestellen bei Zum Schäiner!`;
            };
            li.appendChild(orderBtn);
            menuList.appendChild(li);
        });

        // Öffnungszeiten
        const openingHours = data.openingHours;
        document.getElementById("opening-hours-content").textContent = openingHours.join(" | ");
    });
}

// Daten beim Laden der Seite anzeigen
window.onload = displayData;

// Automatische Aktualisierung alle 5 Sekunden
setInterval(() => {
    displayData();
    // Prüfen auf Updates
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CHECK_UPDATE' });
    }
}, 5000);

// Service Worker registrieren und auf Updates prüfen
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then(reg => {
            console.log('Service Worker registriert');
        })
        .catch(err => console.log('Service Worker Fehler:', err));

    // Nachricht vom Service Worker empfangen
    navigator.serviceWorker.addEventListener('message', event => {
        if (event.data.type === 'UPDATE_AVAILABLE') {
            if (confirm('Eine neue Version der Daten ist verfügbar. Jetzt aktualisieren?')) {
                window.location.reload();
            }
        }
    });
}