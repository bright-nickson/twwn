import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create programs
  const dataScience = await prisma.program.upsert({
    where: { slug: 'data-science-ai' },
    update: {},
    create: {
      slug: 'data-science-ai',
      title: 'Data Science & Analytics',
      description: 'Learn data analysis, machine learning, and data visualization with real-world projects.',
      status: 'ACTIVE'
    }
  })

  const cyber = await prisma.program.upsert({
    where: { slug: 'web-app-pentesting' },
    update: {},
    create: {
      slug: 'web-app-pentesting',
      title: 'Web Application Penetration Testing',
      description: 'Master ethical hacking, security testing, and vulnerability assessment.',
      status: 'ACTIVE'
    }
  })

  // Create cohorts for July 2025
  const existingDataScienceCohort = await prisma.cohort.findFirst({
    where: {
      programId: dataScience.id,
      startDate: new Date('2025-07-14T09:00:00Z')
    }
  })

  if (!existingDataScienceCohort) {
    await prisma.cohort.create({
      data: {
        programId: dataScience.id,
        name: 'Cohort 1 — July 2025',
        startDate: new Date('2025-07-14T09:00:00Z'),
        endDate: new Date('2025-09-08T17:00:00Z'),
        maxSeats: 20,
        status: 'OPEN'
      }
    })
  }

  const existingCyberCohort = await prisma.cohort.findFirst({
    where: {
      programId: cyber.id,
      startDate: new Date('2025-07-14T09:00:00Z')
    }
  })

  if (!existingCyberCohort) {
    await prisma.cohort.create({
      data: {
        programId: cyber.id,
        name: 'Cohort 1 — July 2025',
        startDate: new Date('2025-07-14T09:00:00Z'),
        endDate: new Date('2025-09-08T17:00:00Z'),
        maxSeats: 15,
        status: 'OPEN'
      }
    })
  }

  console.log('✅ Database seeded with programs and cohorts!')
  console.log(`📚 Data Science: ${dataScience.title}`)
  console.log(`🔒 Cybersecurity: ${cyber.title}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
