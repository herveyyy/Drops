import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { products } from "../db/schema/products";

const db = drizzle(process.env.DB_FILE_NAME!);

const SEED_PRODUCTS = [
  {
    name: "Premium Photo Paper",
    description:
      "High-quality glossy 200GSM photo paper. Vivid colors, sharp detail.",
    price: 1299, // $12.99
    specs: "200GSM // GLOSSY // A4",
  },
  {
    name: "Matte Business Card",
    description: "Thick matte-finish business cards. Pack of 500 units.",
    price: 2400, // $24.00
    specs: "350GSM // MATTE // 3.5x2in // 500 UNITS",
  },
  {
    name: "Canvas Poster Print",
    description:
      "Museum-grade canvas stretched on wooden frame. Various sizes.",
    price: 4500, // $45.00
    specs: "CANVAS // STRETCHED // 18x24in",
  },
  {
    name: "Vinyl Sticker Sheet",
    description:
      "Waterproof vinyl stickers. Die-cut to your design. Sheet of 50.",
    price: 1800, // $18.00
    specs: "VINYL // WATERPROOF // 50 UNITS",
  },
  {
    name: "Acrylic Standee",
    description: "Custom-cut acrylic standee with printed design and base.",
    price: 3500, // $35.00
    specs: "ACRYLIC // 6in TALL // CUSTOM CUT",
  },
  {
    name: "Tote Bag Print",
    description: "Heavy-duty cotton tote with full-color DTG print.",
    price: 2200, // $22.00
    specs: "COTTON // DTG PRINT // 15x16in",
  },
];

async function seed() {
  console.log("SEED_START: Inserting products...");

  for (const product of SEED_PRODUCTS) {
    await db.insert(products).values(product);
    console.log(`  + ${product.name} ($${(product.price / 100).toFixed(2)})`);
  }

  console.log(`SEED_COMPLETE: ${SEED_PRODUCTS.length} products inserted.`);
}

seed().catch(console.error);
