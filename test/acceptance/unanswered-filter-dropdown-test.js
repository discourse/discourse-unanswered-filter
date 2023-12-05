import { acceptance, query } from "discourse/tests/helpers/qunit-helpers";
import { visit } from "@ember/test-helpers";
import { test } from "qunit";
import sinon from "sinon";
import UnansweredFilter from "../../discourse/components/unanswered-filter";

acceptance("Unanswered Filter, dropdown mode - logged out", function () {
  settings.filter_mode = "dropdown";

  test("Unanswered filter appears", async function (assert) {
    await visit("/latest");
    assert
      .dom(".topic-unanswered-filter-dropdown")
      .exists("Unanswered filter exists");
  });

  test("Filter value is answered", async function (assert) {
    let stub = sinon
      .stub(UnansweredFilter.prototype, "updateStatusFromQuery")
      .callsFake(function () {
        this.currentStatus = "answered";
      });

    await visit("/latest");

    assert.ok(
      query(".topic-unanswered-filter-dropdown .name").innerText.includes(
        "answered"
      )
    );
    stub.restore();
  });

  test("Filter value is unanswered", async function (assert) {
    let stub = sinon
      .stub(UnansweredFilter.prototype, "updateStatusFromQuery")
      .callsFake(function () {
        this.currentStatus = "unanswered";
      });

    await visit("/latest");

    assert.ok(
      query(".topic-unanswered-filter-dropdown .name").innerText.includes(
        "unanswered"
      )
    );
    stub.restore();
  });

  test("Filter does not appear on excluded route", async function (assert) {
    settings.exclusions = "/top";

    await visit("/top");
    assert
      .dom(".topic-unanswered-filter-dropdown")
      .doesNotExist("Unanswered filter does not appear");
  });

  test("Filter does not appear for anon when the staff setting is enabled", async function (assert) {
    settings.limit_to_groups = "staff";

    await visit("/latest");
    assert
      .dom(".topic-unanswered-filter-dropdown")
      .doesNotExist("Unanswered filter does not appear");
  });
});

acceptance("Unanswered Filter, dropdown mode - logged in", function (needs) {
  settings.filter_mode = "dropdown";

  needs.user({ staff: true });
  settings.limit_to_groups = "staff";

  test("Filter appears for staff when the staff setting is enabled", async function (assert) {
    await visit("/latest");
    assert
      .dom(".topic-unanswered-filter-dropdown")
      .exists("Unanswered filter appears only for staff");
  });
});
