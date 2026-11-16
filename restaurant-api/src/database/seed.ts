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
        },
    });

    const [pizza, salads, drinks, desserts] = await Promise.all([
        prisma.category.create({ data: { name: 'Пицца', restaurantId: restaurant.id } }),
        prisma.category.create({ data: { name: 'Салаты', restaurantId: restaurant.id } }),
        prisma.category.create({ data: { name: 'Напитки', restaurantId: restaurant.id } }),
        prisma.category.create({ data: { name: 'Десерты', restaurantId: restaurant.id } }),
    ]);

    await prisma.product.createMany({
        data: [
            // пицца
            { categoryId: pizza.id, name: 'Маргарита', description: 'Томаты, моцарелла, базилик', price: 45000 },
            { categoryId: pizza.id, name: 'Пепперони', description: 'Пепперони, моцарелла', price: 55000 },
            { categoryId: pizza.id, name: '4 сыра', description: 'Моцарелла, пармезан, дор-блю, чеддер', price: 59000 },
            { categoryId: pizza.id, name: 'Гавайская', description: 'Курица, ананас, моцарелла', price: 59000 },
            { categoryId: pizza.id, name: 'Мясная', description: 'Бекон, пепперони, ветчина, говядина', price: 65000 },
            { categoryId: pizza.id, name: 'Вегетарианская', description: 'Перец, грибы, оливки, томаты', price: 52000 },

            // салаты
            { categoryId: salads.id, name: 'Цезарь с курицей', description: 'Романо, курица, пармезан, сухарики', price: 32000 },
            { categoryId: salads.id, name: 'Греческий', description: 'Фета, оливки, огурцы, томаты', price: 29000 },
            { categoryId: salads.id, name: 'Оливье', description: 'Классический с колбасой', price: 25000 },

            // напитки
            { categoryId: drinks.id, name: 'Кола 0.5', price: 15000 },
            { categoryId: drinks.id, name: 'Морс клюквенный', price: 18000 },
            { categoryId: drinks.id, name: 'Сок апельсиновый', price: 20000 },
            { categoryId: drinks.id, name: 'Вода 0.5', price: 10000 },
            { categoryId: drinks.id, name: 'Кофе американо', price: 12000 },

            // десерты
            { categoryId: desserts.id, name: 'Тирамису', price: 28000 },
            { categoryId: desserts.id, name: 'Чизкейк', price: 26000 },
            { categoryId: desserts.id, name: 'Панна котта', price: 24000 },
        ],
    });

    // один товар недоступен для проверки статуса 409 CONFLICT
    await prisma.product.update({
        where: {
            categoryId_name: { categoryId: pizza.id, name: 'Гавайская' },
        },
        data: { isAvailable: false },
    });

    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();

    console.log(`Заведение создано: ${restaurant.id}`);
    console.log(`Категорий: ${categoryCount}, товаров: ${productCount} (1 недоступен)`);

    return true;
};
