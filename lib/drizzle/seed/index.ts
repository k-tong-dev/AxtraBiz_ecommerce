import { seedCurrencies }             from './res_currencies';
import { seedPermissions }            from './res_permissions';
import { seedGroups }                 from './res_groups';
import { seedProductAttributes }      from './product_attributes';
import { seedProductAttributeValues } from './product_attribute_values';
import { seedProductCategories }      from './product_categories';

async function main() {
    console.log('🌱 Starting seed...\n');

    try {
        // Order matters — seed parent tables first
        await seedCurrencies();
        await seedPermissions();
        await seedGroups();
        await seedProductAttributes();
        await seedProductAttributeValues(); // depends on attributes
        await seedProductCategories();

        console.log('\n✅ All seeds completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
}

main();