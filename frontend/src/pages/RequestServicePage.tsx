import React from 'react';
import Button from '../components/ui/Button';
import BaseCard from '../components/ui/BaseCard';
import { FormInput, FormTextarea, FormSelect } from "../components/ui";

const RequestServicePage = () => {
  return (
    <div className="min-h-screen bg-warm-cream p-4">
      <div className="container mx-auto max-w-4xl">
        <BaseCard className="p-6">
          <h1 className="text-3xl font-bold text-text-primary mb-6 text-center">طلب خدمة جديدة</h1>
          <p className="text-text-secondary text-center mb-8">
            اكتب تفاصيل الخدمة التي تحتاجها وسيقوم المحترفون بتقديم عروضهم
          </p>
          
          {/* Placeholder form - to be implemented */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                عنوان الطلب
              </label>
              <FormInput
                type="text"
                placeholder="أدخل عنوان الطلب"
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                وصف الطلب
              </label>
              <FormTextarea
                placeholder="أدخل وصف مفصل للخدمة المطلوبة"
                className="textarea textarea-bordered w-full h-32"
                disabled
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  الميزانية الدنيا
                </label>
                <FormInput
                  type="number"
                  placeholder="الحد الأدنى"
                  className="input input-bordered w-full"
                  disabled
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  الميزانية القصوى
                </label>
                <FormInput
                  type="number"
                  placeholder="الحد الأقصى"
                  className="input input-bordered w-full"
                  disabled
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                الموقع
              </label>
              <FormInput
                type="text"
                placeholder="أدخل العنوان أو المنطقة"
                className="input input-bordered w-full"
                disabled
              />
            </div>
            
            <div className="text-center">
              <Button variant="primary" size="lg" disabled>
                نشر الطلب
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

export default RequestServicePage; 