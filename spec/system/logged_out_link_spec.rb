# frozen_string_literal: true

RSpec.describe "Unanswered Filter Component - logged-out link test",
               system: true do
  let!(:theme) { upload_theme_component }

  fab!(:category)
  fab!(:group)

  it "anon does not see the dropdown when filter_mode is set to link" do
    theme.update_setting(:filter_mode, "link")
    theme.save!

    visit("/c/#{category.id}")

    expect(page).not_to have_css(".topic-unanswered-filter-dropdown")
  end

  it "anon can see and click the link" do
    theme.update_setting(:filter_mode, "link")
    theme.save!

    visit("/c/#{category.id}")

    expect(page).to have_css(".nav-item_unanswered")

    find(".nav-item_unanswered").click

    expect(page).to have_current_path("#{category.url}?max_posts=1")
  end

  it "anon does not see the link when on a route listed in the exclusions setting" do
    theme.update_setting(:filter_mode, "link")
    theme.update_setting(:exclusions, "/top")
    theme.save!

    visit("/top")

    expect(page).not_to have_css(".nav-item_unanswered")
  end

  it "anon will not see the link if the limit_to_groups setting is set" do
    theme.update_setting(:filter_mode, "link")
    theme.update_setting(:limit_to_groups, "#{group.id}")
    theme.save!

    visit("/c/#{category.id}")

    expect(page).not_to have_css(".nav-item_unanswered")
  end
end
