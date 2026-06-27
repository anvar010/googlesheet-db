-- Run in cPanel → phpMyAdmin (select database d5241_ivhub_all first)

-- sheet_justlife: "Service Total no VAT" was imported as received_amount
ALTER TABLE `sheet_justlife`
  RENAME COLUMN `received_amount` TO `service_total_no_vat`;

-- sheet_peptides: "Service Total no VAT" was imported as booking_amount
ALTER TABLE `sheet_peptides`
  RENAME COLUMN `booking_amount` TO `service_total_no_vat`;

-- sheet_palm: "Provider" was imported as provider_converted_by
ALTER TABLE `sheet_palm`
  RENAME COLUMN `provider_converted_by` TO `provider`;
