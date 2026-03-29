import { CatalogCategoryId } from '../catalog-categories';
import { InMemoryStorefrontDataRepository } from './storefront-data.mock-repository';

describe('InMemoryStorefrontDataRepository', () => {
  const repository = new InMemoryStorefrontDataRepository();

  it('returns category-filtered catalog items in storefront order', () => {
    const items = repository.getCatalogItems('retail-store', 'tyres' as CatalogCategoryId);

    expect(items.length).toBeGreaterThan(0);
    expect(items.every((item) => item.category === 'tyres')).toBe(true);
    expect(items[0].availability.origin).toBe('own');
  });

  it('returns a padded PDP item only when the category matches', () => {
    const product = repository.getProductBySlug(
      'michelin-pilot-sport-4s-325-30r21',
      'retail-store',
      'tyres' as CatalogCategoryId
    );

    expect(product?.slug).toBe('michelin-pilot-sport-4s-325-30r21');
    expect(product?.category).toBe('tyres');
    expect(product?.options.length).toBeGreaterThan(0);

    const missing = repository.getProductBySlug(
      'michelin-pilot-sport-4s-325-30r21',
      'retail-store',
      'wheels' as CatalogCategoryId
    );

    expect(missing).toBeUndefined();
  });
});
