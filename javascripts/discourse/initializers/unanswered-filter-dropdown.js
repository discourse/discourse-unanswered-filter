import { apiInitializer } from "discourse/lib/api";
import UnansweredFilter from "../components/unanswered-filter";

export default apiInitializer("1.13.0", (api) => {
  if (settings.filter_mode === "dropdown") {
    api.renderInOutlet("bread-crumbs-right", UnansweredFilter);
  }
});
