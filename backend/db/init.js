require("dotenv").config();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function initializeDatabase() {
  try {
    console.log("Connecting to database...");
    
    // Test database connection
    await prisma.$connect();
    console.log("Database connected successfully!");
    
    // Run any additional setup here if needed
    console.log("Database initialization complete!");
    
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
