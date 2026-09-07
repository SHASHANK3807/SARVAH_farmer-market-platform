// app/[locale]/farmer/lots/new/page.tsx
import { LotForm } from "@/components/lot/LotForm";

export default async function NewLotPage({
  searchParams,
}: {
  searchParams: Promise<{ crop?: string; district?: string }> | { crop?: string; district?: string };
}) {
  const resolved = await Promise.resolve(searchParams);

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <LotForm defaultCrop={resolved?.crop} defaultDistrict={resolved?.district} />
    </div>
  );
}
