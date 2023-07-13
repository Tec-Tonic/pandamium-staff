let inventoryData = [];
let data = ``;
let redBackgroundItems = [];

window.onload = function () {
  document
    .getElementById("fileInputInventory")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = function (event) {
        data = event.target.result;
        processData();
      };
      reader.readAsText(file);
    });
};

function processData() {
  console.log(data);
  data = data.replace(/\?/g, "");
  const namelines = data.split("\n");
  let name = "";

  // Find the last occurrence of "======== Inventory Contents ========\\nPlayer:"
  for (let i = namelines.length - 1; i >= 0; i--) {
    if (namelines[i].includes("======== Inventory Contents ========\\nPlayer:")) {
      name = namelines[i]
        .substring(namelines[i].indexOf("Player:") + "Player:".length)
        .trim();
      break;
    }
  }
  console.log(name);

  const element = `<h1 class="text-center">${name}'s Inventory</h1>`;
  document.getElementById("nameContainer").innerHTML = element;

  let lines = data.split("\n");

  // Find the index of the last occurrence of "======== Inventory Contents ========"
  let startIndex;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes("======== Inventory Contents ========")) {
      startIndex = i;
      break;
    }
  }

  // Only process lines after the last occurrence of "======== Inventory Contents ========"
  lines = lines.slice(startIndex);

  let inventory = [];

  for (let i = 0; i < lines.length; i++) {
    if (
      lines[i].includes("hotbar.") ||
      lines[i].includes("inventory.") ||
      lines[i].includes("armor.feet") ||
      lines[i].includes("armor.legs") ||
      lines[i].includes("armor.chest") ||
      lines[i].includes("armor.head") ||
      lines[i].includes("weapon.offhand")
    ) {
      let parts = lines[i].split(": ");
      let item = parts[2].split(" ");
      let quantity = item.shift();
      item = item.join(" ");

      let itemParts = item.split(" ");
      let nbtIndex = itemParts.indexOf("[NBT]");
      let itemNameAfterNbt;
      if (nbtIndex !== -1) {
        itemNameAfterNbt = itemParts.slice(nbtIndex + 1).join(" ");
        itemParts.splice(nbtIndex);
      } else {
        itemNameAfterNbt = itemParts.slice(1).join(" ");
      }

      let minecraftItemName = itemParts[0].trim();

      if (itemNameAfterNbt) {
        minecraftItemName = minecraftItemName.replace(itemNameAfterNbt, "").trim();
      }

      if (minecraftItemName.endsWith("s")) {
        minecraftItemName = minecraftItemName.slice(0, -1);
      }
      inventory.push({
        name: minecraftItemName,
        quantity: +quantity,
        location: `${parts[1].replace("[System] [CHAT]", "").trim()}`,
        itemNameAfterNbt: itemNameAfterNbt,
      });
    }
  }

  inventoryData = inventory;
  updateInventoryDisplay();

  initializeTooltips();
}

function initializeTooltips() {
  var tooltipTriggerList = [].slice.call(
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
  );
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
}
