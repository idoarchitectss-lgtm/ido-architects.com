import Header from "@/components/custom/header/header";
import Footer from "@/components/custom/footer/footer";
import ContactFormIcon from "@/components/custom/ContactFormIcon";
import { allBlogsFromCMS } from "@/data/datafromCMS";
import { Suspense } from "react";
import Loading from "@/app/loading";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const res = await allBlogsFromCMS(100, 1).catch(() => ({ edges: [] as any[], pageInfo: {} as any }));
  const posts = res.edges.map((edge) => edge.node);

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Header
          logo={"/image/logo.webp"}
          posts={posts}
        />
      </Suspense>
      {children}
      <ContactFormIcon />
      <Footer />
    </>
  );
}
