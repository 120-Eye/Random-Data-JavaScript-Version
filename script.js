let generatedData = []; // Stores generated user data

// Event listener for the Generate Data button
document.getElementById("generateBtn").addEventListener("click", generateData);

// Event listener for DOM content loaded
document.addEventListener("DOMContentLoaded", function () {
    const countrySelect = document.getElementById("country");
    const ssnCheckbox = document.getElementById("ssn-checkbox");

    // Show SSN option only if USA is selected
    countrySelect.addEventListener("change", function () {
        if (countrySelect.value === "USA") {
            ssnCheckbox.style.display = "inline-block";
        } else {
            ssnCheckbox.style.display = "none";
            ssnCheckbox.querySelector("input").checked = false; // Uncheck SSN if not USA
        }
    });
});

// Function to generate random data based on selected fields
function generateData() {
    console.log("Generate Data function called!");

    // Check if elements exist before accessing them
    let numUsersInput = document.getElementById("num-users");
    let countrySelect = document.getElementById("country");

    if (!numUsersInput || !countrySelect) {
        console.error("Missing required input fields in the DOM!");
        return;
    }

    let selectedFields = [];
    document.querySelectorAll(".checkbox-btn input:checked").forEach((checkbox) => {
        selectedFields.push(checkbox.value);
    });

    let numUsers = parseInt(numUsersInput.value) || 5; // Default: 5 users
    let country = countrySelect.value;

    let data = [];
    for (let i = 0; i < numUsers; i++) {
        data.push(generateRandomData(selectedFields, country));
    }

    console.log("Generated Data:", data);

    // Show the download button only if data is available
    let downloadBtn = document.getElementById("downloadBtn");
    if (data.length > 0 && downloadBtn) {
        downloadBtn.style.display = "block";
        downloadBtn.onclick = function () {
            downloadCSV(data);
        };
    } else {
        console.error("Download button not found in the DOM!");
    }
}

// Function to generate random user data based on selected fields
function generateRandomData(fields, country) {
    let user = {};
    fields.forEach(field => {
        switch (field) {
            case "name":
                user.name = faker.name.findName();
                break;
            case "email":
                user.email = faker.internet.email();
                break;
            case "phone":
                user.phone = faker.phone.phoneNumber();
                break;
            case "ssn":
                user.ssn = (country === "USA") ? faker.random.number({ min: 100000000, max: 999999999 }).toString().replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3') : "N/A"; // Format SSN
                break;
            default:
                user[field] = "N/A";
        }
    });
    return user;
}

// Function to download the generated data as a CSV file
function downloadCSV(data) {
    let csvContent = "data:text/csv;charset=utf-8,";
    let headers = Object.keys(data[0]).join(",") + "\n"; // Create headers from the keys of the first object
    csvContent += headers;

    data.forEach(row => {
        let rowData = Object.values(row).join(","); // Join values of each row
        csvContent += rowData + "\n"; // Add each row to the CSV content
    });

    let encodedUri = encodeURI(csvContent); // Encode the CSV content
    let link = document.createElement("a"); // Create a temporary link element
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "random_user_data.csv"); // Set the download filename
    document.body.appendChild(link); // Append the link to the body
    link.click(); // Trigger the download
    document.body.removeChild(link); // Remove the link from the document
}