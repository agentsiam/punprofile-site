import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },

  /**
   * The assessment moved from `/assess` to `/efc-assessment` on 16/08/2026, when
   * EU Fit Check was positioned as a sub-brand and the URL was made to say so.
   *
   * **These redirects are not optional and must not be removed.** Every daily
   * job post ever published to the Facebook group carries
   * `punprofile.vercel.app/assess?src=fb&job=<id>`, and the pinned post and the
   * LINE account carry `?src=pinned` and `?src=line`. Those links are in other
   * people's feeds and cannot be edited. `00_Quick_Facts.md` in the sibling repo
   * owns the current URL and has been updated; this is what keeps the old ones
   * working.
   *
   * Permanent, so search engines move their index rather than keeping two URLs
   * for one page. Query strings are preserved by Next automatically, which is
   * the whole point: the attribution parameters have to survive the hop or the
   * redirect silently destroys the channel data it was added to protect.
   */
  async redirects() {
    /*
     * The site moved to its own domain, `punprofile.app`, on 07/09/2026, and
     * `punprofile.vercel.app` stayed behind holding every link ever published:
     * the Facebook daily job posts, the pinned post, the LINE account, and
     * whatever Google had indexed by then. A landing page saying "we moved"
     * would ask each of those visitors to click a second time, and would leave
     * two copies of every page competing in the index. A permanent redirect
     * moves the person and the ranking in one hop, so that is what this is.
     *
     * It stays off until `REDIRECT_TO` is set, and it is set on the old
     * project only. The new project never carries it, so it can never redirect
     * to itself. One environment variable is the whole switch, and unsetting
     * it is the whole rollback, which matters because a 308 is cached hard by
     * browsers and cannot be un-sent.
     *
     * Placed after the `/assess` rules deliberately. Next evaluates in order,
     * so an old Facebook link hops `/assess` to `/efc-assessment` first and
     * then to the new domain, arriving at the right page with `?src=fb&job=`
     * intact rather than at a dead path on a live one.
     */
    const movedTo = process.env.REDIRECT_TO;

    return [
      { source: "/assess", destination: "/efc-assessment", permanent: true },
      { source: "/en/assess", destination: "/en/efc-assessment", permanent: true },
      ...(movedTo
        ? [
            {
              source: "/:path*",
              destination: `${movedTo}/:path*`,
              permanent: true,
            },
          ]
        : []),
      /*
       * The `/services` redirect was removed on 06/09/2026, because the route
       * came back. What it said is worth keeping:
       *
       *   `/services` folded into `/coaching` on 23/08/2026. Same rule as above
       *   and the same reason: the route was in the sitemap from 16/08/2026 and
       *   in the footer of every page, so the link exists in other people's
       *   hands. `?focus=` is preserved by Next along with every other query
       *   string, which is what keeps the result screen's link pointing at the
       *   right card.
       *
       * **It was `permanent: true`, which is a 308, and browsers cache those
       * hard.** Anyone who opened `/services` between 23/08 and today has the
       * hop stored and will keep landing on `/coaching` until that entry
       * expires or they clear it. There is no way to un-send a 308 from here.
       * The page is reachable from the menu and from `/products` for everyone
       * else, and a candidate who followed a stale link lands on the coaching
       * pitch, which is a reasonable place to be rather than an error.
       *
       * `?focus=` still works and still points at the cards, which now render
       * on both pages: `ServiceCards` owns that mapping and is imported by each.
       */
    ];
  },
};

// TASK-007. Source-map upload only runs when SENTRY_AUTH_TOKEN is present
// (a build-time secret, per README); without it the build stays green and
// stack traces are simply unminified later.
export default withSentryConfig(nextConfig, {
  org: "punprofile",
  project: "javascript-nextjs",
  silent: true,
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
});
