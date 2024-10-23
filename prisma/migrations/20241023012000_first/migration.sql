-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "bugbounty";

-- CreateTable
CREATE TABLE "bugbounty"."Platform" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "hunterUsername" TEXT,
    "otp" TEXT,
    "jwt" TEXT,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bugbounty"."Program" (
    "id" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "vdp" BOOLEAN NOT NULL,
    "favourite" BOOLEAN NOT NULL DEFAULT false,
    "tag" TEXT,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "bountyMin" INTEGER,
    "bountyMax" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bugbounty"."Scope" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "scopeType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Scope_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bugbounty"."Report" (
    "id" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "reportId" TEXT NOT NULL,
    "bounty" DOUBLE PRECISION,
    "currency" TEXT,
    "collab" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL,
    "cvssVector" TEXT,
    "cvss" DOUBLE PRECISION,
    "createdDate" TIMESTAMP(3) NOT NULL,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Platform_slug_key" ON "bugbounty"."Platform"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Program_slug_key" ON "bugbounty"."Program"("slug");

-- AddForeignKey
ALTER TABLE "bugbounty"."Program" ADD CONSTRAINT "Program_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "bugbounty"."Platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bugbounty"."Scope" ADD CONSTRAINT "Scope_programId_fkey" FOREIGN KEY ("programId") REFERENCES "bugbounty"."Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bugbounty"."Report" ADD CONSTRAINT "Report_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "bugbounty"."Platform"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bugbounty"."Report" ADD CONSTRAINT "Report_programId_fkey" FOREIGN KEY ("programId") REFERENCES "bugbounty"."Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;
