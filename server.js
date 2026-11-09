const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cors());

const DB_FILE = './users_db.json';

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
    const initialDb = {
        "admin": { 
            passHash: "admin69", 
            role: "admin", 
            vip: true, 
            allowedDevices: ["Master PC"], 
            approved: true, 
            email: "admin@server.com", 
            adminMsg: "System Admin" 
        }
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
}

// Get Users DB
app.get('/api/users', (req, res) => {
    const data = fs.readFileSync(DB_FILE);
    res.json(JSON.parse(data));
});

// Update/Register/Approve Users DB
app.post('/api/users', (req, res) => {
    try {
        const newDb = req.body;
        fs.writeFileSync(DB_FILE, JSON.stringify(newDb, null, 2));
        res.json({ success: true, message: "Database updated successfully" });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Secure International Vault Server running on port ${PORT}`);
});
