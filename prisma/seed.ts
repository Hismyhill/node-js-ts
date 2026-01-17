import { faker } from "@faker-js/faker";
import prisma from "../src/prisma-client";

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const userIds = ["google-oauth2|111184987870194131737"];

async function main() {
  for (const userId of userIds) {
    const createdProject = await prisma.project.create({
      data: {
        user_id: userId,
        name:
          capitalize(faker.hacker.adjective()) +
          " " +
          capitalize(faker.hacker.noun()),
      },
    });

    for (let i = 0; i <= 2; i++) {
      const createdTask = await prisma.task.create({
        data: {
          user_id: userId,
          project_id: i % 2 === 0 ? createdProject.id : null,
          name: capitalize(faker.hacker.verb()) + " " + faker.hacker.noun(),
          description: faker.lorem.sentence(),
          due_date: faker.date.future(),
        },
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
