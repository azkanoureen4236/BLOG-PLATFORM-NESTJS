-- CreateTable
CREATE TABLE "public"."Bookmark" (
    "id" SERIAL NOT NULL,
    "blogId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_blogId_userId_key" ON "public"."Bookmark"("blogId", "userId");

-- AddForeignKey
ALTER TABLE "public"."Bookmark" ADD CONSTRAINT "Bookmark_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "public"."Blog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
