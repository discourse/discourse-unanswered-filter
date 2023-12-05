import { acceptance } from "discourse/tests/helpers/qunit-helpers";
import { visit } from "@ember/test-helpers";
import { test } from "qunit";

acceptance("Unanswered Filter, link mode - logged out", function () {
  settings.filter_mode = "link";

  test("Unanswered filter appears for anons when group is unset", async function (assert) {
    settings.limit_to_groups = "";

    await visit("/c/2");
    assert.dom(".nav-item_unanswered").exists("Unanswered filter exists");
  });

  test("Unanswered filter does not appear for anons when group is set", async function (assert) {
    settings.limit_to_groups = "staff";

    await visit("/c/2");
    assert.dom(".nav-item_unanswered").doesNotExist("Unanswered filter exists");
  });
});

acceptance("Unanswered Filter, link mode, logged in", function (needs) {
  needs.user({ staff: true });
  settings.limit_to_groups = "staff";

  test("Unanswered filter link is shown to set group", async function (assert) {
    await visit("/c/1");

    assert
      .dom(".nav-item_unanswered")
      .exists("link appears for staff user when group is configured");
  });
});
