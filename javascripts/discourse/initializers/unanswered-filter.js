import { apiInitializer } from "discourse/lib/api";
import { AUTO_GROUPS } from "discourse/lib/constants";
import { i18n } from "discourse-i18n";
import UnansweredFilterDropdown from "../components/unanswered-filter-dropdown";

export default apiInitializer((api) => {
  if (settings.filter_mode === "dropdown") {
    api.renderInOutlet("bread-crumbs-right", UnansweredFilterDropdown);
    return;
  }

  const exclusionList = settings.exclusions.split("|");

  // NOTE: The default for this setting was changed to "4|5" in the theme settings,
  // since that is what now represents all anon + logged in users, so this fallback is
  // for backwards compatibility.
  const noLimitToGroups =
    !settings.limit_to_groups || settings.limit_to_groups === "4|5";

  let isGroupMember = false;
  if (Object.hasOwn(settings, "user_in_limit_to_groups")) {
    isGroupMember = settings.user_in_limit_to_groups;
  } else {
    const currentUser = api.getCurrentUser();
    const groupInclusions = settings.limit_to_groups
      .split("|")
      .map((id) => parseInt(id, 10));
    // TODO (martin) Remove this fallback after resolve_group_membership
    // from core is available everywhere
    isGroupMember =
      currentUser?.groups?.some((group) =>
        groupInclusions.includes(group.id)
      ) || groupInclusions.includes(AUTO_GROUPS.everyone.id);
  }

  api.addNavigationBarItem({
    name: "unanswered",
    displayName: i18n(themePrefix("unanswered.title")),
    title: i18n(themePrefix("unanswered.help")),

    customFilter: (category, args, router) => {
      return (
        !exclusionList.includes(router.currentURL) &&
        (isGroupMember || noLimitToGroups)
      );
    },

    customHref: function (category, args, router) {
      if (category) {
        if (router.currentRoute.queryParams.max_posts) {
          return category.url;
        } else {
          return `${category.url}?max_posts=1`;
        }
      } else {
        const routeName =
          args.filterType === "categories"
            ? "discovery.latest"
            : router.currentRouteName;
        const queryParams = router.currentRoute.queryParams.max_posts
          ? {}
          : { max_posts: 1 };

        return router.urlFor(routeName, { queryParams });
      }
    },

    forceActive: (category, args) => {
      return args.currentRouteQueryParams?.max_posts === "1";
    },
  });
});
