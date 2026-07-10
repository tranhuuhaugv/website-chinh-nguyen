import { BlogAdminTable } from "@/components/admin/BlogAdminTable";
import { getBlogPosts } from "@/lib/data";

export const metadata = { title: "Blog" };
export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const posts = await getBlogPosts();
  return <BlogAdminTable posts={posts} />;
}
