require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Asset = require('../models/Asset');
const Purchase = require('../models/Purchase');
const Transfer = require('../models/Transfer');
const Assignment = require('../models/Assignment');
const Expenditure = require('../models/Expenditure');

const seedAllData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Asset.deleteMany({});
        await Purchase.deleteMany({});
        await Transfer.deleteMany({});
        await Assignment.deleteMany({});
        await Expenditure.deleteMany({});
        console.log('Cleared existing data');

        // Create users
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
                username: 'commander_charlie',
                password: 'commander123',
                role: 'Base Commander',
                base: 'Charlie Base'
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

        const createdUsers = {};
        for (const userData of users) {
            const user = new User(userData);
            await user.save();
            createdUsers[userData.username] = user;
            console.log(`Created user: ${userData.username}`);
        }

        // Create purchases
        const purchases = [
            {
                assetName: 'M4 Rifle',
                assetType: 'Weapon',
                base: 'Alpha Base',
                quantity: 150,
                purchasedBy: createdUsers['logistics_alpha']._id,
                purchaseDate: new Date('2026-03-01')
            },
            {
                assetName: 'M4 Rifle',
                assetType: 'Weapon',
                base: 'Bravo Base',
                quantity: 120,
                purchasedBy: createdUsers['logistics_bravo']._id,
                purchaseDate: new Date('2026-03-02')
            },
            {
                assetName: 'Humvee',
                assetType: 'Vehicle',
                base: 'Alpha Base',
                quantity: 10,
                purchasedBy: createdUsers['admin']._id,
                purchaseDate: new Date('2026-03-05')
            },
            {
                assetName: 'Humvee',
                assetType: 'Vehicle',
                base: 'Bravo Base',
                quantity: 8,
                purchasedBy: createdUsers['logistics_bravo']._id,
                purchaseDate: new Date('2026-03-06')
            },
            {
                assetName: '5.56mm Ammunition',
                assetType: 'Ammunition',
                base: 'Alpha Base',
                quantity: 50000,
                purchasedBy: createdUsers['logistics_alpha']._id,
                purchaseDate: new Date('2026-03-03')
            },
            {
                assetName: '5.56mm Ammunition',
                assetType: 'Ammunition',
                base: 'Bravo Base',
                quantity: 40000,
                purchasedBy: createdUsers['logistics_bravo']._id,
                purchaseDate: new Date('2026-03-04')
            },
            {
                assetName: 'M9 Pistol',
                assetType: 'Weapon',
                base: 'Alpha Base',
                quantity: 80,
                purchasedBy: createdUsers['logistics_alpha']._id,
                purchaseDate: new Date('2026-03-07')
            },
            {
                assetName: 'Bradley Fighting Vehicle',
                assetType: 'Vehicle',
                base: 'Charlie Base',
                quantity: 5,
                purchasedBy: createdUsers['admin']._id,
                purchaseDate: new Date('2026-03-08')
            },
            {
                assetName: 'Night Vision Goggles',
                assetType: 'Weapon',
                base: 'Alpha Base',
                quantity: 60,
                purchasedBy: createdUsers['logistics_alpha']._id,
                purchaseDate: new Date('2026-03-10')
            },
            {
                assetName: '9mm Ammunition',
                assetType: 'Ammunition',
                base: 'Alpha Base',
                quantity: 20000,
                purchasedBy: createdUsers['logistics_alpha']._id,
                purchaseDate: new Date('2026-03-11')
            }
        ];

        for (const purchaseData of purchases) {
            const purchase = new Purchase(purchaseData);
            await purchase.save();

            // Update or create asset
            let asset = await Asset.findOne({ 
                assetName: purchaseData.assetName, 
                base: purchaseData.base 
            });
            if (asset) {
                asset.quantity += purchaseData.quantity;
                await asset.save();
            } else {
                asset = new Asset({
                    assetName: purchaseData.assetName,
                    assetType: purchaseData.assetType,
                    base: purchaseData.base,
                    quantity: purchaseData.quantity
                });
                await asset.save();
            }
        }
        console.log(`Created ${purchases.length} purchases`);

        // Create transfers
        const transfers = [
            {
                assetName: 'M4 Rifle',
                assetType: 'Weapon',
                fromBase: 'Alpha Base',
                toBase: 'Bravo Base',
                quantity: 30,
                initiatedBy: createdUsers['commander_alpha']._id,
                transferDate: new Date('2026-03-12'),
                status: 'Completed'
            },
            {
                assetName: 'Humvee',
                assetType: 'Vehicle',
                fromBase: 'Bravo Base',
                toBase: 'Charlie Base',
                quantity: 2,
                initiatedBy: createdUsers['commander_bravo']._id,
                transferDate: new Date('2026-03-13'),
                status: 'Completed'
            },
            {
                assetName: '5.56mm Ammunition',
                assetType: 'Ammunition',
                fromBase: 'Alpha Base',
                toBase: 'Charlie Base',
                quantity: 10000,
                initiatedBy: createdUsers['admin']._id,
                transferDate: new Date('2026-03-14'),
                status: 'Completed'
            },
            {
                assetName: 'M9 Pistol',
                assetType: 'Weapon',
                fromBase: 'Alpha Base',
                toBase: 'Bravo Base',
                quantity: 15,
                initiatedBy: createdUsers['commander_alpha']._id,
                transferDate: new Date('2026-03-15'),
                status: 'Completed'
            },
            {
                assetName: 'Night Vision Goggles',
                assetType: 'Weapon',
                fromBase: 'Alpha Base',
                toBase: 'Charlie Base',
                quantity: 10,
                initiatedBy: createdUsers['admin']._id,
                transferDate: new Date('2026-03-16'),
                status: 'Completed'
            }
        ];

        for (const transferData of transfers) {
            const transfer = new Transfer(transferData);
            await transfer.save();

            // Update source base
            const sourceAsset = await Asset.findOne({ 
                assetName: transferData.assetName, 
                base: transferData.fromBase 
            });
            if (sourceAsset) {
                sourceAsset.quantity -= transferData.quantity;
                await sourceAsset.save();
            }

            // Update destination base
            let destAsset = await Asset.findOne({ 
                assetName: transferData.assetName, 
                base: transferData.toBase 
            });
            if (destAsset) {
                destAsset.quantity += transferData.quantity;
                await destAsset.save();
            } else {
                destAsset = new Asset({
                    assetName: transferData.assetName,
                    assetType: transferData.assetType,
                    base: transferData.toBase,
                    quantity: transferData.quantity
                });
                await destAsset.save();
            }
        }
        console.log(`Created ${transfers.length} transfers`);

        // Create assignments
        const assignments = [
            {
                assetName: 'M4 Rifle',
                assetType: 'Weapon',
                base: 'Alpha Base',
                assignedTo: 'Sergeant John Smith',
                quantity: 25,
                purpose: 'Training Exercise Alpha-1',
                assignedBy: createdUsers['commander_alpha']._id,
                assignmentDate: new Date('2026-03-17')
            },
            {
                assetName: 'M4 Rifle',
                assetType: 'Weapon',
                base: 'Bravo Base',
                assignedTo: 'Lieutenant Sarah Johnson',
                quantity: 20,
                purpose: 'Border Patrol Mission',
                assignedBy: createdUsers['commander_bravo']._id,
                assignmentDate: new Date('2026-03-18')
            },
            {
                assetName: 'Humvee',
                assetType: 'Vehicle',
                base: 'Alpha Base',
                assignedTo: 'Captain Mike Davis',
                quantity: 3,
                purpose: 'Reconnaissance Mission',
                assignedBy: createdUsers['commander_alpha']._id,
                assignmentDate: new Date('2026-03-19')
            },
            {
                assetName: 'M9 Pistol',
                assetType: 'Weapon',
                base: 'Alpha Base',
                assignedTo: 'Corporal James Wilson',
                quantity: 15,
                purpose: 'Security Detail',
                assignedBy: createdUsers['commander_alpha']._id,
                assignmentDate: new Date('2026-03-20')
            },
            {
                assetName: 'Night Vision Goggles',
                assetType: 'Weapon',
                base: 'Alpha Base',
                assignedTo: 'Special Forces Team Alpha',
                quantity: 12,
                purpose: 'Night Operations Training',
                assignedBy: createdUsers['admin']._id,
                assignmentDate: new Date('2026-03-21')
            },
            {
                assetName: 'Bradley Fighting Vehicle',
                assetType: 'Vehicle',
                base: 'Charlie Base',
                assignedTo: 'Armored Division Charlie',
                quantity: 2,
                purpose: 'Combat Readiness Exercise',
                assignedBy: createdUsers['commander_charlie']._id,
                assignmentDate: new Date('2026-03-22')
            }
        ];

        for (const assignmentData of assignments) {
            const assignment = new Assignment(assignmentData);
            await assignment.save();

            // Update asset quantity
            const asset = await Asset.findOne({ 
                assetName: assignmentData.assetName, 
                base: assignmentData.base 
            });
            if (asset) {
                asset.quantity -= assignmentData.quantity;
                await asset.save();
            }
        }
        console.log(`Created ${assignments.length} assignments`);

        // Create expenditures
        const expenditures = [
            {
                assetName: '5.56mm Ammunition',
                assetType: 'Ammunition',
                base: 'Alpha Base',
                quantity: 5000,
                reason: 'Live Fire Training Exercise',
                recordedBy: createdUsers['logistics_alpha']._id,
                expenditureDate: new Date('2026-03-23')
            },
            {
                assetName: '5.56mm Ammunition',
                assetType: 'Ammunition',
                base: 'Bravo Base',
                quantity: 3000,
                reason: 'Qualification Range',
                recordedBy: createdUsers['logistics_bravo']._id,
                expenditureDate: new Date('2026-03-24')
            },
            {
                assetName: '9mm Ammunition',
                assetType: 'Ammunition',
                base: 'Alpha Base',
                quantity: 2000,
                reason: 'Pistol Qualification',
                recordedBy: createdUsers['logistics_alpha']._id,
                expenditureDate: new Date('2026-03-25')
            },
            {
                assetName: 'M4 Rifle',
                assetType: 'Weapon',
                base: 'Alpha Base',
                quantity: 5,
                reason: 'Equipment Damage - Training Accident',
                recordedBy: createdUsers['commander_alpha']._id,
                expenditureDate: new Date('2026-03-25')
            },
            {
                assetName: '5.56mm Ammunition',
                assetType: 'Ammunition',
                base: 'Charlie Base',
                quantity: 2000,
                reason: 'Combat Simulation Exercise',
                recordedBy: createdUsers['admin']._id,
                expenditureDate: new Date('2026-03-26')
            }
        ];

        for (const expenditureData of expenditures) {
            const expenditure = new Expenditure(expenditureData);
            await expenditure.save();

            // Update asset quantity
            const asset = await Asset.findOne({ 
                assetName: expenditureData.assetName, 
                base: expenditureData.base 
            });
            if (asset) {
                asset.quantity -= expenditureData.quantity;
                await asset.save();
            }
        }
        console.log(`Created ${expenditures.length} expenditures`);

        // Display final asset counts
        console.log('\n=== FINAL ASSET INVENTORY ===');
        const allAssets = await Asset.find().sort({ base: 1, assetName: 1 });
        allAssets.forEach(asset => {
            console.log(`${asset.base} - ${asset.assetName}: ${asset.quantity} ${asset.assetType}`);
        });

        console.log('\n✅ All seed data created successfully!');
        console.log('\nDemo Credentials:');
        console.log('Admin: admin / admin123');
        console.log('Commander Alpha: commander_alpha / commander123');
        console.log('Commander Bravo: commander_bravo / commander123');
        console.log('Commander Charlie: commander_charlie / commander123');
        console.log('Logistics Alpha: logistics_alpha / logistics123');
        console.log('Logistics Bravo: logistics_bravo / logistics123');
        
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedAllData();
