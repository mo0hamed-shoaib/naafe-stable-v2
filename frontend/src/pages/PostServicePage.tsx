import React from 'react';
import Button from '../components/ui/Button';
import BaseCard from '../components/ui/BaseCard';
import { FormInput, FormTextarea, FormSelect } from "../components/ui";

const PostServicePage = () => {
  return (
    <div className="min-h-screen bg-warm-cream p-4">
      <div className="container mx-auto max-w-4xl">
        <BaseCard className="p-6">
          <h1 className="text-3xl font-bold text-text-primary mb-6 text-center">نشر خدمة جديدة</h1>
          <p className="text-text-secondary text-center mb-8">
            قم بنشر خدمتك للوصول إلى عملاء جدد
          </p>
          
          {/* Placeholder form - to be implemented */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                عنوان الخدمة
              </label>
              <FormInput
                type="text"
                placeholder="أدخل عنوان الخدمة"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                وصف الخدمة
              </label>
              <FormTextarea
                placeholder="أدخل وصف مفصل للخدمة"
                className="textarea textarea-bordered w-full h-32"
                disabled
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  الفئة
                </label>
                <FormSelect className="select select-bordered w-full" disabled aria-label="اختر الفئة">
                  <option>اختر الفئة</option>
                </FormSelect>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  السعر
                </label>
                <FormInput
                  type="number"
                  placeholder="السعر بالجنيه المصري"
                  className="input input-bordered w-full"
                  disabled
                />
              </div>
            </div>
            
            <div className="text-center">
              <Button variant="primary" size="lg" disabled>
                نشر الخدمة
              </Button>
              <p className="text-sm text-text-secondary mt-2">
                هذه الصفحة قيد التطوير
              </p>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  );
};

export default PostServicePage; 