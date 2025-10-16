
import React from 'react';

interface DistributionViewProps {
  metrics: {
    porTema: { [key: string]: number };
  };
}

const DistributionView: React.FC<DistributionViewProps> = ({ metrics }) => {
  const { porTema } = metrics;
  // FIX: The 'count' in reduce can be inferred as 'unknown'. Coercing to Number for the sum operation.
  const totalPublicaciones = Object.values(porTema).reduce((sum, count) => sum + Number(count), 0);

  const colors = [
    'from-[#841f82] to-[#a349a1]',
    'from-[#492b2b] to-[#6e4a4a]',
    'from-[#c173bf] to-[#d19ad0]',
    'from-[#936969] to-[#ad8d8d]',
    'from-[#841f82] to-[#a349a1]',
    'from-[#492b2b] to-[#6e4a4a]',
    'from-[#c173bf] to-[#d19ad0]',
    'from-[#936969] to-[#ad8d8d]',
    'from-[#841f82] to-[#a349a1]',
    'from-[#492b2b] to-[#6e4a4a]',
    'from-[#c173bf] to-[#d19ad0]',
    'from-[#936969] to-[#ad8d8d]',
  ];

  return (
    <div className="animate-fade-in">
      <h3 className="text-2xl font-bold text-[#492b2b] mb-6 text-center">Distribución por Temas</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(porTema).map(([tema, count], index) => {
          // FIX: The 'count' can be inferred as 'unknown'. Coercing to Number for arithmetic and comparison operations.
          const percentage = totalPublicaciones > 0 ? (Number(count) / totalPublicaciones) * 100 : 0;
          return (
            <div key={tema} className="bg-white p-4 rounded-lg shadow border border-[#ece1d4]">
              <h4 className="font-semibold text-[#492b2b] mb-2 truncate">{tema}</h4>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="h-3 bg-[#ece1d4] rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${colors[index % colors.length]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
                <span className="font-bold text-[#492b2b] text-sm">{count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DistributionView;