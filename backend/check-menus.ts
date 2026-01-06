import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMenus() {
    try {
        console.log('Checking menus in database...');
        const menus = await prisma.menu.findMany();
        console.log(`Found ${menus.length} menus:`);
        menus.forEach((menu, index) => {
            console.log(`\n${index + 1}. ${menu.name}`);
            console.log(`   ID: ${menu.id}`);
            console.log(`   Service Type: ${menu.serviceType}`);
            console.log(`   Price: ${menu.fixedPrice}`);
            console.log(`   Description: ${menu.description}`);
            console.log(`   Image: ${menu.image}`);
        });

        if (menus.length === 0) {
            console.log('\n⚠️  No menus found in database!');
            console.log('This explains why menus are not showing in the frontend.');
        }
    } catch (error) {
        console.error('Error checking menus:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkMenus();
