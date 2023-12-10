# frozen_string_literal: true

RSpec.describe "Unanswered Filter Component - logged-out in dropdown test",
               system: true do
  let!(:theme) { upload_theme_component }

  fab!(:category)
  fab!(:group)

  it "anon does not see the link when filter_mode is set to dropdown" do
    theme.update_setting(:filter_mode, "dropdown")
    theme.save!

    visit("/c/#{category.id}")

    expect(page).to have_no_css(".nav-item_unanswered")
  end

  it "anon can see and click the dropdown" do
    theme.update_setting(:filter_mode, "dropdown")
    theme.save!

    visit("/c/#{category.id}")

    expect(page).to have_css(".topic-unanswered-filter-dropdown")

    find(".topic-unanswered-filter-dropdown").click
    find("[data-name='unanswered']").click

    expect(page).to have_current_path("#{category.url}?max_posts=1")
  end

  it "dropdown value changes based on URL" do
    theme.update_setting(:filter_mode, "dropdown")
    theme.save!

    puts theme.build_settings_hash.inspect
    puts "/c/#{category.id}?min_posts=2"

    visit("/c/#{category.id}?min_posts=2")

    expect(page).to have_current_path("#{category.url}?min_posts=2")
    expect(page).to have_css(".topic-unanswered-filter-dropdown")
    expect(
      find(".topic-unanswered-filter-dropdown .selected-name")
    ).to have_content("answered")

    visit("/c/#{category.id}")

    expect(page).to have_current_path(category.url)
    expect(page).to have_css(".topic-unanswered-filter-dropdown")
    expect(
      find(".topic-unanswered-filter-dropdown .selected-name")
    ).to have_content("any status")
  end

  it "anon does not see the dropdown when on a route listed in the exclusions setting" do
    theme.update_setting(:filter_mode, "dropdown")
    theme.update_setting(:exclusions, "/top")
    theme.save!

    visit("/top")

    expect(page).to have_no_css(".topic-unanswered-filter-dropdown")
  end

  it "anon will not see the dropdown when limit_to_groups setting is set" do
    theme.update_setting(:filter_mode, "dropdown")
    theme.update_setting(:limit_to_groups, "#{group.id}")
    theme.save!

    visit("/c/#{category.id}")

    expect(page).to have_no_css(".topic-unanswered-filter-dropdown")
  end
end
