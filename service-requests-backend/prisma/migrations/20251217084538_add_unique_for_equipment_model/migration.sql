/*
  Warnings:

  - A unique constraint covering the columns `[name,equipmentTypeId]` on the table `EquipmentModel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "EquipmentModel_name_equipmentTypeId_key" ON "EquipmentModel"("name", "equipmentTypeId");
