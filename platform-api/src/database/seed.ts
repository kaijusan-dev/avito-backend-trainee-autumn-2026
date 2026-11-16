import prisma from "./prisma.js";

export const seedDatabase = async () => {
    const existing = await prisma.restaurant.count();

    if (existing > 0) {
        console.log(`Заполнение тестовыми данными пропущено, в БД уже ${existing} заведений`);
        return;
    }

    await prisma.restaurant.createMany({
        data: [
            {
                name: 'Пиццерия «Пермь»',
                address: 'г. Пермь, ул. Ленина, 58',
                isActive: true,
            },
            {
                name: 'Суши-бар «Токио»',
                address: 'г. Пермь, Комсомольский проспект, 32',
                isActive: true,
            },
            {
                name: 'Бургерная «Meat Point»',
                address: 'г. Пермь, ул. Мира, 45',
                isActive: true,
            },
            {
                name: 'Кофейня «Black Brew»',
                address: 'г. Пермь, ул. Сибирская, 15',
                isActive: true,
            },
            {
                name: 'Столовая «Домашняя»',
                address: 'г. Пермь, ул. Гагарина, 70',
                isActive: true,
            },
            {
                name: 'Шаурма «У Ашота»',
                address: 'г. Пермь, ул. Куйбышева, 22',
                isActive: true,
            },
            {
                name: 'Пельменная «Уральская»',
                address: 'г. Пермь, ул. Пушкина, 100',
                isActive: false, // закрыто
            },
        ],
    });

    const created = await prisma.restaurant.findMany({
        select: { id: true, name: true, isActive: true },
        orderBy: { name: 'asc' },
    });

    console.log(`Создано заведений: ${created.length}`);
    for (const r of created) {
        console.log(`  ${r.isActive ? '+' : '-'} ${r.name}  (${r.id})`);
    }
};