import Header from "@/components/custom/header/header";
import Footer from "@/components/custom/footer/footer";
import ContactFormIcon from "@/components/custom/ContactFormIcon";
import { getAllPosts } from "@/lib/api";
import { PostsDataProps } from "@/types/typeForWordpressData";
import { Suspense } from "react";
import Loading from "@/app/loading";

type Edges = PostsDataProps["posts"];

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const res: Edges = await getAllPosts(100, 1).catch(() => ({ edges: [] }));
  const posts = res.edges.map((edge) => edge.node);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Header
          logo={"https://ido-architects.io/wp-content/uploads/2024/12/logo.jpg"}
          posts={posts}
        />
      </Suspense>
      {children}
      <ContactFormIcon />
      <Footer />
    </>
  );
}
