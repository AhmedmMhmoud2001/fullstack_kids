require('dotenv').config();
// Server configuration
const app = require('./app');
const prisma = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // Validate Database Connection
        await prisma.$connect();
        console.log('✅ Connected to MySQL Database via Prisma');

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
