// lib/drizzle/seed/product_attribute_values.ts
import { db } from '../client';
import { product_attribute_values } from '@/lib/drizzle/schema';

export async function seedProductAttributeValues() {
    await db.insert(product_attribute_values).values([
        // Size (attribute_id: 2)
        { id: 19, name: 'S',            value: 's',            attribute_id: 2,  position: 0, active: true },
        { id: 20, name: 'M',            value: 'm',            attribute_id: 2,  position: 0, active: true },
        { id: 21, name: 'L',            value: 'l',            attribute_id: 2,  position: 0, active: true },
        { id: 22, name: 'XL',           value: 'xl',           attribute_id: 2,  position: 0, active: true },

        // Color (attribute_id: 3)
        { id: 24, name: 'White',        value: '#ffffff',      attribute_id: 3,  position: 0, active: true },
        { id: 25, name: 'Red',          value: '#ff0000',      attribute_id: 3,  position: 0, active: true },
        { id: 26, name: 'Blue',         value: '#0000ff',      attribute_id: 3,  position: 0, active: true },

        // Material (attribute_id: 4)
        { id: 27, name: 'Cotton',       value: 'cotton',       attribute_id: 4,  position: 0, active: true },
        { id: 28, name: 'Polyester',    value: 'polyester',    attribute_id: 4,  position: 0, active: true },
        { id: 29, name: 'Leather',      value: 'leather',      attribute_id: 4,  position: 0, active: true },

        // Gender (attribute_id: 5)
        { id: 30, name: 'Male',         value: 'male',         attribute_id: 5,  position: 0, active: true },
        { id: 31, name: 'Female',       value: 'female',       attribute_id: 5,  position: 0, active: true },
        { id: 32, name: 'Unisex',       value: 'unisex',       attribute_id: 5,  position: 0, active: true },

        // Storage Capacity (attribute_id: 8)
        { id: 33, name: '64GB',         value: '64gb',         attribute_id: 8,  position: 0, active: true },
        { id: 34, name: '128GB',        value: '128gb',        attribute_id: 8,  position: 0, active: true },
        { id: 35, name: '256GB',        value: '256gb',        attribute_id: 8,  position: 0, active: true },

        // RAM (attribute_id: 9)
        { id: 36, name: '4GB',          value: '4gb',          attribute_id: 9,  position: 0, active: true },
        { id: 37, name: '8GB',          value: '8gb',          attribute_id: 9,  position: 0, active: true },
        { id: 38, name: '16GB',         value: '16gb',         attribute_id: 9,  position: 0, active: true },

        // Screen Size (attribute_id: 11)
        { id: 39, name: '5 inch',       value: '5inch',        attribute_id: 11, position: 0, active: true },
        { id: 40, name: '6 inch',       value: '6inch',        attribute_id: 11, position: 0, active: true },
        { id: 41, name: '6.5 inch',     value: '6_5inch',      attribute_id: 11, position: 0, active: true },

        // Operating System (attribute_id: 14)
        { id: 42, name: 'Android',      value: 'android',      attribute_id: 14, position: 0, active: true },
        { id: 43, name: 'iOS',          value: 'ios',          attribute_id: 14, position: 0, active: true },
        { id: 44, name: 'Windows',      value: 'windows',      attribute_id: 14, position: 0, active: true },

        // Connectivity (attribute_id: 15)
        { id: 45, name: 'WiFi',         value: 'wifi',         attribute_id: 15, position: 0, active: true },
        { id: 46, name: 'Bluetooth',    value: 'bluetooth',    attribute_id: 15, position: 0, active: true },
        { id: 47, name: '5G',           value: '5g',           attribute_id: 15, position: 0, active: true },

        // Warranty (attribute_id: 18)
        { id: 48, name: '6 months',     value: '6months',      attribute_id: 18, position: 0, active: true },
        { id: 49, name: '1 year',       value: '1year',        attribute_id: 18, position: 0, active: true },
        { id: 50, name: '2 years',      value: '2years',       attribute_id: 18, position: 0, active: true },

        // Pattern (attribute_id: 20)
        { id: 51, name: 'Solid',        value: 'solid',        attribute_id: 20, position: 0, active: true },
        { id: 52, name: 'Striped',      value: 'striped',      attribute_id: 20, position: 0, active: true },
        { id: 53, name: 'Printed',      value: 'printed',      attribute_id: 20, position: 0, active: true },

        // Fit Type (attribute_id: 21)
        { id: 54, name: 'Slim Fit',     value: 'slim_fit',     attribute_id: 21, position: 0, active: true },
        { id: 55, name: 'Regular Fit',  value: 'regular_fit',  attribute_id: 21, position: 0, active: true },

        // Sleeve Type (attribute_id: 22)
        { id: 56, name: 'Short Sleeve', value: 'short_sleeve', attribute_id: 22, position: 0, active: true },
        { id: 57, name: 'Long Sleeve',  value: 'long_sleeve',  attribute_id: 22, position: 0, active: true },

        // Neck Type (attribute_id: 23)
        { id: 58, name: 'Round Neck',   value: 'round_neck',   attribute_id: 23, position: 0, active: true },
        { id: 59, name: 'V-Neck',       value: 'v_neck',       attribute_id: 23, position: 0, active: true },

        // Closure Type (attribute_id: 24)
        { id: 60, name: 'Zipper',       value: 'zipper',       attribute_id: 24, position: 0, active: true },
        { id: 61, name: 'Button',       value: 'button',       attribute_id: 24, position: 0, active: true },

        // Heel Height (attribute_id: 25)
        { id: 62, name: 'Flat',         value: 'flat',         attribute_id: 25, position: 0, active: true },
        { id: 63, name: 'High',         value: 'high',         attribute_id: 25, position: 0, active: true },

        // Sole Material (attribute_id: 26)
        { id: 64, name: 'Rubber',       value: 'rubber',       attribute_id: 26, position: 0, active: true },
        { id: 65, name: 'Leather',      value: 'leather',      attribute_id: 26, position: 0, active: true },

        // Water Resistance (attribute_id: 27)
        { id: 66, name: 'Yes',          value: 'yes',          attribute_id: 27, position: 0, active: true },
        { id: 67, name: 'No',           value: 'no',           attribute_id: 27, position: 0, active: true },

        // Usage (attribute_id: 28)
        { id: 68, name: 'Casual',       value: 'casual',       attribute_id: 28, position: 0, active: true },
        { id: 69, name: 'Formal',       value: 'formal',       attribute_id: 28, position: 0, active: true },

        // Season (attribute_id: 29)
        { id: 70, name: 'Summer',       value: 'summer',       attribute_id: 29, position: 0, active: true },
        { id: 71, name: 'Winter',       value: 'winter',       attribute_id: 29, position: 0, active: true },

        // Power Source (attribute_id: 30)
        { id: 72, name: 'Battery',      value: 'battery',      attribute_id: 30, position: 0, active: true },
        { id: 73, name: 'Electric',     value: 'electric',     attribute_id: 30, position: 0, active: true },

        // Fragrance (attribute_id: 34)
        { id: 74, name: 'Floral',       value: 'floral',       attribute_id: 34, position: 0, active: true },
        { id: 75, name: 'Woody',        value: 'woody',        attribute_id: 34, position: 0, active: true },

        // Skin Type (attribute_id: 35)
        { id: 76, name: 'Dry',          value: 'dry',          attribute_id: 35, position: 0, active: true },
        { id: 77, name: 'Oily',         value: 'oily',         attribute_id: 35, position: 0, active: true },

        // SPF (attribute_id: 37)
        { id: 78, name: 'SPF 15',       value: 'spf15',        attribute_id: 37, position: 0, active: true },
        { id: 79, name: 'SPF 30',       value: 'spf30',        attribute_id: 37, position: 0, active: true },

        // Coverage (attribute_id: 38)
        { id: 80, name: 'Light',        value: 'light',        attribute_id: 38, position: 0, active: true },
        { id: 81, name: 'Full',         value: 'full',         attribute_id: 38, position: 0, active: true },

        // Finish (attribute_id: 39)
        { id: 82, name: 'Matte',        value: 'matte',        attribute_id: 39, position: 0, active: true },
        { id: 83, name: 'Glossy',       value: 'glossy',       attribute_id: 39, position: 0, active: true },

        // Age Group (attribute_id: 40)
        { id: 84, name: 'Kids',         value: 'kids',         attribute_id: 40, position: 0, active: true },
        { id: 85, name: 'Adults',       value: 'adults',       attribute_id: 40, position: 0, active: true },

        // Custom Engraving (attribute_id: 41)
        { id: 86, name: 'Yes',          value: 'yes',          attribute_id: 41, position: 0, active: true },
        { id: 87, name: 'No',           value: 'no',           attribute_id: 41, position: 0, active: true },

        // ⚠️  id: 96 skipped — active: false & attribute_id: null (broken record)

    ]).onConflictDoNothing();

    console.log('✅ Product attribute values seeded');
}