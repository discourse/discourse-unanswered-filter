# frozen_string_literal: true

RSpec.describe "Unanswered Filter Component - logged-in link test",
               system: true do
  let!(:theme) { upload_theme_component }

  fab!(:user)
  fab!(:category)
  fab!(:group)
  fab!(:group_user) { Fabricate(:group_user, user: user, group: group) }

  it "user does not see the dropdown when filter_mode is set to link" do
    sign_in(user)

    theme.update_setting(:filter_mode, "link")
    theme.save!

    visit("/c/#{category.id}")

    expect(page).not_to have_css(".topic-unanswered-filter-dropdown")
  end

  it "user can see and click the link" do
    sign_in(user)

    theme.update_setting(:filter_mode, "link")
    theme.save!

    visit("/c/#{category.id}")

    expect(page).to have_css(".nav-item_unanswered")

    find(".nav-item_unanswered").click

    expect(page).to have_current_path("#{category.url}?max_posts=1")
  end

  it "user does not see the link when on a route listed in the exclusions setting" do
    sign_in(user)

    theme.update_setting(:filter_mode, "link")
    theme.update_setting(:exclusions, "/top")
    theme.save!

    visit("/top")

    expect(page).not_to have_css(".nav-item_unanswered")
  end

  it "user will see the link if they are in a group listed by the limit_to_groups setting" do
    sign_in(user)

    theme.update_setting(:filter_mode, "link")
    theme.update_setting(:limit_to_groups, "#{group.id}")
    theme.save!

    visit("/c/#{category.id}")

    expect(page).to have_css(".nav-item_unanswered")

    theme.update_setting(:filter_mode, "link")
    theme.update_setting(:limit_to_groups, "99")
    theme.save!

    visit("/c/#{category.id}")

    expect(page).not_to have_css(".nav-item_unanswered")
  end
end
