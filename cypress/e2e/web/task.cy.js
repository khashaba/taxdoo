/// <reference types="cypress" />
describe("Booking Form", () => {
  const firstName = "Ahmed";
  const lastName = "Hassan";
  const email = "ahmed@ahmed.com";
  const companyName = `${firstName} ${lastName} test`;
  const salutation = "Mr";
  const address = "Valentinskamp 70, 20355 Hamburg DE";
  const addressSplit = address.split(" ");
  const vatNo = "DE123456789";
  const professionalPackagePrice = 349;
  let addonsExtraPriceTotal = 0;
  const addonsPrice = 99;

  before(() => {
    cy.visit("https://booking.test.env.taxdoo.com/");
    // cy.contains("Accept All").click();
    cy.get("#booking_form").should("be.visible");
  });
  context("Select Average Revenue", () => {
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

        if (revenueOption.package[0] === packageNotAvailableMessage) {
          cy.get("._packages__item_5qgvw_147")
            .eq(0)
            .should("have.class", "_package--disabled_5qgvw_179");
        }
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
  context("Choose Package and Add-ons", () => {
    it(`User selects Professional package`, () => {
      // add-ons should be disabled before selecting a package
      cy.get("._addons_5qgvw_381")
        .contains("OSS Export")
        .should("have.class", "_addon--disabled_5qgvw_417");
      cy.get("._packages__item_5qgvw_147").eq(1).contains("Choose").click();
      cy.get("._packages__item_5qgvw_147")
        .eq(1)
        .should("have.class", "_package--selected_5qgvw_184");
      // add-ons should be enabled after selecting a package
      cy.get("._addons_5qgvw_381")
        .contains("OSS Export")
        .should("not.have.class", "_addon--disabled_5qgvw_417");
      cy.get("._prices__price_5qgvw_591").contains(professionalPackagePrice);
    });

    it("User can add extra Add-ons", () => {
      cy.get("._prices__price_5qgvw_591").contains(addonsExtraPriceTotal);
      for (let i = 0; i < 4; i++) {
        cy.get("label._addon_5qgvw_381 > input").eq(i).click({ force: true });
        addonsExtraPriceTotal = addonsExtraPriceTotal + addonsPrice;
        cy.get("._prices__price_5qgvw_591").contains(addonsExtraPriceTotal);
      }
    });

    it("User remove extra Add-ons", () => {
      cy.get("label._addon_5qgvw_381 > input").eq(0).click({ force: true });
      addonsExtraPriceTotal = addonsExtraPriceTotal - addonsPrice;
      cy.get("._prices__price_5qgvw_591").contains(addonsExtraPriceTotal);
    });

    it("User add 'Submission of VAT returns by our tax advisors' Add-on for multiple countries", () => {
      cy.get("label._addon_5qgvw_381 > input").eq(4).click({ force: true });
      cy.get("input#netherlands").click();
      addonsExtraPriceTotal = addonsExtraPriceTotal + addonsPrice;
      cy.get("._prices__price_5qgvw_591").contains(addonsExtraPriceTotal);
      cy.get("input#spain").click();
      addonsExtraPriceTotal = addonsExtraPriceTotal + addonsPrice;
      cy.get("._prices__price_5qgvw_591").contains(addonsExtraPriceTotal);
    });
    it("User remove 'Submission of VAT returns by our tax advisors' Add-on for one country", () => {
      cy.get("input#netherlands").click();
      addonsExtraPriceTotal = addonsExtraPriceTotal - addonsPrice;
      cy.get("._prices__price_5qgvw_591").contains(addonsExtraPriceTotal);
    });
  });
  context("Fill Personal Information", () => {
    it(`User proceed to personal information `, () => {
      cy.contains("Next").click();
      cy.contains("Please enter your personal data.").should("be.visible");
    });
    it("User fill personal information", () => {
      cy.get("[name='company']").type(companyName);
      cy.get("[name='salutation']").select(salutation);
      cy.get("[name='name']").type(firstName);
      cy.get("[name='surname']").type(lastName);
      cy.get("[name='address']").type(`${address}{downArrow}{enter}`);
      cy.get("[name='street']").should("have.value", addressSplit[0]);
      cy.get("[name='streetNo']").should(
        "have.value",
        parseInt(addressSplit[1])
      );
      cy.get("[name='zip']").should("have.value", parseInt(addressSplit[2]));
      cy.get("[name='city']").should("have.value", addressSplit[3]);
      cy.get("[name='area']").should("have.value", addressSplit[3]);
      cy.get("[name='country']").should("have.value", addressSplit[4]);
      cy.get("[name='vatNo']").type(12342345).blur();
      cy.get("[src='/close44728.svg']").should("be.visible");
      cy.get("[name='vatNo']").clear().type(vatNo).blur();
      cy.wait(500);
      cy.get("[src='/close44728.svg']").should("not.exist");
      cy.get("[name='email']").type(email);
      cy.get("[name='tel']").type("0122888829");
      cy.get("[type='submit']").click("");
    });
  });
  context("Confirm Information", () => {
    const totalPrice = "886.55";
    it(`User should see the correct total monthly price`, () => {
      cy.contains("Total monthly price").parent().parent().contains(totalPrice);
    });

    it("User should see the correct personal data", () => {
      // should display company name
      cy.contains("Company Name").parent().contains(companyName);
      // should display name
      cy.contains(`Mr ${firstName} ${lastName}`);
      // should display address
      cy.contains("Address")
        .parent()
        .contains(`${addressSplit[0]} ${parseInt(addressSplit[1])}`);
      cy.contains("Address")
        .parent()
        .contains(`${addressSplit[2]}, ${addressSplit[3]}`);

      // then we can do the same for the rest of the fields
    });

    it("User should accept the terms and conditions and submit", () => {
      cy.get("#accept").click();
      cy.get("[type='submit']").contains("Complete booking").click();
    });
    it("User should see Booking successful screen", () => {
      cy.contains("Booking successful");
      cy.contains(
        `You will shortly receive a booking confirmation at ${email} with the next steps`
      );
    });
  });
});
