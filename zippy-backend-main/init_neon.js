const { neon } = require('@neondatabase/serverless');

const databaseUrl = "postgres://neondb_owner:npg_vpfakcbs92xB@ep-red-sky-b5mfvldb.c-7.us-east-2.aws.neon.tech/neondb";

const sql = neon(databaseUrl);

async function initDB() {
  try {
    console.log("Connecting to Neon PostgreSQL:", databaseUrl);
    
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'CUSTOMER',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        image_path TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        seller_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        total_amount NUMERIC(10, 2) NOT NULL,
        seller_id VARCHAR(255) NOT NULL,
        items JSONB DEFAULT '[]'::jsonb,
        status VARCHAR(50) DEFAULT 'RECEIVED',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS subscribers (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log("✅ Neon PostgreSQL Database Tables Created Successfully!");

    // Check count of products
    const countRes = await sql`SELECT COUNT(*)::int AS count FROM products;`;
    const count = countRes[0].count;
    console.log(`Current Neon product count: ${count}`);

    if (count === 0) {
      console.log("🌱 Seeding sample products into Neon database...");
      const sampleProducts = [
        ['prod_1', 'Parle Hide and Seek Chocolate Chip Cookies, 200g', 44, 'https://res.cloudinary.com/duhokqw0j/image/upload/v1782300572/zippy_products/ema7m8ohxy4xvaecrlvh.jpg', 'School Time', '6a3b7a76f70fd7a54141f5bb'],
        ['prod_2', 'Cadbury Dairy Milk Silk Roast Almond Chocolate Bars, 52 g', 83, 'https://res.cloudinary.com/duhokqw0j/image/upload/v1782296896/zippy_products/znn0vznou1wtsqal3cxa.jpg', 'School Time', '6a3bb04fc41f74925d86e04c'],
        ['prod_3', 'Cadbury Dairy Milk Chocolate Maha Pack, 52 Grams', 40, 'https://res.cloudinary.com/duhokqw0j/image/upload/v1782296604/zippy_products/zzh3xq707dihyiffbvup.jpg', 'School Time', '6a3b7a76f70fd7a54141f5bb'],
        ['prod_4', 'Lays Potato Chips - American Style Cream & Onion 26.5g', 10, 'https://res.cloudinary.com/duhokqw0j/image/upload/v1782230801/zippy_products/eg7c98y29nu1apyaa8ru.jpg', 'Grocery', '6a39661d418e93be6508ebdc'],
        ['prod_5', 'Lays Classic Salted Potato Chips, 37.5g', 10, 'https://res.cloudinary.com/duhokqw0j/image/upload/v1782234835/zippy_products/own1ablw1ltmc5kdxpl8.jpg', 'Grocery', '6a39661d418e93be6508ebdc'],
        ['prod_6', 'Surf Excel Easy Wash Detergent Powder 7 kg', 730, 'https://res.cloudinary.com/duhokqw0j/image/upload/v1782234854/zippy_products/d4d9zctm2pkwkzwohbik.jpg', 'Home', '6a39661d418e93be6508ebdc'],
        ['prod_7', 'Dettol Liquid Handwash Refill – Skincare Hand Wash- 1350ml', 179, 'https://res.cloudinary.com/duhokqw0j/image/upload/v1782234877/zippy_products/mqvbvixglbxqaxq6y1tp.jpg', 'Beauty', '6a39661d418e93be6508ebdc'],
        ['prod_8', 'Pears Original Glycerin Soap Bar - Pack of 8', 414, 'https://res.cloudinary.com/duhokqw0j/image/upload/v1782234963/zippy_products/ylb1p0jamji6c94svf1n.jpg', 'Beauty', '6a39661d418e93be6508ebdc'],
        ['prod_9', 'MAGGI 2-Minute Instant Noodles, 75g', 14, 'https://res.cloudinary.com/duhokqw0j/image/upload/v1782235038/zippy_products/u3kgbqenkte1tm1gjkug.jpg', 'Grocery', '6a39661d418e93be6508ebdc'],
        ['prod_10', 'Sunfeast Dark Fantasy Yumfills Whoopie Pie, 253g', 96, 'https://res.cloudinary.com/duhokqw0j/image/upload/v1782235069/zippy_products/bct82sbmhkinmrueuqjj.jpg', 'Grocery', '6a39661d418e93be6508ebdc'],
        ['prod_11', 'Thums Up Soft Drink Pet Bottle, 750 Ml', 33, 'https://res.cloudinary.com/duhokqw0j/image/upload/v1782235098/zippy_products/vju4oizal0z8cekq6qcy.jpg', 'Grocery', '6a39661d418e93be6508ebdc'],
        ['prod_12', '7UP Extra Fizz, 400 Ml', 20, 'https://res.cloudinary.com/duhokqw0j/image/upload/v1782235132/zippy_products/a9feltniqx0vpo9j74t7.jpg', 'Grocery', '6a39661d418e93be6508ebdc'],
        ['prod_13', 'Fortune Premium Kachi Ghani Pure Mustard Oil, 1 ltr', 182, 'https://res.cloudinary.com/duhokqw0j/image/upload/v1782269469/zippy_products/refqrbcsdvegmhlskhrh.jpg', 'Grocery', '6a39661d418e93be6508ebdc']
      ];

      for (const p of sampleProducts) {
        await sql`
          INSERT INTO products (id, title, price, image_path, category, seller_id)
          VALUES (${p[0]}, ${p[1]}, ${p[2]}, ${p[3]}, ${p[4]}, ${p[5]})
          ON CONFLICT (id) DO NOTHING;
        `;
      }
      console.log("✅ Seeded 13 sample products into Neon database!");
    }

    const sampleRes = await sql`SELECT id, title, price, category FROM products LIMIT 5;`;
    console.log("Sample Neon DB Products:", sampleRes);

  } catch (err) {
    console.error("Neon DB Init Error:", err);
  }
}

initDB();
