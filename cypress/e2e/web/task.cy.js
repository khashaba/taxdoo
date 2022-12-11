/// <reference types="cypress" />
describe("Booking Form", () => {
  before(() => {
    cy.visit("https://booking.test.env.taxdoo.com/");
    // cy.contains("Accept All").click();
    cy.get("#booking_form").should("be.visible");
  });
  context("Average Revenue Selection", () => {
    const packageNotAvailableMessage =
      "This package is only available with a GMV below 50.000€ per month";
    const revenueOptions = [
      { revenue: 1000, package: ["FREE", 49, 299] },
      { revenue: 10000, package: [19, 49, 299] },
      { revenue: 25000, package: [49, 49, 299] },
      { revenue: 50000, package: [99, 69, 349] },
      { revenue: 100000, package: [packageNotAvailableMessage, 99, 399] },
      { revenue: 200000, package: [packageNotAvailableMessage, 149, 499] },
      { revenue: 400000, package: [packageNotAvailableMessage, 249, 649] },
      {
        revenue: 400001,
        package: [packageNotAvailableMessage, 349, 799],
        extraMessages: [
          "",
          "Billed monthly, +100 €/mon for additional GMV of 500k €",
          "Billed annually, paid upfront, +150 €/mon for additional GMV of 500k €",
        ],
      },
    ];
    revenueOptions.forEach((revenueOption) => {
      it(`User selects average revenue ${revenueOption.revenue}`, () => {
        cy.get(`input#average-gross-${revenueOption.revenue}`).click({
          force: true,
        });
        cy.get("._packages__item_5qgvw_147")
          .eq(0)
          .contains(revenueOption.package[0])
          .should("be.visible");
        cy.get("._packages__item_5qgvw_147")
          .eq(1)
          .contains(revenueOption.package[1])
          .should("be.visible");
        cy.get("._packages__item_5qgvw_147")
          .eq(2)
          .contains(revenueOption.package[2])
          .should("be.visible");
          // To check the extra messages that are displayed inside the package card
          // Only checked if extraMessages variable is added to revenueOptions array to the respective element
        for (let i = 0; i < revenueOption.extraMessages?.length; i++) {
          if (revenueOption.extraMessages[i] != "") {
            cy.get("._packages__item_5qgvw_147")
              .eq(i)
              .contains(revenueOption.extraMessages[i])
              .should("be.visible");
          }
        }
      });
    });
  });
});
