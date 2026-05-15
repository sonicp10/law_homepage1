import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const prismaClientSingleton = () => {
  // Connection Pool 설정 최적화
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 2, // Vercel 서버리스 환경이므로 각 인스턴스당 연결을 최소화 (기본값은 10)
    idleTimeoutMillis: 30000, // 유휴 연결은 30초 후 종료
    connectionTimeoutMillis: 2000, // 연결 시도 타임아웃 2초
  })
  
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export default prisma

