import Button from './ui/Button';


interface CustomTaskCTAProps {
  onPostTask?: () => void;
}

const CustomTaskCTA = ({ onPostTask }: CustomTaskCTAProps) => {
  return (
    <div className="card bg-deep-teal text-white shadow-lg col-span-1 sm:col-span-2 lg:col-span-4 rounded-2xl overflow-hidden">
      <div className="card-body p-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-deep-teal/80 to-transparent"></div>
          <div className="relative">
            <h3 className="card-title text-2xl font-bold">تحتاج شيئاً آخر؟</h3>
            <p className="mt-2 max-w-md text-light-cream">
              انشر مهمة مخصصة واحصل على عروض من محترفين ماهرين في دقائق.
            </p>
            <div className="card-actions mt-6">
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={onPostTask}
              >
                نشر مهمة مخصصة
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomTaskCTA;