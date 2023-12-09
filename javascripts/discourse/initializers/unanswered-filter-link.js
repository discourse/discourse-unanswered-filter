import { apiInitializer } from "discourse/lib/api";
import I18n from "discourse-i18n";

export default apiInitializer("0.11.1", (api) => {
  if (settings.filter_mode === "dropdown") {
    return;
  }

  const exclusionList = settings.exclusions.split("|");
  const currentUser = api.getCurrentUser();
  const groupInclusions = settings.limit_to_groups
    .split("|")
    .map((id) => parseInt(id, 10));

  const isGroupMember =
    currentUser?.groups?.some((group) => groupInclusions.includes(group.id)) ||
    groupInclusions.includes(0);

  api.addNavigationBarItem({
    name: "unanswered",
    displayName: I18n.t(themePrefix("unanswered.title")),
    title: I18n.t(themePrefix("unanswered.help")),

    customFilter: (category, args, router) => {
      return (
        !exclusionList.includes(router.currentURL) &&
        (isGroupMember || !settings.limit_to_groups)
      );
    },

    customHref: function (category, args, router) {
      const routeName =
        args.filterType === "categories"
          ? "discovery.latest"
          : router.currentRouteName;

      const queryParams = router.currentRoute.queryParams.max_posts
        ? {}
        : { queryParams: { max_posts: 1 } };

      return router.urlFor(routeName, queryParams);
    },

    forceActive: (category, args) => {
      return args.currentRouteQueryParams?.["max_posts"] === "1";
    },
  });
});
