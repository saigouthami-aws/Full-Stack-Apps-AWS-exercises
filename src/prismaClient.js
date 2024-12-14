import { PrismaClient } from '@prisma/client'
//import { capturePrisma } from '@cosva-lab/aws-xray-sdk-prisma';

const prisma = new PrismaClient()
//const client = capturePrisma(prisma, { namespace: 'remote'})
export default prisma