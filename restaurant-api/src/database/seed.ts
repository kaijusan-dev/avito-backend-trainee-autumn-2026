import prisma from "./prisma.js";

export const seedDatabase = async () => {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.restaurant.deleteMany();

    const restaurant = await prisma.restaurant.create({
        data: {
            name: 'Пиццерия «Пермь»',
            address: 'г. Пермь, ул. Ленина, 58',
        },
    });

    const pizza = await prisma.category.create({
        data: { name: 'Пицца', restaurantId: restaurant.id },
    });
    const drinks = await prisma.category.create({
        data: { name: 'Напитки', restaurantId: restaurant.id },
    });

    await prisma.product.createMany({
        data: [
            { categoryId: pizza.id, name: 'Маргарита', description: 'Томаты, моцарелла, базилик', price: 45000 },
            { categoryId: pizza.id, name: 'Пепперони', description: 'Пепперони, моцарелла', price: 55000 },
            { categoryId: pizza.id, name: '4 сыра', description: 'Моцарелла, пармезан, дор-блю, чеддер', price: 59000 },
            { categoryId: drinks.id, name: 'Кола 0.5', price: 15000 },
            { categoryId: drinks.id, name: 'Морс клюквенный', price: 18000 },
        ],
    });

    console.log('Заполнение тестовыми данными выполнено');
    await prisma.$disconnect();
};