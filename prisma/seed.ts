import { faker } from "@faker-js/faker";
import prisma from "../src/prisma-client";

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const userIds = [
  "21d6f8e2-3c4a-4b5a-9f1e-2d3c4b5a6f7g",
  "32e7f9d3-4d5b-5c6b-0g2f-3e4d5c6b7g8h",
  "43f8g0e4-5e6c-6d7c-1h3g-4f5e6d7c8h9i",
];

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
