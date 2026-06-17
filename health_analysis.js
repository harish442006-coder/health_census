const addPatientButton = document.getElementById("addPatient");
const report = document.getElementById("report");
const btnSearch = document.getElementById('btnSearch');
const patients = [];
function addPatient() {
    const name = document.getElementById("name").value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById("age").value;
    const condition = document.getElementById("condition").value;

    if (name && gender && age && condition) {
      patients.push({ name, gender: gender.value, age, condition });
      resetForm();
      generateReport();
    }
  }
  function resetForm() {
    document.getElementById("name").value = "";
    document.querySelector('input[name="gender"]:checked').checked = false;
    document.getElementById("age").value = "";
    document.getElementById("condition").value = "";
  }
  function generateReport() {
    const numPatients = patients.length;
    const conditionsCount = {};
    const genderConditionsCount = {};

    for (const patient of patients) {
        if (!conditionsCount[patient.condition]) {
          conditionsCount[patient.condition] = 0;
        }
        conditionsCount[patient.condition]++;

        if (!genderConditionsCount[patient.gender]) {
          genderConditionsCount[patient.gender] = {};
        }
        if (!genderConditionsCount[patient.gender][patient.condition]) {
          genderConditionsCount[patient.gender][patient.condition] = 0;
        }
        genderConditionsCount[patient.gender][patient.condition]++;
    }

      const knownConditions = [
        "Diabetes",
        "Thyroid",
        "High Blood Pressure",
        "Asthma",
        "Anemia",
        "Arthritis",
        "Migraine",
      ];

      const knownGenders = ["Male", "Female"];

      for (const condition of knownConditions) {
        if (!conditionsCount[condition]) {
          conditionsCount[condition] = 0;
        }
      }

      for (const gender of knownGenders) {
        if (!genderConditionsCount[gender]) {
          genderConditionsCount[gender] = {};
        }

        for (const condition of knownConditions) {
          if (!genderConditionsCount[gender][condition]) {
            genderConditionsCount[gender][condition] = 0;
          }
        }
      }

    if (numPatients === 0) {
      report.innerHTML = `
        <div class="report-empty">
          <span class="report-kicker">Analysis report</span>
          <h3>No patients yet</h3>
          <p>Add a patient to see the summary, condition breakdown, and gender-based counts here.</p>
        </div>
      `;
      return;
    }

    const conditionCards = knownConditions
      .map((condition) => {
        return `
          <div class="report-item">
            <span>${condition}</span>
            <strong>${conditionsCount[condition]}</strong>
          </div>
        `;
      })
      .join("");

    const genderSections = knownGenders
      .map((gender) => {
        const genderCards = knownConditions
          .map((condition) => {
            return `
              <div class="report-item report-item-compact">
                <span>${condition}</span>
                <strong>${genderConditionsCount[gender][condition]}</strong>
              </div>
            `;
          })
          .join("");

        return `
          <section class="report-subsection">
            <h5>${gender}</h5>
            <div class="report-grid report-grid-compact">${genderCards}</div>
          </section>
        `;
      })
      .join("");

    report.innerHTML = `
      <section class="report-summary">
        <span class="report-kicker">Analysis report</span>
        <h3>Patient Summary</h3>
        <p>Overview of the patients currently added to the system.</p>
        <div class="report-total">${numPatients}</div>
        <span class="report-total-label">Total patients added</span>
      </section>

      <section class="report-section">
        <h4>Condition Breakdown</h4>
        <div class="report-grid">${conditionCards}</div>
      </section>

      <section class="report-section">
        <h4>Gender-Based Conditions</h4>
        <div class="report-subsections">${genderSections}</div>
      </section>
    `;
  }

addPatientButton.addEventListener("click", addPatient);

function searchCondition() {
    const input = document.getElementById('conditionInput').value.toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    fetch('health_analysis.json')
      .then(response => response.json())
      .then(data => {
        const condition = data.conditions.find(item => item.name.toLowerCase() === input);

        if (condition) {
          const symptoms = condition.symptoms.join(', ');
          const prevention = condition.prevention.join(', ');
          const treatment = condition.treatment;

          resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
          if (condition.imagesrc) {
            resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="${condition.name}">`;
          }

          resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
          resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
          resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
        } else {
          resultDiv.innerHTML = 'Condition not found.';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = 'An error occurred while fetching data.';
      });
  }
    btnSearch.addEventListener('click', searchCondition);
