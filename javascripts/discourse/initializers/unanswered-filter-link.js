import { apiInitializer } from "discourse/lib/api";
import I18n from "discourse-i18n";
import { isTesting } from "discourse-common/config/environment";

export default apiInitializer("0.11.1", (api) => {
  if (settings.filter_mode === "dropdown" && !isTesting()) {
    return;
  }

  let exclusionList = settings.exclusions.split("|");
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
        exclusionList.indexOf(router.currentURL) < 0 &&
        (isGroupMember || !settings.limit_to_groups)
      );
    },
    customHref: function (category, args, router) {
      let routeName =
        args.filterType === "categories"
          ? "discovery.latest"
          : router.currentRouteName;

      let destinationParams = router.currentRoute.queryParams.max_posts
        ? ""
        : { max_posts: 1 };

      return router.urlFor(routeName, {
        queryParams: destinationParams,
      });
    },
    forceActive: (category, args) => {
      const queryParams = args.currentRouteQueryParams;

      return queryParams && queryParams["max_posts"] === "1";
    },
  });
});
