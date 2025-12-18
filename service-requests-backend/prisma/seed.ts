// prisma/seed.ts
import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

const connectionString = process.env.DATABASE_URL as string;
const adapter = new PrismaBetterSqlite3({ url: connectionString });

// ВАЖНО: передаём options в конструктор
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🧹 Очистка базы...');

  await prisma.requestComment.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.equipmentModel.deleteMany();
  await prisma.equipmentType.deleteMany();
  await prisma.requestStatus.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();

  // ============ ROLES ============
  console.log('👤 Создание ролей...');
  const rolesData = [
    { name: 'Менеджер' },
    { name: 'Специалист' },
    { name: 'Оператор' },
    { name: 'Заказчик' },
  ];

  await prisma.role.createMany({ data: rolesData });
  const roles = await prisma.role.findMany();
  const roleByName = Object.fromEntries(roles.map((r) => [r.name, r.id]));

  // ============ USERS ============
  console.log('👥 Создание пользователей...');
  // соответствуют inputDataUsers.xlsx, но без паролей из файла
  const usersData = [
    {
      fio: 'Широков Василий Матвеевич',
      phone: '89210563128',
      login: 'login1',
      passwordHash: 'pass1', // тут можешь позже захэшировать
      type: 'Менеджер',
    },
    {
      fio: 'Кудрявцева Ева Ивановна',
      phone: '89535078985',
      login: 'login2',
      passwordHash: 'pass2',
      type: 'Специалист',
    },
    {
      fio: 'Гончарова Ульяна Ярославовна',
      phone: '89210673849',
      login: 'login3',
      passwordHash: 'pass3',
      type: 'Специалист',
    },
    {
      fio: 'Гусева Виктория Данииловна',
      phone: '89990563748',
      login: 'login4',
      passwordHash: 'pass4',
      type: 'Оператор',
    },
    {
      fio: 'Баранов Артём Юрьевич',
      phone: '89994563847',
      login: 'login5',
      passwordHash: 'pass5',
      type: 'Оператор',
    },
    {
      fio: 'Овчинников Фёдор Никитич',
      phone: '89219567849',
      login: 'login6',
      passwordHash: 'pass6',
      type: 'Заказчик',
    },
    {
      fio: 'Петров Никита Артёмович',
      phone: '89219567841',
      login: 'login7',
      passwordHash: 'pass7',
      type: 'Заказчик',
    },
    {
      fio: 'Ковалева Софья Владимировна',
      phone: '89219567842',
      login: 'login8',
      passwordHash: 'pass8',
      type: 'Заказчик',
    },
    {
      fio: 'Кузнецов Сергей Матвеевич',
      phone: '89219567843',
      login: 'login9',
      passwordHash: 'pass9',
      type: 'Заказчик',
    },
    {
      fio: 'Беспалова Екатерина Даниэльевна',
      phone: '89219567844',
      login: 'login10',
      passwordHash: 'pass10',
      type: 'Специалист',
    },
  ];

  for (const u of usersData) {
    await prisma.user.create({
      data: {
        fio: u.fio,
        phone: u.phone,
        login: u.login,
        passwordHash: u.passwordHash,
        roleId: roleByName[u.type],
      },
    });
  }

  const users = await prisma.user.findMany();
  const userByLogin = Object.fromEntries(users.map((u) => [u.login, u.id]));
  // сопоставим userID из Excel для удобства (1..10)
  const userByExcelId: Record<number, number> = {
    1: userByLogin['login1'],
    2: userByLogin['login2'],
    3: userByLogin['login3'],
    4: userByLogin['login4'],
    5: userByLogin['login5'],
    6: userByLogin['login6'],
    7: userByLogin['login7'],
    8: userByLogin['login8'],
    9: userByLogin['login9'],
    10: userByLogin['login10'],
  };

  // ============ STATUSES ============
  console.log('📌 Создание статусов заявок...');
  const statusesData = [
    { name: 'В процессе ремонта' },
    { name: 'Готова к выдаче' },
    { name: 'Новая заявка' },
  ];
  await prisma.requestStatus.createMany({ data: statusesData });
  const statuses = await prisma.requestStatus.findMany();
  const statusByName = Object.fromEntries(statuses.map((s) => [s.name, s.id]));

  // ============ EQUIPMENT TYPES & MODELS ============
  console.log('🧊 Создание типов и моделей климатической техники...');

  const equipmentTypesData = [
    'Кондиционер',
    'Увлажнитель воздуха',
    'Сушилка для рук',
  ];

  await prisma.equipmentType.createMany({
    data: equipmentTypesData.map((name) => ({ name })),
  });

  const equipmentTypes = await prisma.equipmentType.findMany();
  const typeByName = Object.fromEntries(
    equipmentTypes.map((t) => [t.name, t.id]),
  );

  const modelsData = [
    {
      type: 'Кондиционер',
      name: 'TCL TAC-12CHSA/TPG-W белый',
    },
    {
      type: 'Кондиционер',
      name: 'Electrolux EACS/I-09HAT/N3_21Y белый',
    },
    {
      type: 'Увлажнитель воздуха',
      name: 'Xiaomi Smart Humidifier 2',
    },
    {
      type: 'Увлажнитель воздуха',
      name: 'Polaris PUH 2300 WIFI IQ Home',
    },
    {
      type: 'Сушилка для рук',
      name: 'Ballu BAHD-1250',
    },
  ];

  for (const m of modelsData) {
    await prisma.equipmentModel.create({
      data: {
        name: m.name,
        equipmentTypeId: typeByName[m.type],
      },
    });
  }

  const models = await prisma.equipmentModel.findMany();
  const modelByName = Object.fromEntries(models.map((m) => [m.name, m.id]));

  // создадим Equipment (по одному на модель)
  const equipments: { modelName: string }[] = modelsData.map((m) => ({
    modelName: m.name,
  }));

  for (const e of equipments) {
    await prisma.equipment.create({
      data: {
        modelId: modelByName[e.modelName],
      },
    });
  }

  const allEquipments = await prisma.equipment.findMany({
    include: { model: { include: { equipmentType: true } } },
  });

  const equipmentByTypeAndModel = Object.fromEntries(
    allEquipments.map((e) => {
      const key = `${e.model.equipmentType.name}|${e.model.name}`;
      return [key, e.id];
    }),
  );

  function eqKey(type: string, model: string) {
    return `${type}|${model}`;
  }

  // ============ SERVICE REQUESTS ============
  console.log('📝 Создание заявок...');

  const requestsData = [
    {
      requestID: 1,
      startDate: '2023-06-06',
      climateTechType: 'Кондиционер',
      climateTechModel: 'TCL TAC-12CHSA/TPG-W белый',
      problemDescription: 'Не охлаждает воздух',
      requestStatus: 'В процессе ремонта',
      completionDate: null as string | null,
      repairParts: null as string | null,
      masterID: 2,
      clientID: 7,
    },
    {
      requestID: 2,
      startDate: '2023-05-05',
      climateTechType: 'Кондиционер',
      climateTechModel: 'Electrolux EACS/I-09HAT/N3_21Y белый',
      problemDescription: 'Выключается сам по себе',
      requestStatus: 'В процессе ремонта',
      completionDate: null,
      repairParts: null,
      masterID: 3,
      clientID: 8,
    },
    {
      requestID: 3,
      startDate: '2022-07-07',
      climateTechType: 'Увлажнитель воздуха',
      climateTechModel: 'Xiaomi Smart Humidifier 2',
      problemDescription: 'Пар имеет неприятный запах',
      requestStatus: 'Готова к выдаче',
      completionDate: '2023-01-01',
      repairParts: null,
      masterID: 3,
      clientID: 9,
    },
    {
      requestID: 4,
      startDate: '2023-08-02',
      climateTechType: 'Увлажнитель воздуха',
      climateTechModel: 'Polaris PUH 2300 WIFI IQ Home',
      problemDescription:
        'Увлажнитель воздуха продолжает работать при предельном снижении уровня воды',
      requestStatus: 'Новая заявка',
      completionDate: null,
      repairParts: null,
      masterID: null,
      clientID: 8,
    },
    {
      requestID: 5,
      startDate: '2023-08-02',
      climateTechType: 'Сушилка для рук',
      climateTechModel: 'Ballu BAHD-1250',
      problemDescription: 'Не работает',
      requestStatus: 'Новая заявка',
      completionDate: null,
      repairParts: null,
      masterID: null,
      clientID: 9,
    },
  ];

  for (const r of requestsData) {
    const statusId = statusByName[r.requestStatus];
    const clientId = userByExcelId[r.clientID];
    const masterId = r.masterID ? userByExcelId[r.masterID] : null;

    const equipmentId =
      equipmentByTypeAndModel[eqKey(r.climateTechType, r.climateTechModel)];

    await prisma.serviceRequest.create({
      data: {
        number: r.requestID,
        startDate: new Date(r.startDate),
        completionDate: r.completionDate ? new Date(r.completionDate) : null,
        problemDescription: r.problemDescription,
        statusId,
        equipmentId,
        clientId,
        masterId,
        repairParts: r.repairParts,
      },
    });
  }

  const createdRequests = await prisma.serviceRequest.findMany();
  const requestByNumber = Object.fromEntries(
    createdRequests.map((r) => [r.number, r.id]),
  );

  // ============ COMMENTS ============
  console.log('💬 Создание комментариев...');

  const commentsData = [
    {
      commentID: 1,
      message: 'Всё сделаем!',
      masterID: 2,
      requestID: 1,
    },
    {
      commentID: 2,
      message: 'Всё сделаем!',
      masterID: 3,
      requestID: 2,
    },
    {
      commentID: 3,
      message: 'Починим в момент.',
      masterID: 3,
      requestID: 3,
    },
  ];

  for (const c of commentsData) {
    await prisma.requestComment.create({
      data: {
        message: c.message,
        requestId: requestByNumber[c.requestID],
        authorId: userByExcelId[c.masterID],
      },
    });
  }

  // ============ SUMMARY ============
  const rolesCount = await prisma.role.count();
  const usersCount = await prisma.user.count();
  const typesCount = await prisma.equipmentType.count();
  const modelsCount = await prisma.equipmentModel.count();
  const equipCount = await prisma.equipment.count();
  const statusCount = await prisma.requestStatus.count();
  const reqCount = await prisma.serviceRequest.count();
  const commentsCount = await prisma.requestComment.count();

  console.log('✅ Seed completed successfully!');
  console.log(`   - Roles: ${rolesCount}`);
  console.log(`   - Users: ${usersCount}`);
  console.log(`   - Equipment types: ${typesCount}`);
  console.log(`   - Equipment models: ${modelsCount}`);
  console.log(`   - Equipments: ${equipCount}`);
  console.log(`   - Statuses: ${statusCount}`);
  console.log(`   - Service requests: ${reqCount}`);
  console.log(`   - Comments: ${commentsCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
