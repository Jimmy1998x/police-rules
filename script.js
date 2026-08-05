const API_URL = "https://script.google.com/macros/s/AKfycbwf0ONZkaQASMuEvBEKfrb6C8nLQyPbmaQhoPtXRBC3GoYc_NIs60kwkGTPi01HPjewww/exec";

let allData = [];

async function loadData() {
    const loading = document.getElementById("loading");
    const tables = document.getElementById("tables");

    try {
        const response = await fetch(API_URL);
        allData = await response.json();

        loading.style.display = "none";

        renderTable(allData);

        document.getElementById("search").addEventListener("input", function () {
            const keyword = this.value.toLowerCase();

            const result = allData.filter(item =>
                item["ชื่อคดี"].toLowerCase().includes(keyword)
            );

            renderTable(result);
        });

    } catch (err) {
        loading.innerHTML = "❌ โหลดข้อมูลไม่สำเร็จ";
        console.error(err);
    }
}

function filterCategory(category) {

    if (category === "ทั้งหมด") {
        renderTable(allData);
        return;
    }

    const result = allData.filter(item => item["หมวด"] === category);

    renderTable(result);
}

window.filterCategory = filterCategory;

function renderTable(data) {

    const tables = document.getElementById("tables");

    tables.innerHTML = "";

    if (data.length === 0) {
        tables.innerHTML = "<p>ไม่พบข้อมูล</p>";
        return;
    }

    const group = {};

    data.forEach(item => {

        if (!group[item["หมวด"]]) {
            group[item["หมวด"]] = [];
        }

        group[item["หมวด"]].push(item);

    });

    Object.keys(group).forEach(category => {

        let html = `
        <div class="card">
            <h2>${category}</h2>

            <table>

                <thead>
                    <tr>
                        <th>ชื่อคดี</th>
                        <th>ค่าปรับ</th>
                        <th>จำคุก</th>
                        <th>หมายเหตุ</th>
                    </tr>
                </thead>

                <tbody>
        `;

        group[category].forEach(item => {

            html += `
            <tr>
                <td>${item["ชื่อคดี"]}</td>
                <td>${item["ค่าปรับ"]}</td>
                <td>${item["จำคุก"]}</td>
                <td>${item["หมายเหตุ"] || "-"}</td>
            </tr>
            `;

        });

        html += `
                </tbody>

            </table>

        </div>
        `;

        tables.innerHTML += html;

    });

}

loadData();
