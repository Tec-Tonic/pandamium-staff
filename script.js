function extractData(text) {
  const lines = text.split("\n");
  const data = {};
  let oldUsername = "";
  let removedCount = 0;
  let removedData = [];
  for (const line of lines) {
    const usernameMatch = line.match(/\[CHAT\] (.+?) has \d+ score\(s\):/);
    if (usernameMatch) {
      oldUsername = usernameMatch[1];
    }
    const dataMatch = line.match(/\[CHAT\] \[(.+?)\]: (.+)/);
    if (dataMatch) {
      const key = dataMatch[1];
      const value = dataMatch[2];
      if (value !== "0" || (key.startsWith("home_") && key.endsWith("_d"))) {
        data[key] = value;
      } else {
        removedCount++;
        removedData.push(`[${key}]: ${value}`);
      }
    }
  }
  return { oldUsername, data, removedCount, removedData };
}

document.getElementById("fileInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) {
    alert("Please select a file");
    return;
  }

  const newUsername = document.getElementById("newUsername").value;
  if (!newUsername) {
    alert("Please enter a new username");
    return;
  }

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      const result = extractData(text);
      const oldUsername = result.oldUsername;
      const data = result.data;
      const removedCount = result.removedCount;
      extractedData = extractData(text);

      // Check if Old Username and New Username are the same
      if (oldUsername === newUsername) {
        alert("Old Username and New Username cannot be the same");
        return;
      }

      document.getElementById("oldUsername").value = oldUsername;

      const rowCountElement = document.getElementById("rowCount");
      rowCountElement.textContent = Object.keys(data).length;

      let outputHomeKeys = "";
      let outputOtherKeys = "";
      
      
      for (const key of ['id']) {
        if(data[key]) {
          outputOtherKeys += `<tr><td><button type="button" class="btn btn-primary btn-sm my-2">Copy</button></td><td>/scoreboard players operation ${newUsername} ${key} >< ${oldUsername} ${key}</td></tr>`;
        }
      }

      for (const key of ['votes', 'monthly_votes', 'vote_credits', 'playtime_ticks', 'monthly_playtime_ticks']) {
        if(data[key]) {
          outputOtherKeys += `<tr><td><button type="button" class="btn btn-primary btn-sm my-2">Copy</button></td><td>/scoreboard players operation ${newUsername} ${key} += ${oldUsername} ${key}</td></tr>`;
        }
      }
      
      let homeIndex = 1;
      while(true) {
        let homeExists = false;
        for(const axis of ['x', 'y', 'z', 'd']) {
          let key = `home_${homeIndex}_${axis}`;
          if(data[key]) {
            homeExists = true;
            outputHomeKeys += `<tr><td><button type="button" class="btn btn-primary btn-sm my-2">Copy</button></td><td>/scoreboard players operation ${newUsername} ${key} >< ${oldUsername} ${key}</td></tr>`;
          }
        }
        
        if(!homeExists) break;
        
        homeIndex++;
      }
      
      for (const key in data) {
        if(!key.startsWith('home_') && !['id', 'votes', 'monthly_votes', 'vote_credits', 'playtime_ticks', 'monthly_playtime_ticks'].includes(key)) {
          outputOtherKeys += `<tr><td><button type="button" class="btn btn-primary btn-sm my-2">Copy</button></td><td>/scoreboard players operation ${newUsername} ${key} >< ${oldUsername} ${key}</td></tr>`;
        }
      }
      
      document.getElementById("output").innerHTML =
        outputOtherKeys + outputHomeKeys;
        
      document.getElementById("removedCount").textContent =
        removedCount;

      document.querySelectorAll("#output button").forEach((button) => {
        button.addEventListener("click", function (e) {
          const rowElement =
            e.target.parentElement.parentElement;
          const text =
            rowElement.querySelector("td:nth-child(2)")
              .textContent;
          navigator.clipboard.writeText(text);
          rowElement.classList.add("table-success");

          const rowCountElement =
            document.getElementById("rowCount");
          rowCountElement.textContent =
            parseInt(rowCountElement.textContent) - 1;
        });
      });
    };
    reader.readAsText(file);
  }
});