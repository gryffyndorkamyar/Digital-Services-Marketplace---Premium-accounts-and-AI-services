import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, List, Loader } from 'lucide-react';
import { categoriesAPI } from '../services/api';

interface Category {
  id: string;
  name: string;
  name_en?: string;
  description?: string;
  image?: string;
  is_featured?: boolean;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const [allCategories, featured] = await Promise.all([
          categoriesAPI.getAll<Category>(),
          categoriesAPI.getFeatured<Category>(),
        ]);
        setCategories(allCategories);
        setFeaturedCategories(featured);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 pb-20 flex items-center justify-center">
        <Loader className="w-12 h-12 text-neonOrange animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 pb-20 px-4 relative overflow-hidden">
      {/* پس‌زمینه نئونی */}
      <div className="absolute inset-0 neon-bg">
        <div className="absolute top-0 left-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-neonOrange/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* هدر */}
        <div className="flex items-center justify-between mb-8 mt-8">
          <h1 className="text-4xl md:text-5xl font-bold neon-glow">دسته‌بندی‌ها</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-neonOrange text-white'
                  : 'bg-dark-card text-gray-400 hover:text-neonOrange'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-neonOrange text-white'
                  : 'bg-dark-card text-gray-400 hover:text-neonOrange'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* دسته‌بندی‌های ویژه */}
        {featuredCategories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-neonOrange">دسته‌بندی‌های ویژه</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.id}/products`}
                  className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-2xl p-6 hover:border-neonOrange hover:scale-105 transition-all group"
                >
                  {category.image && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2 text-neonOrange group-hover:text-neonOrange-light transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-gray-300 text-sm line-clamp-2">{category.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* همه دسته‌بندی‌ها */}
        <div>
          <h2 className="text-2xl font-bold mb-6 text-neonOrange">همه دسته‌بندی‌ها</h2>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.id}/products`}
                  className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-xl p-6 hover:border-neonOrange hover:scale-105 transition-all group text-center"
                >
                  {category.image && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-32 object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-neonOrange group-hover:text-neonOrange-light transition-colors">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/categories/${category.id}/products`}
                  className="bg-dark-card/90 backdrop-blur-md border border-neonOrange/30 rounded-xl p-6 hover:border-neonOrange transition-all flex items-center gap-6 group"
                >
                  {category.image && (
                    <div className="w-24 h-24 overflow-hidden rounded-lg flex-shrink-0">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-neonOrange group-hover:text-neonOrange-light transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-gray-300 text-sm">{category.description}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;

