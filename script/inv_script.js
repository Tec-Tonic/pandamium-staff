let inventoryData = [];
let data = ``;
let redBackgroundItems = [
  "coal_ore",
  "deepslate_coal_ore",
  "coal",
  "iron_ore",
  "deepslate_iron_ore",
  "iron_ingot",
  "copper_ore",
  "deepslate_copper_ore",
  "raw_copper",
  "copper_ingot",
  "gold_ore",
  "deepslate_gold_ore",
  "gold_ingot",
  "raw_gold",
  "gold_nugget",
  "redstone_ore",
  "deepslate_redstone_ore",
  "redstone",
  "emerald_ore",
  "deepslate_emerald_ore",
  "emerald",
  "lapis_ore",
  "deepslate_lapis_ore",
  "lapis_lazuli",
  "diamond_ore",
  "deepslate_diamond_ore",
  "diamond",
  "nether_gold_ore",
  "nether_quartz_ore",
  "quartz",
  "ancient_debri",
  "netherite_scrap",
];

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
  data = data.replace(/\?/g, "");
  const namelines = data.split("\n");
  let name = "";

  for (const line of namelines) {
    if (line.includes("Player:")) {
      name = line.substring(line.indexOf("Player:") + "Player:".length).trim();
      break;
    }
  }
  const element = `<h1 class="text-center">${name}'s Inventory</h1>`;
  document.getElementById("nameContainer").innerHTML = element;

  let lines = data.split("\n");

  let inventory = [];

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("hotbar.") || lines[i].includes("inventory.")) {
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

