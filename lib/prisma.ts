import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
	prismaClient: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
	const databaseAdapter = new PrismaPg({
		connectionString: process.env.DATABASE_URL!,
	});
	return new PrismaClient({ adapter: databaseAdapter });
}

export const prismaClient =
	globalForPrisma.prismaClient ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prismaClient = prismaClient;
}
