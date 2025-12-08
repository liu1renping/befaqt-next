import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AddProductForm from "@/components/AddProductForm";

export default async function AddProductPage() {
  const session = await getSession();

  if (!session) {
    redirect("/user/login");
  }

  return <AddProductForm />;
}
