import Component from "@ember/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import DiscourseURL from "discourse/lib/url";
import { inject as service } from "@ember/service";
import { tagName } from "@ember-decorators/component";

import I18n from "I18n";

@tagName("")
export default class UnansweredFilter extends Component {
  @service router;
  @service currentUser;

  @tracked currentStatus = null;
  @tracked statuses = ["all", "answered", "unanswered"].map((status) => ({
    name: I18n.t(themePrefix(`topic_answered_filter.${status}`)),
    value: status,
  }));

  statusToQueryParam = {
    all: "",
    answered: "min_posts=2",
    unanswered: "max_posts=1",
  };

  constructor() {
    super(...arguments);
    this.updateStatusFromQuery(window.location.search);
  }

  updateStatusFromQuery(queryStrings) {
    this.currentStatus =
      Object.keys(this.statusToQueryParam).find((key) =>
        this.statusToQueryParam[key]
          ? queryStrings.includes(this.statusToQueryParam[key])
          : false
      ) || "all";
  }

  getFilteredParams(queryStrings) {
    const params = queryStrings.startsWith("?")
      ? queryStrings.substring(1).split("&")
      : [];
    return params.filter(
      (param) => !Object.values(this.statusToQueryParam).includes(param)
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
      params.push(this.statusToQueryParam[newStatus]);
    }

    const queryStrings = params.length ? `?${params.join("&")}` : "";
    DiscourseURL.routeTo(`${pathname}${queryStrings}${hash}`);

    this.currentStatus = newStatus;
  }
}
