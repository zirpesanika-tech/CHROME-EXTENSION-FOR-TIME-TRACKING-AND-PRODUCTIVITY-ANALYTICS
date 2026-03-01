document.addEventListener("DOMContentLoaded", function () {

    const dataDiv = document.getElementById("data");
    const clearBtn = document.getElementById("clear");
    const ctx = document.getElementById("myChart");

    let productiveSites = ["github.com", "stackoverflow.com", "leetcode.com", "beta.unipune.ac.in"];
    let unproductiveSites = ["youtube.com", "www.youtube.com", "facebook.com", "instagram.com"];

    chrome.storage.local.get(null, function(items) {

        if (!items || Object.keys(items).length === 0) {
            dataDiv.textContent = "No data yet.";
            return;
        }

        dataDiv.innerHTML = "";

        let totalProductive = 0;
        let totalUnproductive = 0;

        for (let site in items) {

            let minutes = items[site] / 60000;
            let category = "Neutral";

            if (productiveSites.includes(site)) {
                category = "Productive";
                totalProductive += minutes;
            } 
            else if (unproductiveSites.includes(site)) {
                category = "Unproductive";
                totalUnproductive += minutes;
            }

            let p = document.createElement("p");
            p.innerHTML = `
                <strong>${site}</strong><br>
                ${minutes.toFixed(2)} mins<br>
                Category: ${category}
            `;

            dataDiv.appendChild(p);
            dataDiv.appendChild(document.createElement("hr"));

            fetch("http://localhost:5000/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    website: site,
                    timeSpent: minutes,
                    category: category
                })
            });
        }

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Productive', 'Unproductive'],
                datasets: [{
                    data: [totalProductive, totalUnproductive],
                    backgroundColor: ['green', 'red']
                }]
            }
        });
    });

    clearBtn.addEventListener("click", function() {
        chrome.storage.local.clear(function() {
            alert("Data Cleared");
            location.reload();
        });
    });

});
