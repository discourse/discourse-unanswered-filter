import ComboBoxComponent from "select-kit/components/combo-box";
import discourseComputed from "discourse-common/utils/decorators";
import DiscourseURL from "discourse/lib/url";
import getURL from "discourse-common/lib/get-url";
import { inject as service } from "@ember/service";
import { computed } from "@ember/object";

export const ALL_TOPICS_ID = "all_topics";
export const UNANSWERED_TOPICS_ID = "unanswered";

export default ComboBoxComponent.extend({
  pluginApiIdentifiers: ["unanswered-drop"],
  classNames: ["unanswered-drop"],
  tagName: "li",
  router: service(),
  selectKitOptions: {
    allowAny: false,
    caretDownIcon: "caret-right",
    caretUpIcon: "caret-down",
    fullWidthOnMobile: false,
    filterable: false,
    autoInsertNoneItem: false
  },
 
  @discourseComputed("router.currentRoute")
  isVisible(currentRoute) {
    if (currentRoute.localName !== "categories") {
      return true;
    }
    return false;
  },

  @discourseComputed("router.currentURL")
  allTopicsUrl(currentURL) {
    return currentURL.replace(/[?&]max_posts=1/g, "");
  },

  @discourseComputed("router.currentRoute.queryParams")
  unansweredTopicsUrl(queryParams) {
    if(Object.keys(queryParams).length > 0) {
      return getURL(`${this.router.currentURL}&max_posts=1`);
    } else {
      return getURL(`${this.router.currentURL}?max_posts=1`);
    }
  },

  modifyNoSelection() {
    const currentRoute = this.router.currentRoute.queryParams;
    if (currentRoute.max_posts === "1") {
      return this.defaultItem(UNANSWERED_TOPICS_ID, I18n.t(themePrefix("unanswered_label")));
    } else {
      return this.defaultItem(ALL_TOPICS_ID, I18n.t(themePrefix("all_topics_label")));
    }
  },

  content: computed("shortcuts.[]", function() {
    return [
      { id: ALL_TOPICS_ID, name: I18n.t(themePrefix("all_topics_label")) }, 
      { id: UNANSWERED_TOPICS_ID, name: I18n.t(themePrefix("unanswered_label")) }
    ];
  }),

  actions: {
    onChange(unansweredId, value) {
      if(unansweredId === UNANSWERED_TOPICS_ID) {
        DiscourseURL.routeTo(getURL(this.unansweredTopicsUrl))
      } else {
        DiscourseURL.routeTo(getURL(this.allTopicsUrl))
      }
    }
  }
});
