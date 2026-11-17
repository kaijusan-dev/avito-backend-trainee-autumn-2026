import prisma from "./prisma.js";

export const seedDatabase = async () => {
    const existing = await prisma.restaurant.count();

    if (existing > 0) {
        console.log(`Заполнение тестовыми данными пропущено, в БД уже ${existing} заведений`);
        return false;
    }

    const restaurant = await prisma.restaurant.create({
        data: {
            name: 'Пиццерия «Пермь»',
            address: 'г. Пермь, ул. Ленина, 58',
            isActive: true,
        },
    });

    console.log(`Заведение создано: ${restaurant.id}`);
    return true;
};