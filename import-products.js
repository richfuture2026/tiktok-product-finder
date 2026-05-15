const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

const supabase = createClient(
  "https://fhjjsakuigapxcyxvyvf.supabase.co",
  "DEIN_SUPABASE_SERVICE_ROLE_KEY"
);

const products = JSON.parse(
  fs.readFileSync("./app/data/products.json", "utf8")
);

async function importProducts() {
  const { data, error } = await supabase
    .from("products")
    .insert(products);

  if (error) {
    console.error(error);
  } else {
    console.log("Produkte importiert:", data);
  }
}

importProducts();