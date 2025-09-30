-- CreateTable
CREATE TABLE "public"."Like" (
    "id" SERIAL NOT NULL,
    "blogId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_blogId_userId_key" ON "public"."Like"("blogId", "userId");

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "public"."Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
