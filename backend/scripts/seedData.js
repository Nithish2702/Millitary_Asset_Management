require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing users
        await User.deleteMany({});

        // Create sample users
        const users = [
            {
                username: 'admin',
                password: 'admin123',
                role: 'Admin'
            },
            {
                username: 'commander_alpha',
                password: 'commander123',
                role: 'Base Commander',
                base: 'Alpha Base'
            },
            {
                username: 'commander_bravo',
                password: 'commander123',
                role: 'Base Commander',
                base: 'Bravo Base'
            },
            {
                username: 'logistics_alpha',
                password: 'logistics123',
                role: 'Logistics Officer',
                base: 'Alpha Base'
            },
            {
                username: 'logistics_bravo',
                password: 'logistics123',
                role: 'Logistics Officer',
                base: 'Bravo Base'
            }
        ];

        for (const userData of users) {
            const user = new User(userData);
            await user.save();
            console.log(`Created user: ${userData.username}`);
        }

        console.log('Seed data created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedUsers();
