const faker = require('faker');
const fs = require('fs');

let database = { people: [] };
faker.locale = 'pl';
faker.seed(5542742864); // żeby zawsze zwracał te same rezultaty

let Gender = {
    Pani: 0,
    Pan: 1
}

for (let i = 1; i <= 100; i++) {
    // w api fakera 0 male, 1 female
    // w appce odwrotnie
    const tmpGender = faker.random.number({
        min: 0,
        max: 1
    });
    const tmpFname = faker.name.firstName(!tmpGender);
    const tmpLname = faker.name.lastName();
    const tmpGotStarter = faker.random.boolean()
    database.people.push({
        id: i,
        name: tmpFname + " " + tmpLname,
        gender: tmpGender,
        email: faker.internet.email(tmpFname, tmpLname),
        phone: faker.phone.phoneNumber(),
        officesNo: faker.random.number(5),
        sonicareUser: faker.random.boolean(),
        sonicareRecom: faker.random.boolean(),
        wantCodes: faker.random.boolean(),
        gotStarter: tmpGotStarter,
        starterNo: tmpGotStarter ? faker.random.number({ min: 10000, max: 99999 }).toString() : null,
        gotExpositor: faker.random.boolean(),
        agreeReg: true,
        agreeMark1: faker.random.boolean(),
        agreeMark2: faker.random.boolean(),
        agreeMark3: faker.random.boolean(),
        agreeMark4: faker.random.boolean(),
        serverLastEditedDate: faker.date.recent(5).getTime()
    });
}

//console.log(JSON.stringify(database, null, 4));
fs.writeFileSync('db.json', JSON.stringify(database, null, 4));
console.log('db.json generated');