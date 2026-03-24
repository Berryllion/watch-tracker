"use server";

export async function createPost(formData: FormData) {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const email = formData.get("email");
  const password = formData.get("password");

  // Mutate data
  // Revalidate cache
}
