import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import I18n from "I18n";
import ComboBox from "select-kit/components/combo-box";

const STATUS_TO_QUERY_PARAMS = {
  answered: { min_posts: "2", max_posts: undefined },
  unanswered: { max_posts: "1", min_posts: undefined },
  all: { max_posts: undefined, min_posts: undefined },
};

export default class UnansweredFilter extends Component {
  @service router;
  @service currentUser;

  @tracked statuses = ["all", "answered", "unanswered"].map((status) => ({
    name: I18n.t(themePrefix(`topic_answered_filter.${status}`)),
    value: status,
  }));

  get currentStatus() {
    const { queryParams } = this.router.currentRoute;
    const includesParams = (a, b) =>
      Object.entries(b).every(([k, v]) => a[k] === v);

    for (const [key, value] of Object.entries(STATUS_TO_QUERY_PARAMS)) {
      if (includesParams(queryParams, value)) {
        return key;
      }
    }
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
    this.router.transitionTo({
      queryParams: STATUS_TO_QUERY_PARAMS[newStatus],
    });
  }

  <template>
    {{#if this.shouldRender}}
      <li>
        <ComboBox
          @content={{this.statuses}}
          @value={{this.currentStatus}}
          @onSelect={{this.changeStatus}}
          @valueAttribute="value"
          class="topic-unanswered-filter-dropdown"
        />
      </li>
    {{/if}}
  </template>
}
