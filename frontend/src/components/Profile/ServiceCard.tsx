import React from 'react';
import { Service } from '../../types/Profile';

interface ServiceCardProps {
  service: Service;
  onBookNow: (serviceId: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBookNow }) => {
  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <figure className="aspect-video">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover"
        />
      </figure>
      <div className="card-body">
        <h3 className="card-title text-lg font-semibold text-neutral font-jakarta">
          {service.title}
        </h3>
        <p className="text-neutral/70 text-sm font-jakarta">
          {service.description}
        </p>
        <div className="card-actions justify-end mt-4">
          <button
            onClick={() => onBookNow(service.id)}
            className="btn btn-accent btn-sm w-full font-jakarta"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard; 