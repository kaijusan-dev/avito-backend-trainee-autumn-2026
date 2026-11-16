import prisma from "./prisma.js";

export const seedDatabase = async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.restaurant.deleteMany();

    const restaurant = await prisma.restaurant.create({
        data: {
            name: 'Пиццерия «Пермь»',
            address: 'г. Пермь, ул. Ленина, 58',
            isActive: true,
        },
    });

    console.log(`Заполнение тестовыми данными выполнено. Заведение: ${restaurant.id}`);

    await prisma.$disconnect();
};