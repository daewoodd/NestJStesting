-- CreateTable
CREATE TABLE "Task" (
    "tid" SERIAL NOT NULL,
    "detail" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "creationTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completionTime" TIMESTAMP(3),
    "uid" INTEGER,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("tid")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
