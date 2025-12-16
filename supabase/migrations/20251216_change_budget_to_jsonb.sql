-- 1. Remove the old default value
ALTER TABLE "projects" ALTER COLUMN "budget" DROP DEFAULT;

-- 2. Convert the column to JSON
ALTER TABLE "projects" ALTER COLUMN "budget" TYPE JSONB USING to_jsonb("budget");

-- 3. Set the new JSON default
ALTER TABLE "projects" ALTER COLUMN "budget" SET DEFAULT '0'::jsonb;
