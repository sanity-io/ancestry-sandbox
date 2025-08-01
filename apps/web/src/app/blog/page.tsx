import { notFound } from "next/navigation";

import { BlogCard, BlogHeader, FeaturedBlogCard } from "@/components/blog-card";
import { PageBuilder } from "@/components/pagebuilder";
import { sanityFetch } from "@/lib/sanity/live";
import { queryBlogIndexPageData } from "@/lib/sanity/query";
import { getMetaData } from "@/lib/seo";
import { handleErrors } from "@/utils";

async function fetchBlogPosts() {
  return await handleErrors(sanityFetch({ query: queryBlogIndexPageData }));
}

export async function generateMetadata() {
  const result = await sanityFetch({ query: queryBlogIndexPageData });
  return await getMetaData(result?.data ?? {});
}

export default async function BlogIndexPage() {
  const [res, err] = await fetchBlogPosts();
  if (err || !res?.data) notFound();

  const {
    blogs = [],
    featuredBlogs = [],
    title,
    description,
    pageBuilder = [],
    _id,
    _type,
    displayFeaturedBlogs,
    featuredBlogsCount,
  } = res.data;

  const validFeaturedBlogsCount = featuredBlogsCount
    ? Number.parseInt(featuredBlogsCount)
    : 0;

  const shouldDisplayFeaturedBlogs =
    displayFeaturedBlogs && validFeaturedBlogsCount > 0;

  // Use the new featuredBlogs array, limited by count
  const featured = shouldDisplayFeaturedBlogs
    ? featuredBlogs.slice(0, validFeaturedBlogsCount)
    : [];
  // Exclude featured blogs from the main list
  const featuredIds = new Set(featured.map((b: any) => b._id));
  const remainingBlogs = blogs.filter((b: any) => !featuredIds.has(b._id));

  // Add mapping of category values to display titles
  const BLOG_CATEGORIES = [
    { value: 'entertainment-culture', title: 'Entertainment & Culture' },
    { value: 'family-history', title: 'Family History' },
    { value: 'history', title: 'History' },
    { value: 'dna', title: 'DNA' },
    { value: 'customer-stories', title: 'Customer Stories' },
    { value: 'names', title: 'Names' },
    { value: 'holidays', title: 'Holidays' },
    { value: 'ancestry-news', title: 'Ancestry News' },
  ];

  // Group blogs by category (strict value match)
  const blogsByCategory: Record<string, any[]> = {};
  (remainingBlogs || []).forEach((blog: any) => {
    if (!blog.category) return;
    if (!blogsByCategory[blog.category]) blogsByCategory[blog.category] = [];
    blogsByCategory[blog.category]?.push(blog);
  });

  return (
    <main className="bg-background">
      <div className="container my-16 mx-auto px-4 md:px-6">
        <BlogHeader title={title} description={description} />
        {/* Featured blogs section remains unchanged */}
        {featured.length > 0 && (
          <div className="mx-auto mt-8 sm:mt-12 md:mt-16 mb-12 lg:mb-20 grid grid-cols-1 gap-8 md:gap-12">
            {featured.map((blog: any) => (
              <FeaturedBlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
        {/* Grouped blogs by raw category with carousel */}
        {Object.entries(blogsByCategory).map(([category, blogsInCategory]) => {
          if (!blogsInCategory.length) return null;
          return (
            <section key={category} className="mb-16">
              <h2 className="text-2xl font-bold mb-4">{category}</h2>
              <div className="overflow-x-auto">
                <div className="flex gap-6" style={{ minWidth: 0 }}>
                  {blogsInCategory.map((blog: any) => (
                    <div
                      key={blog._id}
                      className="min-w-[320px] max-w-[400px] flex-shrink-0"
                      style={{ width: '33.333%' }}
                    >
                      <BlogCard blog={blog} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
      {pageBuilder && pageBuilder.length > 0 && (
        <PageBuilder pageBuilder={pageBuilder} id={_id} type={_type} />
      )}
    </main>
  );
}
