-- CreateTable
CREATE TABLE "AiUsage" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "usageDate" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiUsage_clerkUserId_idx" ON "AiUsage"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "AiUsage_clerkUserId_usageDate_key" ON "AiUsage"("clerkUserId", "usageDate");

-- CreateIndex
CREATE INDEX "Education_resumeId_idx" ON "Education"("resumeId");

-- CreateIndex
CREATE INDEX "Experience_resumeId_idx" ON "Experience"("resumeId");

-- CreateIndex
CREATE INDEX "Resume_clerkUserId_idx" ON "Resume"("clerkUserId");

-- CreateIndex
CREATE INDEX "Skill_resumeId_idx" ON "Skill"("resumeId");
