import Component from "@glimmer/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import DiscourseURL from "discourse/lib/url";
import { inject as service } from "@ember/service";
import I18n from "I18n";

const STATUS_TO_QUERY_PARAM = {
  all: "",
  answered: "min_posts=2",
  unanswered: "max_posts=1",
};

export default class UnansweredFilter extends Component {
  @service router;
  @service currentUser;

  @tracked statuses = ["all", "answered", "unanswered"].map((status) => ({
    name: I18n.t(themePrefix(`topic_answered_filter.${status}`)),
    value: status,
  }));
  @tracked currentStatus =
    Object.keys(STATUS_TO_QUERY_PARAM).find(
      (key) =>
        STATUS_TO_QUERY_PARAM[key] &&
        window.location.search.includes(STATUS_TO_QUERY_PARAM[key])
    ) || "all";

  getFilteredParams(queryStrings) {
    const params = queryStrings.startsWith("?")
      ? queryStrings.substring(1).split("&")
      : [];
    return params.filter(
      (param) => !Object.values(STATUS_TO_QUERY_PARAM).includes(param)
    );
  }

  get isGroupMember() {
    const groupInclusions = settings.limit_to_groups
      .split("|")
      .map((id) => parseInt(id, 10));

    return (
      this.currentUser?.groups?.some((group) =>
        groupInclusions.includes(group.id)
      ) ||
      groupInclusions.includes(0) ||
      !settings.limit_to_groups
    );
  }

  get shouldRender() {
    return (
      this.router.currentRouteName !== "discovery.categories" &&
      !settings.exclusions.split("|").includes(this.router.currentURL) &&
      this.isGroupMember
    );
  }

  @action
  changeStatus(newStatus) {
    const { search, pathname, hash } = window.location;
    const params = this.getFilteredParams(search);

    if (newStatus && newStatus !== "all") {
      params.push(STATUS_TO_QUERY_PARAM[newStatus]);
    }

    const queryStrings = params.length ? `?${params.join("&")}` : "";
    DiscourseURL.routeTo(`${pathname}${queryStrings}${hash}`);

    this.currentStatus = newStatus;
  }
}
