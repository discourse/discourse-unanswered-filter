# frozen_string_literal: true

RSpec.describe "Unanswered Filter Component - logged-in dropdown test", system: true do
  let!(:theme) { upload_theme_component }

  fab!(:user)
  fab!(:category)
  fab!(:group)
  fab!(:group_user) { Fabricate(:group_user, user: user, group: group) }

  it "user does not see the link when filter_mode is set to dropdown" do
    theme.update_setting(:filter_mode, "dropdown")
    theme.save!

    sign_in(user)
    visit("/c/#{category.id}")

    expect(page).to have_no_css(".nav-item_unanswered")
  end

  it "user can see and click the dropdown" do
    theme.update_setting(:filter_mode, "dropdown")
    theme.save!

    sign_in(user)
    visit("/c/#{category.id}")

    expect(page).to have_css(".topic-unanswered-filter-dropdown")

    find(".topic-unanswered-filter-dropdown").click
    find("[data-name='unanswered']").click

    expect(page).to have_current_path("#{category.url}?max_posts=1")
  end

  it "user does not see the dropdown when on a route listed in the exclusions setting" do
    theme.update_setting(:filter_mode, "dropdown")
    theme.update_setting(:exclusions, "/top")
    theme.save!

    sign_in(user)
    visit("/top")

    expect(page).to have_no_css(".topic-unanswered-filter-dropdown")
  end

  it "user will see the dropdown if they are in a group listed by the limit_to_groups setting" do
    theme.update_setting(:filter_mode, "dropdown")
    theme.update_setting(:limit_to_groups, "#{group.id}")
    theme.save!

    sign_in(user)
    visit("/c/#{category.id}")

    expect(page).to have_css(".topic-unanswered-filter-dropdown")

    theme.update_setting(:filter_mode, "dropdown")
    theme.update_setting(:limit_to_groups, "#{group.id + 1}")
    theme.save!

    visit("/c/#{category.id}")

    expect(page).to have_no_css(".topic-unanswered-filter-dropdown")
  end
end
