import Component from "@ember/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import DiscourseURL from "discourse/lib/url";
import { inject as service } from "@ember/service";
import I18n from "I18n";

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
          : false,
      ) || "all";
  }

  getFilteredParams(queryStrings) {
    let params = queryStrings.startsWith("?")
      ? queryStrings.substring(1).split("&")
      : [];
    return params.filter(
      (param) => !Object.values(this.statusToQueryParam).includes(param),
    );
  }

  get shouldRender() {
    let exclusions = settings.exclusions.split("|");
    if (this.router.currentRouteName !== "discovery.categories") {
      return !exclusions.includes(this.router.currentURL);
    }
  }

  get staffOnly() {
    const notStaff =
      (!this.currentUser || (this.currentUser && !this.currentUser.staff)) &&
      settings.show_only_for_staff;
    return notStaff;
  }

  @action
  changeStatus(newStatus) {
    const { search, pathname, hash } = window.location;
    let params = this.getFilteredParams(search);
    newStatus &&
      newStatus !== "all" &&
      params.push(this.statusToQueryParam[newStatus]);
    const queryStrings = params.length ? `?${params.join("&")}` : "";

    DiscourseURL.routeTo(`${pathname}${queryStrings}${hash}`);

    this.currentStatus = newStatus;
  }
}
