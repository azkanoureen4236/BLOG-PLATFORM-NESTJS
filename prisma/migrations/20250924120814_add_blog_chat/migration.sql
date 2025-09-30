-- CreateTable
CREATE TABLE "public"."BlogChat" (
    "id" SERIAL NOT NULL,
    "blogId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BlogMessage" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "chatId" INTEGER NOT NULL,
    "senderId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogChat_blogId_key" ON "public"."BlogChat"("blogId");

-- AddForeignKey
ALTER TABLE "public"."BlogChat" ADD CONSTRAINT "BlogChat_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "public"."Blog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogMessage" ADD CONSTRAINT "BlogMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."BlogChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BlogMessage" ADD CONSTRAINT "BlogMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
