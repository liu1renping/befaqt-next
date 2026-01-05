import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/user/manage/",
          "/category/manage/",
          "/product/manage/",
          "/user/dashboard/",
          "/user/profile/",
          "/cart/",
          "/user/signin/",
          "/user/signup/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
